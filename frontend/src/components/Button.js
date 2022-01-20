import React from 'react';

const Button = React.forwardRef(
  ({ children, className, onClick, disabled, color = 'bg-indigo-500', type }, ref) => (
    <button
      className={`${color} border-rounded text-white font-medium py-2 px-4 disabled:opacity-70 disabled:cursor-default hover:opacity-90 rounded-sm transition ${
        className || ''
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      ref={ref}
    >
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
export default Button;