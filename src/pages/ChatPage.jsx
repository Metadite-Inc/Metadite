import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { getMessages, sendMessage } from '../services/ChatService';

const ChatPage = () => {
  const { user } = useAuth(); // Get the current user from AuthContext
  const [chats, setChats] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const navigate = useNavigate(); // Hook to navigate between pages

  useEffect(() => {
    // Redirect if the user is not a regular user
    if (user?.role === 'admin' || user?.role === 'moderator') {
      navigate('/'); // Redirect to the home page or another appropriate page
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate fetching chat history
    setChats([
      { id: 1, sender: 'Moderator', message: 'Hello! How can I assist you?', timestamp: '10:30 AM' },
      { id: 2, sender: 'You', message: 'I need help with my subscription.', timestamp: '10:32 AM' },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setChats((prevChats) => [
        ...prevChats,
        { id: prevChats.length + 1, sender: 'You', message: messageInput, timestamp: new Date().toLocaleTimeString() },
      ]);
      setMessageInput('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-metadite-primary hover:underline flex items-center space-x-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto">
        {chats.map((chat) => (
          <div key={chat.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md mb-2">
            <p className="text-sm font-medium">{chat.sender}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{chat.message}</p>
            <p className="text-xs text-gray-400">{chat.timestamp}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-metadite-primary"
        />
        <button
          onClick={handleSendMessage}
          className="bg-metadite-primary text-white px-4 py-2 rounded-md hover:bg-metadite-secondary transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
