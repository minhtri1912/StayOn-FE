import { useState, useEffect, useRef } from 'react';
import helpers from '@/helpers';

export default function TodoTemplateModal({ open, onClose, userId }) {
  const [activeTab, setActiveTab] = useState('todo'); // 'todo' or 'template'
  const [todos, setTodos] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [newItemContent, setNewItemContent] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemContent, setEditingItemContent] = useState('');
  const previousTodosRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);

  // Fetch todos
  const fetchTodos = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      // Try multiple dates to account for timezone differences
      const dates = [
        new Date().toISOString().split('T')[0], // Today local time
        new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
      ];

      console.log('📋 Fetching todos for dates:', dates);

      // Fetch todos for all 3 dates
      const promises = dates.map((date) =>
        fetch(
          `https://api.stayon.io.vn/api/todos/lists?userId=${userId}&date=${date}`
        )
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      );

      const results = await Promise.all(promises);
      const allTodos = results.flat();

      // Remove duplicates by ID
      const uniqueTodos = Array.from(
        new Map(allTodos.map((todo) => [todo.id, todo])).values()
      );

      // Only update if data actually changed
      const newDataString = JSON.stringify(uniqueTodos);
      if (previousTodosRef.current !== newDataString) {
        previousTodosRef.current = newDataString;
        console.log('📋 Fetched todos:', uniqueTodos.length, 'unique items');
        setTodos(uniqueTodos);
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.stayon.io.vn/api/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo list
  const createTodoList = async () => {
    if (!newTodoTitle.trim()) return;

    try {
      const res = await fetch('https://api.stayon.io.vn/api/todos/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: newTodoTitle,
          description: '',
          date: new Date().toISOString()
        })
      });

      if (res.ok) {
        setNewTodoTitle('');
        fetchTodos(false);
      }
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  // Delete todo list - Backend doesn't have this endpoint yet, so we'll hide the delete button
  // TODO: Add DELETE /api/todos/lists/{id} endpoint in backend
  const deleteTodoList = async (listId) => {
    if (!confirm('Delete this todo list?')) return;

    try {
      const res = await fetch(
        `https://api.stayon.io.vn/api/todos/lists/${listId}`,
        {
          method: 'DELETE'
        }
      );

      if (res.ok || res.status === 204) {
        console.log('✅ List deleted');
        fetchTodos(false);
      } else {
        const error = await res.text();
        console.error('❌ Failed to delete list:', res.status, error);
        alert(`Failed to delete: ${res.status}`);
      }
    } catch (err) {
      console.error('Failed to delete todo:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Add item to todo list
  const addItemToList = async (listId) => {
    const content = newItemContent[listId]?.trim();
    if (!content) {
      console.log('❌ No content to add');
      return;
    }

    console.log('➕ Adding item:', { listId, content });

    try {
      const payload = {
        content,
        priority: 1,
        estimatedMinutes: 30
      };

      console.log(
        '📤 POST:',
        `https://api.stayon.io.vn/api/todos/lists/${listId}/items`,
        payload
      );

      const res = await fetch(
        `https://api.stayon.io.vn/api/todos/lists/${listId}/items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      console.log('📥 Response:', res.status, res.statusText);

      if (res.ok) {
        console.log('✅ Item added successfully');
        setNewItemContent({ ...newItemContent, [listId]: '' });
        await fetchTodos(false);
      } else {
        const error = await res.text();
        console.error('❌ Failed to add item:', res.status, error);
        alert(`Failed to add item: ${res.status} ${error}`);
      }
    } catch (err) {
      console.error('❌ Exception adding item:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Toggle item completion
  const toggleItemComplete = async (itemId, isCompleted) => {
    try {
      const endpoint = isCompleted
        ? `https://api.stayon.io.vn/api/todos/items/${itemId}/uncomplete`
        : `https://api.stayon.io.vn/api/todos/items/${itemId}/complete`;

      const res = await fetch(endpoint, {
        method: 'PATCH', // Backend uses PATCH, not POST
        headers: { 'Content-Type': 'application/json' },
        body: isCompleted ? undefined : JSON.stringify({ actualMinutes: 30 }) // Only send body for complete
      });

      if (res.ok) {
        fetchTodos(false);
      }
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    console.log('🗑️ Deleting item:', itemId);

    try {
      const res = await fetch(
        `https://api.stayon.io.vn/api/todos/items/${itemId}`,
        {
          method: 'DELETE'
        }
      );

      console.log('📥 Delete item response:', res.status);

      if (res.ok) {
        console.log('✅ Item deleted');
        await fetchTodos(false);
      } else {
        const error = await res.text();
        console.error('❌ Failed to delete item:', res.status, error);
        alert(`Failed to delete item: ${res.status} ${error}`);
      }
    } catch (err) {
      console.error('❌ Exception deleting item:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Update item
  const updateItem = async (itemId, content) => {
    console.log('✏️ Updating item:', itemId, content);

    try {
      const payload = {
        content: content,
        priority: 1,
        estimatedMinutes: 30
      };

      const res = await fetch(
        `https://api.stayon.io.vn/api/todos/items/${itemId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (res.ok) {
        console.log('✅ Item updated');
        await fetchTodos(false);
      } else {
        const error = await res.text();
        console.error('❌ Failed to update item:', res.status, error);
        alert(`Failed to update item: ${res.status} ${error}`);
      }
    } catch (err) {
      console.error('❌ Exception updating item:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Start editing item
  const startEditItem = (itemId, currentContent) => {
    setEditingItemId(itemId);
    setEditingItemContent(currentContent);
  };

  // Cancel editing
  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemContent('');
  };

  // Save edited item
  const saveEditItem = async () => {
    if (editingItemContent.trim()) {
      await updateItem(editingItemId, editingItemContent.trim());
    }
    setEditingItemId(null);
    setEditingItemContent('');
  };

  // Purchase/claim template
  const purchaseTemplate = async (templateId, isFree) => {
    try {
      const token = helpers.cookie_get('AT') || '';
      const res = await fetch(
        `https://api.stayon.io.vn/api/templates/${templateId}/purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined
          },
          body: JSON.stringify({
            buyerName: 'User',
            buyerEmail: 'user@example.com'
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (isFree) {
          // Free template claimed successfully
          return true;
        } else {
          // Paid template - redirect to payment
          if (data.paymentUrl) {
            window.open(data.paymentUrl, '_blank');
            alert(
              '⏳ Please complete payment. After payment, you can use this template.'
            );
            return false; // Don't proceed to create todo yet
          }
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to purchase template:', err);
      return false;
    }
  };

  // Create todo from template
  const createFromTemplate = async (template) => {
    try {
      // Check if template is owned
      if (!template.owned && !template.isFree) {
        // Paid template not owned - need to purchase
        const purchased = await purchaseTemplate(template.id, false);
        if (!purchased) {
          return; // Wait for payment completion
        }
      } else if (!template.owned && template.isFree) {
        // Free template not owned - claim it first
        const claimed = await purchaseTemplate(template.id, true);
        if (!claimed) {
          alert('❌ Failed to claim free template');
          return;
        }
      }

      // Now create todo list from template
      const res = await fetch(
        'https://api.stayon.io.vn/api/todos/lists/from-template',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            templateId: template.id,
            date: new Date().toISOString(),
            title: `${template.name} - ${new Date().toLocaleDateString()}`
          })
        }
      );

      if (res.ok) {
        alert('✅ Created todo list from template!');
        setActiveTab('todo');
        fetchTodos(false);
      } else {
        const error = await res.text();
        alert(`❌ Error: ${error}`);
      }
    } catch (err) {
      console.error('Failed to create from template:', err);
      alert('❌ Failed to create from template');
    }
  };

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
      if (activeTab === 'todo') {
        fetchTodos(true); // Initial load with loading state
        // Auto-refresh every 3 seconds while modal is open
        const interval = setInterval(() => fetchTodos(false), 30000); // Reduced from 3s to prevent DB spam
        return () => clearInterval(interval);
      } else {
        fetchTemplates();
      }
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: isClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: isClosing
            ? 'scaleOut 0.3s ease-out'
            : 'scaleIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with tabs */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('todo')}
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color:
                  activeTab === 'todo' ? 'white' : 'rgba(255, 255, 255, 0.5)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderBottom: activeTab === 'todo' ? '2px solid white' : 'none',
                transition: 'all 0.2s'
              }}
            >
              To Do
            </button>
            <button
              onClick={() => setActiveTab('template')}
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color:
                  activeTab === 'template'
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderBottom:
                  activeTab === 'template' ? '2px solid white' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Templates
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px'
          }}
        >
          {activeTab === 'todo' ? (
            <div>
              {/* Add new todo */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '2px dashed rgba(255, 255, 255, 0.2)'
                }}
              >
                <input
                  type="text"
                  placeholder="+ New task"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createTodoList()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={createTodoList}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Add
                </button>
              </div>

              {/* Todo list */}
              {loading ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: '40px'
                  }}
                >
                  Loading...
                </div>
              ) : todos.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: '40px'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📝
                  </div>
                  <p>No tasks yet. Add your first task!</p>
                  <p style={{ fontSize: '12px', marginTop: '8px' }}>
                    Add up to 3 tasks. Upgrade to Plus to add more.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {/* Todo header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom:
                            expandedTodoId === todo.id ? '12px' : '0'
                        }}
                      >
                        <button
                          onClick={() =>
                            setExpandedTodoId(
                              expandedTodoId === todo.id ? null : todo.id
                            )
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px'
                          }}
                        >
                          {expandedTodoId === todo.id ? '▼' : '▶'}
                        </button>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '15px'
                            }}
                          >
                            {todo.title}
                          </div>
                          {todo.description && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginTop: '2px'
                              }}
                            >
                              {todo.description}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          {todo.items?.filter((i) => i.isCompleted).length || 0}
                          /{todo.items?.length || 0}
                        </div>
                        <button
                          onClick={() => deleteTodoList(todo.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px'
                          }}
                          title="Delete list"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Expanded items */}
                      {expandedTodoId === todo.id && (
                        <div
                          style={{
                            paddingLeft: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          {/* Items */}
                          {todo.items?.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease-in-out'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={item.isCompleted}
                                onChange={() =>
                                  toggleItemComplete(item.id, item.isCompleted)
                                }
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer'
                                }}
                              />
                              {editingItemId === item.id ? (
                                <div
                                  style={{
                                    flex: 1,
                                    display: 'flex',
                                    gap: '4px'
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={editingItemContent}
                                    onChange={(e) =>
                                      setEditingItemContent(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') saveEditItem();
                                      if (e.key === 'Escape') cancelEditItem();
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: '4px 8px',
                                      backgroundColor:
                                        'rgba(255, 255, 255, 0.1)',
                                      border:
                                        '1px solid rgba(255, 255, 255, 0.3)',
                                      borderRadius: '4px',
                                      color: 'white',
                                      fontSize: '14px',
                                      outline: 'none'
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    onClick={saveEditItem}
                                    style={{
                                      background: 'rgba(34, 197, 94, 0.2)',
                                      border:
                                        '1px solid rgba(34, 197, 94, 0.4)',
                                      color: '#4ade80',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      padding: '4px 8px',
                                      borderRadius: '4px'
                                    }}
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={cancelEditItem}
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.2)',
                                      border:
                                        '1px solid rgba(239, 68, 68, 0.4)',
                                      color: '#fca5a5',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      padding: '4px 8px',
                                      borderRadius: '4px'
                                    }}
                                    title="Cancel"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div
                                    style={{
                                      flex: 1,
                                      color: 'rgba(255, 255, 255, 0.9)',
                                      fontSize: '14px',
                                      textDecoration: item.isCompleted
                                        ? 'line-through'
                                        : 'none',
                                      opacity: item.isCompleted ? 0.5 : 1,
                                      transition: 'all 0.3s ease-in-out'
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                  <button
                                    onClick={() =>
                                      startEditItem(item.id, item.content)
                                    }
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'rgba(255, 255, 255, 0.5)',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      padding: '4px',
                                      marginRight: '4px'
                                    }}
                                    title="Edit item"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'rgba(255, 255, 255, 0.3)',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      padding: '2px'
                                    }}
                                  >
                                    ×
                                  </button>
                                </>
                              )}
                            </div>
                          ))}

                          {/* Add new item */}
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              marginTop: '4px'
                            }}
                          >
                            <input
                              type="text"
                              placeholder="+ Add item"
                              value={newItemContent[todo.id] || ''}
                              onChange={(e) =>
                                setNewItemContent({
                                  ...newItemContent,
                                  [todo.id]: e.target.value
                                })
                              }
                              onKeyPress={(e) =>
                                e.key === 'Enter' && addItemToList(todo.id)
                              }
                              style={{
                                flex: 1,
                                padding: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none'
                              }}
                            />
                            <button
                              onClick={() => addItemToList(todo.id)}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                fontSize: '13px'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Templates list */}
              {loading ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: '40px'
                  }}
                >
                  Loading templates...
                </div>
              ) : templates.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: '40px'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📋
                  </div>
                  <p>No templates available</p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px'
                  }}
                >
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => createFromTemplate(template)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {template.previewImage && (
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        />
                      )}
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                          fontSize: '14px'
                        }}
                      >
                        {template.name}
                      </div>
                      {template.description && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {template.description}
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          marginTop: '8px'
                        }}
                      >
                        <span
                          style={{
                            color: template.isFree ? '#4ade80' : '#fbbf24',
                            fontWeight: '500'
                          }}
                        >
                          {template.isFree
                            ? '🆓 Free'
                            : `💰 ${template.price}đ`}
                        </span>
                        {template.owned && (
                          <span
                            style={{
                              color: '#60a5fa',
                              backgroundColor: 'rgba(96, 165, 250, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}
                          >
                            ✓ Owned
                          </span>
                        )}
                      </div>
                      {!template.owned && !template.isFree && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            marginTop: '4px',
                            fontStyle: 'italic'
                          }}
                        >
                          Click to purchase
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Animations already in global animations.css */
      `}</style>
    </div>
  );
}
