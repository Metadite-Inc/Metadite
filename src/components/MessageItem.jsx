import React, { useState } from 'react';
import { Download, Trash, MoreVertical, File, Flag } from 'lucide-react';
import { getFileUrl, deleteMessage } from '../services/ChatService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const MessageItem = ({ message, onDelete }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOwnMessage = message.sender_id === user?.id;

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '';
    }
  };

  const handleDeleteMessage = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteMessage(message.id);
      onDelete?.(message.id);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
      setShowActions(false);
    }
  };

  const handleFlagMessage = () => {
    toast.success("Message flagged");
    setShowActions(false);
  };

  const renderMessageContent = () => {
    const fileUrl = getFileUrl(message.file_url || message.content);

    if (message.message_type === 'IMAGE' && !imageError) {
      return (
        <div className="mt-2">
          <img
            src={fileUrl}
            alt={message.file_name || 'Image'}
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onError={() => setImageError(true)}
            onClick={() => window.open(fileUrl, '_blank')}
            loading="lazy"
          />
        </div>
      );
    }

    if (message.message_type === 'FILE') {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex items-center space-x-2 p-3 mt-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <File className="h-5 w-5 text-metadite-primary" />
          <span className="text-sm truncate max-w-[200px]">
            {message.file_name || 'Download file'}
          </span>
        </a>
      );
    }

    return (
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed mt-2">
        {message.content}
      </p>
    );
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
        <div className="flex justify-between items-start">
          <span className={`text-xs font-medium ${isOwnMessage ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {message.sender_name || 'Anonymous'} • {formatTime(message.created_at || message.timestamp)}
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

        {showActions && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 animate-fade-in">
            <button
              className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleFlagMessage}
            >
              <Flag className="h-4 w-4 mr-2" />
              {message.flagged ? 'Unflag' : 'Flag'}
            </button>
            {isOwnMessage && (
              <button
                className="w-full text-left px-3 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
