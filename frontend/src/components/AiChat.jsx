import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { sendChatMessage } from '../services/chatService';
import '../styles/AiChat.css';

/**
 * AiChat.jsx (AI Task Agent Chat Component)
 * Sends user message to /api/chat, displays AI reply + tool calls made by the agent.
 */
function AiChat({ messages, setMessages, input, setInput, onTaskSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const history = messages.map((m) => {
      if (m.sender === 'user') {
        return { role: 'user', content: m.text };
      }
      const toolContext = m.toolCalls?.length
        ? `\n[Tools executed: ${JSON.stringify(m.toolCalls)}]`
        : '';
      return { role: 'assistant', content: `${m.text}${toolContext}` };
    });

    setError('');
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const { reply, toolCalls } = await sendChatMessage(text, history);
      if (toolCalls?.length) {
        console.log('🔧 Agent Tool Calls:', toolCalls);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });

        const mutatingTools = ['create_task', 'update_task', 'delete_task'];
        const mutatedCalls = toolCalls.filter(
          (tc) => mutatingTools.includes(tc.tool) && tc.result?.success !== false
        );

        if (mutatedCalls.length > 0) {
          const actionLabels = {
            create_task: 'AI Agent Created Task(s)',
            update_task: 'AI Agent Updated Task(s)',
            delete_task: 'AI Agent Deleted Task(s)',
          };
          const lastMutated = mutatedCalls[mutatedCalls.length - 1];
          const affectedTitles = mutatedCalls
            .map((tc) => tc.result?.task?.title || tc.result?.title || tc.args?.title)
            .filter(Boolean);

          onTaskSuccess?.({
            action: actionLabels[lastMutated.tool] || 'AI Agent Updated Tasks',
            tasks: [...new Set(affectedTitles)],
          });
        }
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: reply, toolCalls }]);
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
        <div className="chat-avatar">🤖</div>
        <div className="chat-header-text">
          <h2 className="chat-title">AI Task Agent</h2>
          <p className="chat-subtitle">LangChain + Gemini (CRUD Tool Calling)</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && <div className="state-box state-error">{error}</div>}

      {/* Messages Feed */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <span className="chat-empty-icon">💬</span>
            <p className="chat-empty-text">
              Ask me to list, create, update, or delete your tasks!
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`chat-row ${m.sender}`}>
              <div className="chat-bubble">
                <span className="chat-sender">{m.sender === 'user' ? 'You' : 'AI Agent'}</span>

                {/* Tool Calls Log Badge */}
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="tool-calls-box">
                    <div className="tool-calls-heading">🔧 Tools Executed ({m.toolCalls.length})</div>
                    {m.toolCalls.map((tc, idx) => (
                      <div key={idx} className="tool-call-item">
                        <span className="tool-call-name">{tc.tool}</span>
                        <span className="tool-call-meta">
                          <strong>Args:</strong> {JSON.stringify(tc.args)}
                        </span>
                        <span className="tool-call-meta">
                          <strong>Result:</strong> {JSON.stringify(tc.result)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

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
          placeholder="e.g. Mark my pending tasks as done..."
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
