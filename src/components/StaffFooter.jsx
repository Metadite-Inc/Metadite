
import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StaffFooter = () => {
  const { theme } = useTheme();

  return (
    <footer className={`py-6 border-t ${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-800/30' 
        : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50'
    } backdrop-blur-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Logo and Copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center mr-6">
              <img 
                src="/logo.png" 
                alt="Metadite" 
                className="w-8 h-8 mr-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className={`text-xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent`}>
                Metadite
              </span>
            </div>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              © 2025 Metadite, Inc
            </div>
          </div>
          
          {/* Right side - Social Icons */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a 
                href="#" 
                className={`p-2 rounded-full transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-purple-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'
                    : 'text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-metadite-primary hover:to-metadite-secondary'
                }`}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-purple-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'
                    : 'text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-metadite-primary hover:to-metadite-secondary'
                }`}
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-purple-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'
                    : 'text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-metadite-primary hover:to-metadite-secondary'
                }`}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-2 rounded-full transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-purple-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'
                    : 'text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-metadite-primary hover:to-metadite-secondary'
                }`}
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StaffFooter;