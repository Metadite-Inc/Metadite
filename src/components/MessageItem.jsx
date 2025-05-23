import React, { useState } from 'react';
import { format } from 'date-fns';
import { getFileUrl, deleteMessage } from '../services/ChatService';
import { MoreVertical, Download, Image as ImageIcon, Trash, File } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const MessageItem = ({ message, onDelete, onFlag }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwnMessage = message.sender_id === user?.id;

  // Helper to get the correct file URL
  const getCorrectFileUrl = (message) => {
    // If the message has a complete file_url, use it directly
    if (message.file_url && (message.file_url.startsWith('http://') || message.file_url.startsWith('https://'))) {
      return message.file_url;
    }
    
    // Otherwise use the getFileUrl helper with either file_url or content
    const fileIdentifier = message.file_url || message.content;
    if (fileIdentifier) {
      return getFileUrl(fileIdentifier);
    }
    
    // Fallback to placeholder
    return 'https://placehold.co/400x300?text=Image+Not+Found';
  };

  // Format date safely
  const formatSafeDate = (dateStr) => {
    try {
      const date = new Date(dateStr || Date.now());
      if (isNaN(date.getTime())) {
        return format(new Date(), 'HH:mm');
      }
      return format(date, 'HH:mm');
    } catch (error) {
      console.error("Date formatting error:", error);
      return format(new Date(), 'HH:mm');
    }
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'IMAGE':
        return (
          <div className="relative group">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={getCorrectFileUrl(message)} 
                alt="Shared image" 
                className="max-w-full max-h-[300px] object-contain rounded-lg hover:opacity-95 transition-opacity"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={getCorrectFileUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <Download className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        );
      case 'FILE':
        return (
          <a 
            href={getCorrectFileUrl(message)} 
            target="_blank" 
            rel="noopener noreferrer"
            download
            className="flex items-center space-x-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <File className="h-5 w-5 text-metadite-primary" />
            <span className="text-sm truncate max-w-[200px]">
              {message.file_name || message.content || 'Download file'}
            </span>
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

  const handleDeleteMessage = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteMessage(message.id);
      onDelete?.(message.id);
      toast.success("Message deleted successfully");
      setShowActions(false);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFlagMessage = () => {
    if (onFlag) {
      onFlag(message.id);
      setShowActions(false);
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
        <div className="flex justify-between items-start mb-1">
          <span className={`text-xs font-medium ${isOwnMessage ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {message.sender_name || 'Unknown'} • {formatSafeDate(message.created_at || message.timestamp)}
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
        
        <div className="mt-2">
          {renderMessageContent()}
        </div>
        
        {showActions && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 animate-fade-in border border-gray-200 dark:border-gray-700">
            {isOwnMessage && (
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500 flex items-center"
                onClick={handleDeleteMessage}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-red-500 border-r-transparent animate-spin"></span>
                ) : (
                  <Trash className="h-4 w-4 mr-2" />
                )}
                Delete
              </button>
            )}
            {onFlag && (
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                onClick={handleFlagMessage}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 22v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {message.flagged ? 'Unflag' : 'Flag'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
