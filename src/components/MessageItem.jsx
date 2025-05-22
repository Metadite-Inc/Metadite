
import React from 'react';
import { format } from 'date-fns';
import { getFileUrl } from '../services/ChatService';
import { useState } from 'react';
import { AlertTriangle, MoreVertical, Download, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MessageItem = ({ message, onFlag }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const isOwnMessage = message.sender_id === user?.id;
  const isFlagged = message.flagged;
  const mightBeInappropriate = message.content?.toLowerCase().includes('inappropriate');

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'IMAGE':
        return (
          <div className="relative group">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={message.file_url || getFileUrl(message.content)} 
                alt="Shared image" 
                className="max-w-full max-h-[300px] object-contain rounded-lg hover:opacity-95 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={message.file_url || getFileUrl(message.content)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <ImageIcon className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        );
      case 'FILE':
        return (
          <a 
            href={getFileUrl(message.file_url || message.content)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="h-5 w-5 text-metadite-primary" />
            <span className="text-sm truncate max-w-[200px]">{message.content}</span>
          </a>
        );
      default:
        return (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div 
        className={`relative max-w-xs md:max-w-md rounded-2xl p-3 ${
          isOwnMessage 
            ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white' 
            : 'bg-white dark:bg-gray-800 shadow-sm'
        }`}
      >
        {isFlagged && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-1">
          <span className={`text-xs font-medium ${isOwnMessage ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {message.sender_name || 'Unknown'} • {format(new Date(message.created_at || message.timestamp), 'HH:mm')}
          </span>
          
          <button 
            className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              isOwnMessage ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        {renderMessageContent()}
        
        {mightBeInappropriate && !isFlagged && (
          <div className="mt-2 text-xs italic text-yellow-500 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            This message may contain inappropriate content
          </div>
        )}
        
        {showActions && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 animate-fade-in border border-gray-200 dark:border-gray-700">
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                onFlag?.(message.id);
                setShowActions(false);
              }}
            >
              {isFlagged ? 'Remove flag' : 'Flag message'}
            </button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
