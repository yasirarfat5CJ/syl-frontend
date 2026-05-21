import React, { useEffect, useState } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import './Chatbot.css'; // Create or customize this file for styling

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(!!localStorage.getItem('token'));

    window.addEventListener('storage', syncAuthState);
    window.addEventListener('loginSuccess', syncAuthState);
    window.addEventListener('logoutSuccess', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('loginSuccess', syncAuthState);
      window.removeEventListener('logoutSuccess', syncAuthState);
    };
  }, []);

  const toggleChat = () => setShowChat(!showChat);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { from: 'bot', text: data.message || 'No reply received.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error fetching chatbot response:', err);
      const errorMsg = { from: 'bot', text: 'Error getting chatbot response.' };
      setMessages(prev => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="chatbot-toggle" onClick={toggleChat}>
        <FaComments />
      </div>

      {showChat && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <strong>Ask AI</strong>
            <button onClick={toggleChat} aria-label="Close chatbot"><FaTimes /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="msg bot">Typing...</div>}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage} aria-label="Send message"><FaPaperPlane /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;


