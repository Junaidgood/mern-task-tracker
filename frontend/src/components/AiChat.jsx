import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/chatService';
import '../styles/AiChat.css';

/**
 * AiChat.jsx (AI Chatbot Component)
 * Single-turn chat: User message in, AI reply out.
 * No memory, no streaming, no task access.
 */
function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const { reply } = await sendChatMessage(text);
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar">✨</div>
        <div className="chat-header-text">
          <h2 className="chat-title">AI Assistant</h2>
          <p className="chat-subtitle">Powered by Gemini AI (Single-turn)</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && <div className="state-box state-error">{error}</div>}

      {/* Messages Feed */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <span className="chat-empty-icon">💬</span>
            <p className="chat-empty-text">Start a conversation! Tell it your name to test memory.</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`chat-row ${m.sender}`}>
              <div className="chat-bubble">
                <span className="chat-sender">{m.sender === 'user' ? 'You' : 'Gemini AI'}</span>
                <p className="chat-text">{m.text}</p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="chat-row ai">
            <div className="chat-bubble loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <form className="chat-form" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="chat-btn-send" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default AiChat;
