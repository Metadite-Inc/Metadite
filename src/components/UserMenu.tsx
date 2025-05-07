
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, MessageSquare, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate(); // Add navigate for redirection
  
  // Check if user has VIP access
  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';
  
  // Check if user is regular (not admin or moderator)
  const isRegularUser = user?.role === 'user';

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        <User className="h-4 w-4 mr-2" />
        Login
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <div className="w-10 h-10 bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-full flex items-center justify-center text-white">
            <User className="h-5 w-5" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}>
        <DropdownMenuLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
          {user.full_name || 'User'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
        
        <DropdownMenuItem className={theme === 'dark' ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}>
          <Link to="/dashboard" className="flex items-center w-full">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem className={theme === 'dark' ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}>
          <Link to="/contact" className="flex items-center w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Us
          </Link>
        </DropdownMenuItem>
        
        {isRegularUser && !hasVipAccess && (
          <DropdownMenuItem className={theme === 'dark' ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}>
            <Link to="/upgrade" className="flex items-center w-full">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to VIP
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
        
        <DropdownMenuItem 
          onClick={() => {
            logout(); // Log the user out
            if (user?.role === 'moderator') {
              navigate('/'); // Redirect to home page if the user is a moderator
            }
          }} 
          className={`cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 focus:bg-gray-700 text-red-400' : 'text-red-600'}`}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
