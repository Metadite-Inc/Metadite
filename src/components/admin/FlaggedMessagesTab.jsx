import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';

const FlaggedMessagesTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingMessage, setProcessingMessage] = useState(null);
  
  useEffect(() => {
    if (isLoaded) {
      fetchFlaggedMessages();
    }
  }, [isLoaded]);

  const fetchFlaggedMessages = async () => {
    setLoading(true);
    try {
      const data = await adminApiService.getFlaggedMessages();
      setFlaggedMessages(data);
    } catch (error) {
      console.error('Error fetching flagged messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMessage = async (messageId) => {
    setProcessingMessage(messageId);
    try {
      // TODO: Add API call to approve message
      await adminApiService.approveFlaggedMessage(messageId);
      // Remove the message from the list
      setFlaggedMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error approving message:', error);
    } finally {
      setProcessingMessage(null);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    setProcessingMessage(messageId);
    try {
      // TODO: Add API call to delete message
      await adminApiService.deleteFlaggedMessage(messageId);
      // Remove the message from the list
      setFlaggedMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setProcessingMessage(null);
    }
  };

  const handleNotifyModerator = async (messageId) => {
    setProcessingMessage(messageId);
    try {
      // TODO: Add API call to notify moderator
      await adminApiService.notifyModerator(messageId);
    } catch (error) {
      console.error('Error notifying moderator:', error);
    } finally {
      setProcessingMessage(null);
    }
  };
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="font-semibold">Flagged Messages</h2>
          </div>
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
            {loading ? 'Loading...' : `${flaggedMessages.length} messages flagged`}
          </span>
        </div>
        
        <div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading flagged messages...
            </div>
          ) : flaggedMessages.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="h-10 w-10 text-green-300 mx-auto mb-2" />
              <p className="text-gray-500">No flagged messages at this time.</p>
            </div>
          ) : (
            flaggedMessages.map((message) => (
              <div key={message.id} className="border-b border-gray-100 last:border-b-0">
                <button 
                  className={`w-full px-6 py-4 flex items-center justify-between transition-colors 
                  ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleSection(message.id)}
                  disabled={processingMessage === message.id}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center">
                        <p className="font-medium">User: {message.user_email || message.user || 'Unknown'}</p>
                        <span className="mx-2 text-gray-300">|</span>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Moderator: {message.moderator_email || message.moderator || 'System'}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {message.content || message.message || 'No content available'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(message.created_at || message.date)}
                      </p>
                    </div>
                  </div>
                  
                  {expandedSection === message.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSection === message.id && (
                  <div className={`px-6 py-4 animate-slide-down 
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Message Content:</h3>
                      <p className="p-3 bg-white rounded-md border border-gray-200">
                        {message.content || message.message || 'No content available'}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Flagged Reason:</h3>
                      <p className="text-red-600">
                        {message.reason || message.flag_reason || 'No reason provided'}
                      </p>
                    </div>

                    {message.chat_room && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Chat Room:</h3>
                        <p className="text-gray-600">
                          {message.chat_room}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      <button 
                        className="flex items-center text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                        onClick={() => handleApproveMessage(message.id)}
                        disabled={processingMessage === message.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {processingMessage === message.id ? 'Processing...' : 'Approve Message'}
                      </button>
                      <button 
                        className="flex items-center text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                        onClick={() => handleDeleteMessage(message.id)}
                        disabled={processingMessage === message.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {processingMessage === message.id ? 'Processing...' : 'Delete Message'}
                      </button>
                      <button 
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                        onClick={() => handleNotifyModerator(message.id)}
                        disabled={processingMessage === message.id}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        {processingMessage === message.id ? 'Processing...' : 'Notify Moderator'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlaggedMessagesTab;