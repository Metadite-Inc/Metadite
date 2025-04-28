import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock data for flagged messages
const flaggedMessages = [
  { 
    id: 1, 
    user: 'john@example.com', 
    moderator: 'anita.moderator@metadite.com',
    content: 'Hey, can you share your personal phone number?', 
    date: '2023-08-15',
    reason: 'Personal information request'
  },
  { 
    id: 2, 
    user: 'emma@example.com', 
    moderator: 'michael.moderator@metadite.com',
    content: 'I have some inappropriate content to share with you.',
    date: '2023-08-14',
    reason: 'Potentially harmful content'
  }
];

const FlaggedMessagesTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
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
            {flaggedMessages.length} messages flagged
          </span>
        </div>
        
        <div>
          {flaggedMessages.map((message) => (
            <div key={message.id} className="border-b border-gray-100 last:border-b-0">
              <button 
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors 
                ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                onClick={() => toggleSection(message.id)}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <p className="font-medium">User: {message.user}</p>
                      <span className="mx-2 text-gray-300">|</span>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Moderator: {message.moderator}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{message.content}</p>
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
                    <p className="p-3 bg-white rounded-md border border-gray-200">{message.content}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Flagged Reason:</h3>
                    <p className="text-red-600">{message.reason}</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="flex items-center text-green-600 hover:text-green-700 transition-colors">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Message
                    </button>
                    <button className="flex items-center text-red-600 hover:text-red-700 transition-colors">
                      <XCircle className="h-4 w-4 mr-1" />
                      Delete Message
                    </button>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                      <Bell className="h-4 w-4 mr-1" />
                      Notify Moderator
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {flaggedMessages.length === 0 && (
          <div className="text-center py-10">
            <CheckCircle className="h-10 w-10 text-green-300 mx-auto mb-2" />
            <p className="text-gray-500">No flagged messages at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlaggedMessagesTab;