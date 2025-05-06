
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  userRole?: string;
}

const Logo: React.FC<LogoProps> = ({ userRole }) => {
  return (
    <Link
      to={userRole === 'moderator' ? '/moderator' : '/'}
      className="flex items-center h-full"
    >
      <img
        src="/logo.png"
        alt="Metadite Logo"
        className="h-12 w-auto mr-2"
      />
      <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
        Metadite
      </span>
      <span className="md:hidden text-xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
        Metadite
      </span>
    </Link>
  );
};

export default Logo;
