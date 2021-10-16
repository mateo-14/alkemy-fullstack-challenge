export default function Button({ children, className, onClick }) {
  return (
    <button className={`bg-indigo-500 border-rounded text-white font-medium py-2 ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
