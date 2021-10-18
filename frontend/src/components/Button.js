import React from 'react';

export default React.forwardRef(({ children, className, onClick, disabled, color = 'bg-indigo-500', type }, ref) => (
  <button
    className={`${color} border-rounded text-white font-medium py-2 px-4 disabled:opacity-60 disabled:cursor-default ${
      className || ''
    }`}
    onClick={onClick}
    disabled={disabled}
    type={type}
    ref={ref}
  >
    {children}
  </button>
));
