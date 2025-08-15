import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  label,
  theme = 'light',
  required = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseInputClasses = `w-full px-3 py-2 border rounded-md pr-10 ${
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-600 text-white' 
      : 'bg-white border-gray-300'
  } focus:ring-metadite-primary focus:border-metadite-primary`;

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseInputClasses} ${className}`}
          required={required}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;

