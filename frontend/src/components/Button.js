export default function Button({ children, className, onClick, disabled }) {
  return (
    <button
      className={`bg-indigo-500 border-rounded text-white font-medium py-2 disabled:bg-indigo-400 disabled:cursor-default ${
        className || ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
