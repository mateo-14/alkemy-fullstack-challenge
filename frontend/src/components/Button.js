export default function Button({ children, className, onClick, disabled, color = 'bg-indigo-500' }) {
  return (
    <button
      className={`${color} border-rounded text-white font-medium py-2 px-4 disabled:bg-indigo-400 disabled:cursor-default ${
        className || ''
      }`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
