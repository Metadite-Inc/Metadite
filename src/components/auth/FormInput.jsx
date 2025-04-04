
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  toggleShowPassword
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
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
    </div>
  );
};

export default FormInput;
