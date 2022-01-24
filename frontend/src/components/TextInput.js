import React from 'react';
const TextInput = React.forwardRef(
  (
    { id, name, type, value, defaultValue, onChange, placeholder, onBlur, required, maxLength, minLength, max, min },
    ref
  ) => (
    <input
      className="w-full py-2 px-4 outline-none rounded-md border-2 border-gray-300 focus:border-indigo-500"
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      maxLength={maxLength}
      minLength={minLength}
      ref={ref}
      defaultValue={defaultValue}
      max={max}
      min={min}
    />
  )
);
TextInput.displayName = 'TextInput';
export default TextInput;
