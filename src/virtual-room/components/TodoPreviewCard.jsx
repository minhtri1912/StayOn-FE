import { useState, useEffect, useRef } from 'react';

export default function TodoPreviewCard({ userId }) {
  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const previousDataRef = useRef(null);

  // Fetch todos for preview with template images
  const fetchTodos = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }

      // Fetch todos for multiple dates
      const dates = [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + 86400000).toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0]
      ];

      const promises = dates.map((date) =>
        fetch(
          `https://api.stayon.io.vn/api/todos/lists?userId=${userId}&date=${date}`
        )
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      );

      const results = await Promise.all(promises);
      const allTodos = results.flat();

      // Remove duplicates
      const uniqueTodos = Array.from(
        new Map(allTodos.map((todo) => [todo.id, todo])).values()
      );

      // Fetch template images for todos that have templateId
      const todosWithImages = await Promise.all(
        uniqueTodos.slice(0, 4).map(async (todo) => {
          if (todo.templateId) {
            try {
              const res = await fetch(
                `https://api.stayon.io.vn/api/templates/${todo.templateId}`
              );
              if (res.ok) {
                const template = await res.json();
                return { ...todo, previewImage: template.previewImage };
              }
            } catch (err) {
              console.error('Failed to fetch template image:', err);
            }
          }
          return todo;
        })
      );

      const newData = todosWithImages.slice(0, 3);

      // Only update if data actually changed (prevent unnecessary re-renders)
      const newDataString = JSON.stringify(newData);
      if (previousDataRef.current !== newDataString) {
        previousDataRef.current = newDataString;
        setTodoLists(newData);
      }
    } catch (err) {
      console.error('Failed to fetch todos for preview:', err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTodos(true); // Initial load with loading state
    // Refresh every 3 seconds for real-time updates (without loading state)
    const interval = setInterval(() => fetchTodos(false), 3000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '160px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            color: 'white'
          }}
        >
          Loading todos...
        </div>
      </div>
    );
  }

  if (todoLists.length === 0) {
    return null; // Don't show if no todos
  }

  // Color palette for cards
  const colors = [
    { bg: 'rgba(255, 182, 193, 0.3)', border: 'rgba(255, 105, 180, 0.5)' }, // Pink
    { bg: 'rgba(176, 224, 230, 0.3)', border: 'rgba(72, 209, 204, 0.5)' }, // Turquoise
    { bg: 'rgba(245, 222, 179, 0.3)', border: 'rgba(244, 164, 96, 0.5)' }, // Beige
    { bg: 'rgba(255, 228, 181, 0.3)', border: 'rgba(255, 165, 0, 0.5)' } // Orange
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        left: '40px',
        bottom: '100px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}
    >
      {todoLists.map((list, index) => {
        const color = colors[index % colors.length];
        const completedCount =
          list.items?.filter((i) => i.isCompleted).length || 0;
        const totalCount = list.items?.length || 0;

        return (
          <div
            key={list.id}
            style={{
              width: '220px',
              minWidth: '220px',
              maxWidth: '220px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${color.border}`,
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
              // Background image for entire card
              backgroundImage: list.previewImage
                ? `url(${list.previewImage})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: list.previewImage ? 'transparent' : color.bg
            }}
          >
            {/* Background overlay for better readability */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: list.previewImage
                  ? 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                  : 'transparent',
                zIndex: 0
              }}
            />

            {/* Delete button */}
            <button
              onClick={async () => {
                if (confirm(`Delete "${list.title}"?`)) {
                  try {
                    const res = await fetch(
                      `https://api.stayon.io.vn/api/todos/lists/${list.id}`,
                      {
                        method: 'DELETE'
                      }
                    );

                    if (res.ok || res.status === 204) {
                      console.log('✅ List deleted');
                      fetchTodos(); // Refresh
                    } else {
                      const error = await res.text();
                      console.error(
                        '❌ Failed to delete list:',
                        res.status,
                        error
                      );
                      alert(`Failed to delete: ${res.status}`);
                    }
                  } catch (err) {
                    console.error('Failed to delete list:', err);
                    alert(`Error: ${err.message}`);
                  }
                }
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 10,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(244, 67, 54, 0.9)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            {/* Header */}
            <div
              style={{
                padding: '16px 16px 8px',
                fontWeight: '700',
                fontSize: '16px',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                position: 'relative',
                zIndex: 1
              }}
            >
              {list.title}
            </div>

            {/* Content wrapper */}
            <div
              style={{
                padding: '0 10px 10px 10px',
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Items */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '10px'
                }}
              >
                {list.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: item.isCompleted
                        ? 'rgba(255, 255, 255, 0.5)'
                        : 'rgba(255, 255, 255, 0.9)',
                      textDecoration: item.isCompleted
                        ? 'line-through'
                        : 'none',
                      cursor: 'pointer',
                      padding: '3px',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onClick={async () => {
                      try {
                        const endpoint = item.isCompleted
                          ? `https://api.stayon.io.vn/api/todos/items/${item.id}/uncomplete`
                          : `https://api.stayon.io.vn/api/todos/items/${item.id}/complete`;

                        const res = await fetch(endpoint, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: item.isCompleted
                            ? undefined
                            : JSON.stringify({ actualMinutes: 30 })
                        });

                        if (res.ok) {
                          fetchTodos(); // Refresh
                        }
                      } catch (err) {
                        console.error('Failed to toggle item:', err);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: item.isCompleted
                          ? 'rgba(76, 175, 80, 0.8)'
                          : 'rgba(255, 255, 255, 0.3)',
                        border: '1.5px solid rgba(255, 255, 255, 0.5)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {item.isCompleted && '✓'}
                    </div>
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.content}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  paddingTop: '6px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: '600'
                }}
              >
                {completedCount}/{totalCount} completed
              </div>
            </div>
          </div>
        );
      })}

      {/* Add new list hint */}
      {todoLists.length < 3 && (
        <div
          style={{
            width: '220px',
            minWidth: '220px',
            maxWidth: '220px',
            padding: '16px',
            borderRadius: '12px',
            border: '2px dashed rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => {
            // Open todo modal
            document.querySelector('[title="Todo & Templates"]')?.click();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          + Add Todo List
        </div>
      )}
    </div>
  );
}
