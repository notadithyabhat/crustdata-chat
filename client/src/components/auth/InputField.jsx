import React from 'react';

export const InputField = ({ label, name, type, value, onChange }) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-white text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-700 rounded w-full py-2 px-3 bg-gray-900 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
    </div>
  );
};
