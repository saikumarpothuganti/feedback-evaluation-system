import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const STORAGE_KEY = 'sfs_chat_messages';

const defaultWelcome = {
  sender: 'bot',
  text: 'Hi! I\'m your assistant. Ask me about login, roles (student/faculty/admin), feedback, reports, or navigation.',
  ts: Date.now(),
};

function getBotReply(message) {
  const msg = message.toLowerCase();

  if (/hello|hi|hey/.test(msg)) {
    return 'Hello! How can I help you today?';
  }
  if (/login|sign ?in|password/.test(msg)) {
    return 'Use the Login page. Pick a role, then enter any username/password. Usernames containing "admin" get Admin access.';
  }
  if (/student/.test(msg)) {
    return 'Student role can submit feedback via the Student page and view basic updates on the Dashboard.';
  }
  if (/faculty/.test(msg)) {
    return 'Faculty role can view feedback relevant to their courses and manage inputs.';
  }
  if (/admin/.test(msg)) {
    return 'Admin role can access Dashboard, Reports, Settings, and manage users/feedback.';
  }
  if (/report|analytics|stats?/.test(msg)) {
    return 'Open Reports to see aggregated analytics of the feedback data.';
  }
  if (/feedback|form|rate|rating/.test(msg)) {
    return 'Go to the Student page to submit feedback. Ratings and comments are supported.';
  }
  if (/navigate|where|go|page|menu|help/.test(msg)) {
    return 'Use the Navbar to switch pages. Protected pages require you to be logged in with the right role.';
  }
  if (/logout|sign ?out/.test(msg)) {
    return 'Use the Profile or Navbar menu to log out and switch accounts.';
  }
  return "I\'m not sure about that yet. Try asking about login, roles, feedback, or reports.";
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [defaultWelcome];
  });

  const location = useLocation();
  const listRef = useRef(null);
  const { userRole, currentUser } = useAuth();

  // Optionally hide on specific pages, e.g., none for now
  const hidden = useMemo(() => false, [location.pathname]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { sender: 'user', text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // Client-only chatbot (no backend). Uses rule-based responses for GitHub Pages.
    const fallback = getBotReply(text);
    setMessages((prev) => [...prev, { sender: 'bot', text: fallback, ts: Date.now() }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (hidden) return null;

  return (
    <>
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="chatbot-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <strong>Assistant</strong>
            <button className="chatbot-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={m.ts + '-' + i} className={`chatbot-msg ${m.sender}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} disabled={!input.trim()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
