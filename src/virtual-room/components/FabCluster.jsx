export default function FabCluster({ onChat, onTodoTemplate }) {
  const Btn = ({ title, children, onClick }) => (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: 'black',
        fontSize: '20px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s'
      }}
      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 50
      }}
    >
      <Btn title="Chat" onClick={onChat}>
        💬
      </Btn>
      <Btn title="Todo & Templates" onClick={onTodoTemplate}>
        📝
      </Btn>
    </div>
  );
}
