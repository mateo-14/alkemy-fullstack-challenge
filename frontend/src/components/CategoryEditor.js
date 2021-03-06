import { useRef, useState } from 'react';

export default function CategoryEditor({ value, onAdd, onDelete }) {
  const inputRef = useRef();
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const handleClick = (e) => {
    if (e.currentTarget === e.target) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const category = e.currentTarget.value.trim();
      if (category && !value.includes(category)) {
        e.currentTarget.value = '';
        if (typeof onAdd === 'function') onAdd(category);
      }
    }
  };

  const handleInputFocus = () => setIsInputFocused(true)
  const handleInputBlur = () => setIsInputFocused(false)
  
  return (
    <div
      className={`py-2 px-3 rounded-md border-2 border-gray-300 ${isInputFocused ? 'border-indigo-500' : ''}`}
      onClick={handleClick}
    >
      {value?.map((category) => (
        <span
          className="text-xs font-bold text-indigo-100 bg-indigo-600 rounded-full inline-flex items-center px-2 mr-2 my-1"
          key={category}
        >
          {category}
          <button
            className="-mr-2 p-1"
            type="button"
            onClick={() => typeof onDelete === 'function' && onDelete(category)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        id="category-input"
        className="outline-none my-1 w-28"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        onKeyDown={handleKeyDown}
        defaultValue=""
      ></input>
    </div>
  );
}
