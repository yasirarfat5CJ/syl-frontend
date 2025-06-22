import React, { useState } from 'react';
import './Chatbot.css'; // Create or customize this file for styling

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setShowChat(!showChat);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { from: 'bot', text: data.message || 'No reply received.' };  // changed to `data.message`
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error fetching chatbot response:', err);
      const errorMsg = { from: 'bot', text: 'Error getting response from Gemini.' };
      setMessages(prev => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={toggleChat}>
        💬
      </div>

      {showChat && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <strong>Ask AI (Gemini)</strong>
            <button onClick={toggleChat}>✖</button>
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
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;


