import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const FormInput = ({ 
  id, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  minLength,
  icon: Icon,
  label,
  showPassword,
  toggleShowPassword,
  error,
  onBlur
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary ${
            error ? 'border-red-500' : ''
          } ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-gray-200' 
              : 'border-gray-300 text-gray-900'
          }`}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
