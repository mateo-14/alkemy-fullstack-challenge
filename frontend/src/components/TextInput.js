export default function TextInput({ label, id, name, type, value, onChange, placeholder, className }) {
  return (
    <div className={`md:flex md:items-center ${className || ''}`}>
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold mb-1 md:mb-0" htmlFor={id}>
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input
          className="w-full py-2 px-4 outline-none rounded-md border-2 border-gray-300 focus:border-indigo-500"
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
