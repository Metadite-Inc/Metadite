import React, { useEffect } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useTheme } from '../context/ThemeContext';
import { MessageSquare } from 'lucide-react';
import useModerator from '../hooks/useModerator';
import ModelList from '../components/moderator/ModelList';
import ChatContainer from '../components/moderator/ChatContainer';

const Moderator = () => {
  const { theme } = useTheme();
  const {
    isLoaded,
    searchTerm,
    setSearchTerm,
    newMessage,
    setNewMessage,
    messages,
    assignedModels,
    selectedModel,
    loading,
    fileInputRef,
    selectedFile,
    previewUrl,
    isUploading,
    typingUsers,
    connectionStatus,
    messageEndRef,
    hasMoreMessages,
    isLoadingMore,
    handleSelectModel,
    handleFileSelect,
    clearSelectedFile,
    promptFileSelection,
    handleSendMessage,
    handleFlagMessage,
    handleDeleteMessage,
    handleTyping,
    loadMoreMessages,
    handleScroll
  } = useModerator();

  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      
      <div className={`flex-1 pt-20 pb-12 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
                  <p className="opacity-80">Manage conversations with users</p>
                </div>
              </div>
              
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  Moderator Account
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ModelList 
                models={assignedModels}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedModel={selectedModel}
                onSelectModel={handleSelectModel}
                loading={loading}
              />
            </div>
            
            <div className="lg:col-span-3">
              <ChatContainer 
                selectedModel={selectedModel}
                messages={messages}
                loading={loading}
                handleFlagMessage={handleFlagMessage}
                handleDeleteMessage={handleDeleteMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                handleTyping={handleTyping}
                promptFileSelection={promptFileSelection}
                isUploading={isUploading}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                clearSelectedFile={clearSelectedFile}
                isLoaded={isLoaded}
                typingUsers={typingUsers}
                connectionStatus={connectionStatus}
                messageEndRef={messageEndRef}
                hasMoreMessages={hasMoreMessages}
                loadMoreMessages={loadMoreMessages}
                isLoadingMore={isLoadingMore}
                handleScroll={handleScroll}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file" 
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

      <StaffFooter />
    </div>
  );
};

export default Moderator;
