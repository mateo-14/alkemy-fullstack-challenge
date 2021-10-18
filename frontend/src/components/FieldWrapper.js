export function FieldWrapper({ label, children, className, errorMessage, htmlFor }) {
  return (
    <div className={`md:flex md:items-center ${className}`}>
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold mb-1 md:mb-0" htmlFor={htmlFor}>
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <>
          {children}
          {errorMessage && <p className="font-medium text-red-500 text-sm mt-1">{errorMessage}</p>}
        </>
      </div>
    </div>
  );
}
