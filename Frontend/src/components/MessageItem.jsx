
import { useState } from 'react';
import { AlertTriangle, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MessageItem = ({ message, onFlag }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const isOwnMessage = message.senderId === user?.id;
  const isFlagged = message.flagged;
  
  // Determine if the message might contain inappropriate content
  // This would be analyzed by your AI system in a real implementation
  const mightBeInappropriate = message.content.toLowerCase().includes('inappropriate');
  
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`relative max-w-xs md:max-w-md rounded-xl p-3 ${
          isOwnMessage 
            ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white' 
            : 'glass-card'
        }`}
      >
        {isFlagged && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
          </div>
        )}
        
        <div className="flex justify-between items-start">
          <span className={`text-xs font-medium mb-1 ${isOwnMessage ? 'text-white/80' : 'text-gray-500'}`}>
            {message.senderName} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          <button 
            className={`ml-2 ${isOwnMessage ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        <p className={`mt-1 ${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
          {message.content}
        </p>
        
        {mightBeInappropriate && !isFlagged && (
          <div className="mt-2 text-xs italic text-yellow-500 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            This message may contain inappropriate content
          </div>
        )}
        
        {showActions && (
          <div className="absolute right-0 mt-2 w-32 glass-card rounded-md shadow-lg overflow-hidden z-10 animate-fade-in">
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => {
                onFlag(message.id);
                setShowActions(false);
              }}
            >
              {isFlagged ? 'Remove flag' : 'Flag message'}
            </button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
