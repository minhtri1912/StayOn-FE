import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import helpers from '@/helpers';
import {
  Send,
  X,
  Paperclip,
  FileText,
  Trash2,
  Sparkles,
  Home
} from 'lucide-react';

const ChatDrawer = forwardRef(function ChatDrawer({ open, onClose }, ref) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);
  const [showSessionSelector, setShowSessionSelector] = useState(false);
  const [aiSessions, setAiSessions] = useState([]);

  // Fetch AI tracking sessions
  const fetchAISessions = async () => {
    try {
      let token =
        helpers.cookie_get('AT') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');
      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') || '';
      }

      const response = await fetch(
        'https://api.stayon.io.vn/api/sessions/ai-sessions',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const sessions = await response.json();
        setAiSessions(sessions);
        setShowSessionSelector(true);
      }
    } catch (error) {
      console.error('❌ Error fetching AI sessions:', error);
    }
  };

  // Analyze selected session
  const analyzeSession = async (sessionId) => {
    setShowSessionSelector(false);
    setLoading(true);

    try {
      let token =
        helpers.cookie_get('AT') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');
      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') || '';
      }

      const userMsg = {
        role: 'user',
        text: 'Phân tích session học tập',
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMsgs((m) => [...m, userMsg]);

      const response = await fetch(
        `https://api.stayon.io.vn/api/sessions/${sessionId}/analyze`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();

        const aiMsg = {
          role: 'assistant',
          text: data.analysis,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        setMsgs((m) => [...m, aiMsg]);
      } else {
        throw new Error('Failed to analyze session');
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      const errorMsg = {
        role: 'assistant',
        text: 'Xin lỗi, có lỗi xảy ra khi phân tích session. Vui lòng thử lại.',
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMsgs((m) => [...m, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const ask = async (q, file = null) => {
    const userMsg = {
      role: 'user',
      text: q,
      file: file ? { name: file.name, size: file.size } : null,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMsgs((m) => [...m, userMsg]);
    setLoading(true);

    try {
      // Use real AI streaming API for all messages
      let token =
        helpers.cookie_get('AT') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (!token) {
        // Try to get token from URL params (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') || '';
      }

      console.log('🔑 Token found:', token.substring(0, 20) + '...');

      // Prepare messages for chat API
      const messages = [
        {
          role: 'system',
          content:
            'Bạn là trợ lý AI của Stayon, trả lời ngắn gọn, rõ ràng. Bạn có thể giúp phân tích session học tập, đưa ra tips tập trung, và gợi ý giờ nghỉ giải lao.'
        },
        ...msgs.map((msg) => ({
          role: msg.role,
          content: msg.text
        })),
        {
          role: 'user',
          content: q
        }
      ];

      const chatRequest = {
        messages: messages,
        model: 'openai/gpt-oss-20b',
        temperature: 0.7,
        max_tokens: 1024
      };

      const response = await fetch('https://api.stayon.io.vn/api/chat/stream', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      const aiMsg = {
        role: 'assistant',
        text: '',
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMsgs((m) => [...m, aiMsg]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          aiContent += chunk;

          // Update the last message with streaming content
          setMsgs((m) => {
            const newMsgs = [...m];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              lastMsg.text = aiContent;
            }
            return newMsgs;
          });
        }
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      console.error('❌ Chat error:', err);
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          text: `❌ Đã có lỗi xảy ra: ${err.message}`,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  // Reset chat về trạng thái ban đầu
  const resetChat = () => {
    setMsgs([]);
    setShowSessionSelector(false);
    setLoading(false);
  };

  // Clean markdown formatting từ AI responses
  const cleanMarkdown = (text) => {
    if (!text || typeof text !== 'string') return text;

    // Replace <br> tags with newlines
    let cleaned = text.replace(/<br\s*\/?>/gi, '\n');

    // Remove markdown formatting
    cleaned = cleaned
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Code
      .replace(/#{1,6}\s*(.*)/g, '$1') // Headers
      .replace(/\|/g, ' ') // Table separators
      .replace(/-{3,}/g, '') // Horizontal rules
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
      .replace(/\n{3,}/g, '\n\n') // Multiple newlines
      .trim();

    return cleaned;
  };

  // Expose quickAsk và analyzeSession methods via ref
  useImperativeHandle(
    ref,
    () => ({
      quickAsk: (q) => ask(q),
      analyzeSession: (sessionId) => analyzeSession(sessionId)
    }),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() || selectedFile) {
      ask(input.trim() || 'Analyze this file', selectedFile);
      setInput('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleQuickAction = (action) => {
    let prompt = '';
    switch (action) {
      case 'analyze':
        prompt =
          'Phân tích session học tập hiện tại của tôi và đưa ra lời khuyên.';
        break;
      case 'tips':
        prompt = 'Cho tôi 5 tips để tập trung tốt hơn khi học.';
        break;
      case 'break':
        prompt = 'Tôi nên làm gì trong giờ nghỉ giải lao?';
        break;
      default:
        return;
    }
    ask(prompt);
  };

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) {
    console.log('💬 ChatDrawer: closed');
    return null;
  }

  console.log('💬 ChatDrawer: OPEN');

  return (
    <aside
      style={{
        position: 'fixed',
        top: '120px',
        bottom: '80px',
        right: '24px',
        width: '380px',
        maxHeight: '600px',
        background:
          'linear-gradient(135deg, rgba(30, 30, 40, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow:
          '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        overflow: 'hidden',
        animation: isClosing
          ? 'slideOutRight 0.3s ease-out'
          : 'slideInRight 0.3s ease-out'
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            🤖
          </div>
          <div>
            <h3
              style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '16px',
                margin: 0,
                lineHeight: 1
              }}
            >
              AI Assistant
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                margin: '4px 0 0 0'
              }}
            >
              Online
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Nút Home - chỉ hiển thị khi có messages */}
          {msgs.length > 0 && (
            <button
              onClick={resetChat}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
              title="Màn hình chính"
            >
              <Home size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
            title="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Session Selector Modal */}
      {showSessionSelector && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowSessionSelector(false)}
        >
          <div
            style={{
              background:
                'linear-gradient(145deg, rgba(30, 30, 40, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '500px',
              maxHeight: '70vh',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h3 style={{ color: 'white', margin: 0, fontSize: '18px' }}>
                Chọn session để phân tích
              </h3>
              <button
                onClick={() => setShowSessionSelector(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {aiSessions.length === 0 ? (
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                Không tìm thấy session có AI tracking
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {aiSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => analyzeSession(session.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}
                    >
                      {session.sessionName}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '8px'
                      }}
                    >
                      {new Date(session.startTime).toLocaleString('vi-VN')}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <span>
                        ⏱️ {session.totalDurationMinutes?.toFixed(0)} phút
                      </span>
                      <span>📊 {session.averageFocusScore?.toFixed(0)}%</span>
                      <span>📈 {session.dataPointCount} điểm dữ liệu</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {msgs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '16px',
                background:
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}
            >
              ✨
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}
            >
              Xin chào! 👋
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '13px',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}
            >
              Tôi có thể giúp gì cho bạn hôm nay?
            </p>

            {/* Quick Actions */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <button
                onClick={fetchAISessions}
                style={{
                  padding: '14px 16px',
                  background:
                    'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '20px' }}>📊</span>
                <span>Phân tích session học tập</span>
              </button>
              <button
                onClick={() => handleQuickAction('tips')}
                style={{
                  padding: '14px 16px',
                  background:
                    'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '20px' }}>💡</span>
                <span>Tips tập trung tốt hơn</span>
              </button>
              <button
                onClick={() => handleQuickAction('break')}
                style={{
                  padding: '14px 16px',
                  background:
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '20px' }}>☕</span>
                <span>Gợi ý giờ nghỉ giải lao</span>
              </button>
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px'
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius:
                  m.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                background:
                  m.role === 'user'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                border:
                  m.role === 'user'
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                boxShadow:
                  m.role === 'user'
                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              {m.file && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <FileText size={16} />
                  <span style={{ fontSize: '12px' }}>{m.file.name}</span>
                </div>
              )}
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  color:
                    m.role === 'user' ? 'white' : 'rgba(255, 255, 255, 0.95)'
                }}
              >
                {m.role === 'assistant' ? cleanMarkdown(m.text) : m.text}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  opacity: 0.6,
                  marginTop: '6px',
                  textAlign: m.role === 'user' ? 'right' : 'left'
                }}
              >
                {m.time}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <span
                style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}
              >
                AI đang suy nghĩ...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText
                size={16}
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              />
              <span
                style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px' }}
              >
                {selectedFile.name}
              </span>
              <span
                style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}
              >
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%)'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && !selectedFile)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background:
                loading || (!input.trim() && !selectedFile)
                  ? 'rgba(102, 126, 234, 0.3)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              cursor:
                loading || (!input.trim() && !selectedFile)
                  ? 'not-allowed'
                  : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow:
                loading || (!input.trim() && !selectedFile)
                  ? 'none'
                  : '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading && (input.trim() || selectedFile)) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </aside>
  );
});

export default ChatDrawer;
