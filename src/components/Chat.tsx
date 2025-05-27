
import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, X, Image as ImageIcon, Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: File[];
  imageUrls?: string[];
}

interface ChatProps {
  modelId?: string;
  modelName?: string;
  modelImage?: string;
  onClose?: () => void;
  initialMessage?: string;
}

const Chat: React.FC<ChatProps> = ({ 
  modelId, 
  modelName = "AI Assistant", 
  modelImage,
  onClose,
  initialMessage
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Message limits based on membership level
  const getMessageLimit = () => {
    if (!user) return 5; // Guest users
    
    switch (user.membership_level) {
      case 'free':
        return 5;
      case 'standard':
        return 10;
      case 'vip':
        return 30;
      case 'vvip':
        return Infinity;
      default:
        return 5;
    }
  };

  const messageLimit = getMessageLimit();
  const userMessageCount = messages.filter(msg => msg.sender === 'user').length;
  const remainingMessages = messageLimit === Infinity ? Infinity : Math.max(0, messageLimit - userMessageCount);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial message if provided
    if (initialMessage && messages.length === 0) {
      handleSendMessage();
    }
  }, [initialMessage]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (selectedFiles.length + files.length > maxFiles) {
      toast.error(`You can only select up to ${maxFiles} files.`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs for images
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrls(prev => [...prev, url]);
      }
    });
  };

  const removeFile = (index: number) => {
    const file = selectedFiles[index];
    if (file && file.type.startsWith('image/')) {
      const previewIndex = selectedFiles.slice(0, index).filter(f => f.type.startsWith('image/')).length;
      URL.revokeObjectURL(previewUrls[previewIndex]);
      setPreviewUrls(prev => prev.filter((_, i) => i !== previewIndex));
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;
    
    // Check message limit
    if (messageLimit !== Infinity && userMessageCount >= messageLimit) {
      toast.error(`You've reached your message limit of ${messageLimit} messages. Upgrade your plan to send more messages.`);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
      imageUrls: previewUrls.length > 0 ? [...previewUrls] : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your message! As ${modelName}, I'm here to help you. ${
          newMessage.files && newMessage.files.length > 0 
            ? `I can see you've shared ${newMessage.files.length} file(s) with me.` 
            : ''
        }`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const canSendMessage = () => {
    return messageLimit === Infinity || userMessageCount < messageLimit;
  };

  return (
    <div className="chat-container flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={modelImage} alt={modelName} />
            <AvatarFallback>{modelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{modelName}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {messageLimit !== Infinity && (
            <Badge variant={remainingMessages > 5 ? "default" : remainingMessages > 0 ? "secondary" : "destructive"}>
              {remainingMessages} messages left
            </Badge>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Start a conversation with {modelName}!</p>
            {messageLimit !== Infinity && (
              <p className="text-sm mt-2">You have {messageLimit} messages available.</p>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-metadite-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {message.content && (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
              
              {message.imageUrls && message.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {message.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      className="rounded-lg max-w-full h-auto max-h-40 object-cover"
                    />
                  ))}
                </div>
              )}
              
              {message.files && message.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.files.filter(file => !file.type.startsWith('image/')).map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Paperclip className="h-4 w-4" />
                      <span className="truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const url = URL.createObjectURL(file);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = file.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                {file.type.startsWith('image/') ? (
                  <div className="relative">
                    <img
                      src={previewUrls[selectedFiles.slice(0, index).filter(f => f.type.startsWith('image/')).length]}
                      alt={`Preview ${index}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded p-2">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm truncate max-w-20">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-5 h-5 p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Input */}
      <div className="p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                canSendMessage() 
                  ? `Message ${modelName}...` 
                  : `Message limit reached. Upgrade to send more messages.`
              }
              disabled={!canSendMessage() || isLoading}
              className="min-h-[60px] max-h-32 resize-none"
              rows={1}
            />
          </div>
          
          <div className="flex space-x-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={!canSendMessage() || selectedFiles.length >= 5}
              title="Attach files (max 5)"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && selectedFiles.length === 0) || !canSendMessage() || isLoading}
              className="bg-metadite-primary hover:bg-metadite-secondary text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!canSendMessage() && messageLimit !== Infinity && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            You've reached your daily message limit. <a href="/upgrade" className="text-metadite-primary hover:underline">Upgrade your plan</a> to send more messages.
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
