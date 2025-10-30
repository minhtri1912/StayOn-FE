import { useState, useEffect } from 'react';

export default function ActivitiesSummaryModal({
  open,
  onClose,
  userId,
  onAnalyzeSession
}) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sessions, setSessions] = useState([]);
  const [previousSessions, setPreviousSessions] = useState([]); // Giữ sessions cũ để tránh flickering
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [previousAnalyticsData, setPreviousAnalyticsData] = useState(null); // Giữ data cũ để tránh flickering
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Mặc định hôm nay
  const [selectedSession, setSelectedSession] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSessionDetailModal, setShowSessionDetailModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
      if (userId) {
        if (activeTab === 'analytics') {
          fetchAnalytics();
        } else {
          fetchSessions();
        }
      }
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open, userId, activeTab, selectedDate]);

  const fetchAnalytics = async () => {
    // Giữ data cũ để hiển thị trong quá trình loading
    if (analyticsData) {
      setPreviousAnalyticsData(analyticsData);
    }

    setLoading(true);
    try {
      // Sử dụng selectedDate thay vì selectedPeriod
      const fromDate = selectedDate.toISOString().split('T')[0];
      const toDate = selectedDate.toISOString().split('T')[0];

      console.log(
        'Fetching analytics for userId:',
        userId,
        'from',
        fromDate,
        'to',
        toDate
      );

      // Call analytics endpoint
      const response = await fetch(
        `https://api.stayon.io.vn/api/todos/analytics?userId=${userId}&from=${fromDate}&to=${toDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analytics data from API:', data);

      // Transform API data to our format
      const newAnalyticsData = {
        totalSessions: data.totalSessions || 0,
        totalTime: data.totalTime || 0,
        bestSession: data.bestSession || 0,
        completedTasks: data.completedTasks || 0,
        hourlyData: data.hourlyData || []
      };

      // Delay một chút để animation mượt hơn
      await new Promise((resolve) => setTimeout(resolve, 100));

      setAnalyticsData(newAnalyticsData);
      setPreviousAnalyticsData(null); // Xóa data cũ sau khi có data mới
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      // Fallback to mock data on error
      setAnalyticsData({
        totalSessions: 0,
        totalTime: 0,
        bestSession: 0,
        completedTasks: 0,
        hourlyData: []
      });
      setPreviousAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    // Giữ sessions cũ để hiển thị trong quá trình loading
    if (sessions.length > 0) {
      setPreviousSessions(sessions);
    }

    setLoading(true);
    try {
      // Sử dụng selectedDate thay vì selectedPeriod
      const fromDate = selectedDate.toISOString().split('T')[0];
      const toDate = selectedDate.toISOString().split('T')[0];

      console.log(
        'Fetching sessions for userId:',
        userId,
        'from:',
        fromDate,
        'to:',
        toDate
      );

      // Call new /api/todos/sessions endpoint
      const response = await fetch(
        `https://api.stayon.io.vn/api/todos/sessions?userId=${userId}&from=${fromDate}&to=${toDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Sessions data from API:', data);

      // Transform API data to our format với thêm thông tin chi tiết
      const sessionsData = data.map((session) => ({
        id: session.id,
        title: session.title || session.type,
        duration: session.duration || 0, // minutes
        durationSeconds: (session.duration || 0) * 60, // seconds
        focusScore: Math.round(session.focusScore || 0),
        emotion: 'focused',
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        type: session.type || session.title,
        tag: session.tag,
        completedItems: session.completedItems || 0,
        totalItems: session.totalItems || 0,
        note: `${session.completedItems || 0}/${session.totalItems || 0} completed`,
        hasAITracking:
          session.sessionType?.includes('ai') ||
          session.sessionType?.includes('tracking') ||
          false,
        date: session.date
      }));

      // Delay một chút để animation mượt hơn
      await new Promise((resolve) => setTimeout(resolve, 100));

      setSessions(sessionsData);
      setPreviousSessions([]); // Xóa sessions cũ sau khi có sessions mới
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      // Fallback to empty array on error
      setSessions([]);
      setPreviousSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIAnalysis = async (sessionId) => {
    try {
      console.log('Fetching AI analysis for session:', sessionId);
      const response = await fetch(
        `https://api.stayon.io.vn/api/todos/sessions/${sessionId}/ai-analysis`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Analysis data:', data);
      setAiAnalysis(data);
      setShowAIModal(true);
    } catch (err) {
      console.error('Failed to fetch AI analysis:', err);
      alert('Failed to load AI analysis');
    }
  };

  const handleSessionClick = (session) => {
    if (session.hasAITracking && onAnalyzeSession) {
      // Nếu có AI tracking, mở chatbox và phân tích on-demand
      onClose(); // Đóng ActivitiesSummaryModal
      onAnalyzeSession(session.id); // Mở chatbox và analyze
    } else {
      // Session không có AI tracking, hiển thị chi tiết session
      setSelectedSession(session);
      setShowSessionDetailModal(true);
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isClosing
            ? 'fadeOut 0.3s ease-out'
            : 'fadeIn 0.3s ease-out'
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '90vw',
            maxWidth: '800px',
            maxHeight: '90vh',
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: isClosing
              ? 'scaleOut 0.3s ease-out'
              : 'scaleIn 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: '24px 24px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                margin: 0
              }}
            >
              Activities summary
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '0 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              gap: '16px'
            }}
          >
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                color:
                  activeTab === 'analytics'
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                fontWeight: activeTab === 'analytics' ? '600' : '400',
                cursor: 'pointer',
                borderBottom:
                  activeTab === 'analytics'
                    ? '2px solid white'
                    : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              style={{
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                color:
                  activeTab === 'sessions'
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                fontWeight: activeTab === 'sessions' ? '600' : '400',
                cursor: 'pointer',
                borderBottom:
                  activeTab === 'sessions'
                    ? '2px solid white'
                    : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📝 Review Sessions
            </button>
          </div>

          <div
            style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1
            }}
          >
            {/* Date Picker */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                alignItems: 'center'
              }}
            >
              <button
                onClick={() => {
                  const prev = new Date(selectedDate);
                  prev.setDate(prev.getDate() - 1);
                  setSelectedDate(prev);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ‹
              </button>

              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  fontSize: '14px'
                }}
              />

              <button
                onClick={() => {
                  const next = new Date(selectedDate);
                  next.setDate(next.getDate() + 1);
                  setSelectedDate(next);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ›
              </button>

              <button
                onClick={() => setSelectedDate(new Date())}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor:
                    selectedDate.toDateString() === new Date().toDateString()
                      ? 'rgba(59, 130, 246, 0.8)'
                      : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginLeft: '8px'
                }}
              >
                Today
              </button>
            </div>

            {activeTab === 'analytics' &&
              (analyticsData || previousAnalyticsData) && (
                <div
                  style={{
                    color: 'white',
                    opacity: loading ? 0.5 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                    position: 'relative'
                  }}
                >
                  {/* Bar Chart */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}
                    >
                      Hourly Activity
                      {loading && (
                        <span
                          style={{
                            fontSize: '12px',
                            opacity: 0.6,
                            marginLeft: '8px'
                          }}
                        >
                          Loading...
                        </span>
                      )}
                    </h3>
                    <BarChart
                      data={
                        (analyticsData || previousAnalyticsData)?.hourlyData ||
                        []
                      }
                    />
                  </div>

                  {/* Metrics Cards */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                      marginBottom: '24px'
                    }}
                  >
                    <MetricCard
                      icon="📊"
                      label="Total Sessions"
                      value={
                        (analyticsData || previousAnalyticsData)
                          ?.totalSessions || 0
                      }
                    />
                    <MetricCard
                      icon="⏰"
                      label="Focused Time"
                      value={
                        ((analyticsData || previousAnalyticsData)?.totalTime ||
                          0) + 'm'
                      }
                    />
                    <MetricCard
                      icon="✅"
                      label="Tasks completed"
                      value={
                        (analyticsData || previousAnalyticsData)
                          ?.completedTasks || 0
                      }
                    />
                  </div>
                </div>
              )}
            {activeTab === 'sessions' &&
              (sessions.length > 0 ||
                previousSessions.length > 0 ||
                !loading) && (
                <div
                  style={{
                    color: 'white',
                    opacity:
                      loading &&
                      sessions.length === 0 &&
                      previousSessions.length === 0
                        ? 0.5
                        : 1,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  {sessions.length === 0 &&
                  previousSessions.length === 0 &&
                  !loading ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {loading && previousSessions.length === 0
                        ? 'Loading sessions...'
                        : 'No sessions yet. Start a session to see your activity!'}
                    </div>
                  ) : (
                    (sessions.length > 0 ? sessions : previousSessions).map(
                      (session, index, arr) => (
                        <div
                          key={session.id}
                          style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '16px 0',
                            borderBottom:
                              index < arr.length - 1
                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                : 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onClick={() => handleSessionClick(session)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'rgba(255, 255, 255, 0.05)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'transparent')
                          }
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              marginTop: '4px',
                              flexShrink: 0
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '4px'
                              }}
                            >
                              <span>
                                ⏱️{' '}
                                {session.durationSeconds
                                  ? `${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s`
                                  : `${session.duration || 0}m`}
                              </span>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                  color: 'rgba(34, 197, 94, 1)',
                                  fontSize: '12px'
                                }}
                              >
                                {session.type}
                              </span>
                              {session.hasAITracking && (
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                    color: 'rgba(59, 130, 246, 1)',
                                    fontSize: '12px'
                                  }}
                                >
                                  🤖 AI
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '13px'
                              }}
                            >
                              {session.hasAITracking
                                ? '🤖 Click to view AI analysis'
                                : '📝 Click to edit note'}
                            </div>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAIModal && aiAnalysis && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowAIModal(false)}
        >
          <div
            style={{
              width: '90vw',
              maxWidth: '600px',
              maxHeight: '80vh',
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: 0
                }}
              >
                🤖 AI Analysis
              </h2>
              <button
                onClick={() => setShowAIModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1
              }}
            >
              <div style={{ color: 'white' }}>
                {/* Session Info */}
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}
                  >
                    Session Details
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Session Name
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {aiAnalysis.sessionName}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Duration
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {aiAnalysis.duration}m
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Focus Score
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Avg: {aiAnalysis.averageFocusScore?.toFixed(1) || 'N/A'}
                        %
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Type
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {aiAnalysis.sessionType}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                {aiAnalysis.aiAnalysis && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}
                    >
                      📊 AI Analysis
                    </h3>
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: 'white',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {aiAnalysis.aiAnalysis}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {aiAnalysis.recommendations && (
                  <div>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}
                    >
                      💡 Recommendations
                    </h3>
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        color: 'white',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {aiAnalysis.recommendations}
                    </div>
                  </div>
                )}

                {!aiAnalysis.aiAnalysis && !aiAnalysis.recommendations && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    No AI analysis available for this session.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {showSessionDetailModal && selectedSession && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowSessionDetailModal(false)}
        >
          <div
            style={{
              width: '90vw',
              maxWidth: '600px',
              maxHeight: '80vh',
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: 0
                }}
              >
                📊 Session Details
              </h2>
              <button
                onClick={() => setShowSessionDetailModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1
              }}
            >
              <div style={{ color: 'white' }}>
                {/* Session Info */}
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}
                  >
                    Overview
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Session Name
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {selectedSession.title || selectedSession.type}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Duration
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {selectedSession.durationSeconds
                          ? `${Math.floor(selectedSession.durationSeconds / 60)}m ${selectedSession.durationSeconds % 60}s`
                          : `${selectedSession.duration || 0}m`}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        Start Time
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {selectedSession.startTime
                          ? new Date(selectedSession.startTime).toLocaleString(
                              'vi-VN',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit'
                              }
                            )
                          : 'N/A'}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        End Time
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {selectedSession.endTime
                          ? new Date(selectedSession.endTime).toLocaleString(
                              'vi-VN',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit'
                              }
                            )
                          : 'N/A'}
                      </div>
                    </div>
                    {selectedSession.focusScore !== undefined && (
                      <div
                        style={{
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}
                      >
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                            marginBottom: '4px'
                          }}
                        >
                          Focus Score
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          {selectedSession.focusScore}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tasks Completed */}
                {(selectedSession.completedItems !== undefined ||
                  selectedSession.totalItems !== undefined) && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}
                    >
                      ✅ Tasks Completed
                    </h3>
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}
                    >
                      {selectedSession.completedItems || 0} /{' '}
                      {selectedSession.totalItems || 0} tasks completed
                    </div>
                  </div>
                )}

                {/* AI Analysis Button */}
                {selectedSession.hasAITracking && (
                  <div style={{ marginBottom: '12px' }}>
                    <button
                      onClick={() => {
                        setShowSessionDetailModal(false);
                        onClose(); // Đóng ActivitiesSummaryModal
                        if (onAnalyzeSession) {
                          onAnalyzeSession(selectedSession.id);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'rgba(59, 130, 246, 0.3)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'rgba(59, 130, 246, 0.2)')
                      }
                    >
                      🤖 View AI Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div
        style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '12px',
          marginBottom: '4px'
        }}
      >
        {label}
      </div>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: '600' }}>
        {value}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '12px'
        }}
      >
        No data available for this day.
      </div>
    );
  }

  // Convert UTC hours to Vietnam time (UTC+7)
  const vietnamData = data.map((item) => {
    const vietnamHour = (item.hour + 7) % 24; // Convert UTC to Vietnam time
    const vietnamHourLabel = new Date(2000, 0, 1, vietnamHour, 0)
      .toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true
      })
      .toLowerCase();

    return {
      ...item,
      hour: vietnamHour,
      hourLabel: vietnamHourLabel
    };
  });

  const maxMinutes = Math.max(...vietnamData.map((d) => d.minutes), 4); // Max height là 4 phút
  const maxSessions = Math.max(...vietnamData.map((d) => d.sessions), 1);

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        position: 'relative'
      }}
    >
      {/* Y-axis labels */}
      <div
        style={{
          position: 'absolute',
          left: '8px',
          top: '24px',
          bottom: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.6)'
        }}
      >
        {[4, 3, 2, 1, 0].map((val) => (
          <div key={val}>{val}m</div>
        ))}
      </div>

      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
          height: '200px',
          marginLeft: '40px',
          marginBottom: '8px' // Giảm để labels gần bars hơn
        }}
      >
        {vietnamData.map((item, index) => {
          const hasData = item.sessions > 0 || item.minutes > 0;
          // Tính height: nếu có data thì hiển thị ít nhất 5%, tối đa theo tỉ lệ
          const height = hasData
            ? Math.max(
                maxMinutes > 0 ? (item.minutes / maxMinutes) * 100 : 5,
                5
              )
            : 0;

          return (
            <div
              key={item.hour}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (hasData) {
                  // Get the bar element position
                  const barElement = e.currentTarget.querySelector('div > div');
                  if (barElement) {
                    const rect = barElement.getBoundingClientRect();

                    // Calculate tooltip position - sát ngay đỉnh bar
                    // transform: translate(-50%, -100%) sẽ tự động đẩy tooltip lên và căn giữa
                    let x = rect.left + rect.width / 2;
                    let y = rect.top - 2; // Sát ngay đỉnh bar

                    // Tìm chart container và modal để check boundary
                    const tooltipWidth = 140;
                    const safePadding = 12;

                    // Tìm chart container (có padding 24px)
                    let container = e.currentTarget;
                    let chartContainer = null;
                    for (let i = 0; i < 8; i++) {
                      container = container?.parentElement;
                      if (container) {
                        const style = window.getComputedStyle(container);
                        const padding = style.padding || style.paddingTop;
                        if (
                          padding &&
                          (padding.includes('24px') || padding === '24px')
                        ) {
                          chartContainer = container;
                          break;
                        }
                      }
                    }

                    // Tìm modal container (có maxWidth 800px)
                    let modalContainer = chartContainer;
                    for (let i = 0; i < 5; i++) {
                      modalContainer = modalContainer?.parentElement;
                      if (modalContainer) {
                        const modalStyle =
                          window.getComputedStyle(modalContainer);
                        const modalRect =
                          modalContainer.getBoundingClientRect();
                        if (
                          modalStyle.maxWidth === '800px' ||
                          (modalRect.width > 300 && modalRect.width <= 900)
                        ) {
                          // Check và điều chỉnh để tooltip không tràn ra ngoài modal
                          if (
                            x - tooltipWidth / 2 <
                            modalRect.left + safePadding
                          ) {
                            x = modalRect.left + safePadding + tooltipWidth / 2;
                          }
                          if (
                            x + tooltipWidth / 2 >
                            modalRect.right - safePadding
                          ) {
                            x =
                              modalRect.right - safePadding - tooltipWidth / 2;
                          }
                          break;
                        }
                      }
                    }

                    // Check chart container boundary nếu có và chuyển sang tọa độ tương đối container
                    if (chartContainer) {
                      const chartRect = chartContainer.getBoundingClientRect();
                      // Clamp theo biên container trước
                      if (x - tooltipWidth / 2 < chartRect.left + safePadding) {
                        x = chartRect.left + safePadding + tooltipWidth / 2;
                      }
                      if (
                        x + tooltipWidth / 2 >
                        chartRect.right - safePadding
                      ) {
                        x = chartRect.right - safePadding - tooltipWidth / 2;
                      }
                      // Đổi sang toạ độ tương đối so với chart container để dùng position:absolute
                      x = x - chartRect.left;
                      y = y - chartRect.top;
                      // Nếu quá sát mép trên, hạ xuống một chút
                      if (y < 6) y = 6;
                    }

                    setHoveredBar(item);
                    setTooltipPosition({ x, y });
                  }
                }
              }}
              onMouseLeave={() => {
                setHoveredBar(null);
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    minHeight: hasData ? '10px' : '0px',
                    backgroundColor: hasData
                      ? 'rgba(59, 130, 246, 0.8)'
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '4px 4px 0 0',
                    cursor: hasData ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (hasData) {
                      e.currentTarget.style.backgroundColor =
                        'rgba(59, 130, 246, 1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hasData) {
                      e.currentTarget.style.backgroundColor =
                        'rgba(59, 130, 246, 0.8)';
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis Labels - below chart, align với bars */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginLeft: '40px',
          marginTop: '8px'
        }}
      >
        {vietnamData.map((item, index) => {
          const showLabel = index % 4 === 0; // Show every 4 hours
          return (
            <div
              key={`label-${item.hour}`}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '11px',
                color: showLabel ? 'rgba(255,255,255,0.8)' : 'transparent',
                fontWeight: '500',
                minWidth: 0 // Đảm bảo text có thể truncate nếu cần
              }}
            >
              {showLabel
                ? item.hourLabel?.toUpperCase().replace(/\s+/g, '') ||
                  item.hourLabel
                : ''}
            </div>
          );
        })}
      </div>

      {/* Custom Tooltip */}
      {hoveredBar && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)', // Center horizontal và đặt phía trên bar, sát vào bar
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 10000,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div
            style={{ fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}
          >
            {hoveredBar.hourLabel?.toUpperCase().replace(' ', '') ||
              hoveredBar.hourLabel}
          </div>
          <div
            style={{ color: '#22c55e', marginBottom: '4px', fontSize: '11px' }}
          >
            Focus: {hoveredBar.minutes} minutes
          </div>
          <div style={{ color: '#3b82f6', fontSize: '11px' }}>
            Sessions: {hoveredBar.sessions}
          </div>
        </div>
      )}
    </div>
  );
}

// Add global styles for animations
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes scaleOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.9);
      opacity: 0;
    }
  }
`;

// Inject styles
if (
  typeof document !== 'undefined' &&
  !document.getElementById('activities-summary-styles')
) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'activities-summary-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
