import { useState } from 'react';

export default function Select({
  onChange,
  value,
  placeholder = '',
  checkAllText = 'Select All',
  uncheckAllText = 'Select None',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const checkedItems = value?.filter((item) => item.checked);

  const handleClick = (e) => {
    if (value) setIsOpen(!isOpen);
  };

  const handleItemClick = (clickedItem) => {
    const updated = value.map((item) =>
      item.value === clickedItem.value ? { ...clickedItem, checked: !clickedItem.checked } : item
    );
    if (typeof onChange === 'function') onChange(updated);
  };

  const handleCheckAll = () => {
    const updated = value.map((item) => ({ ...item, checked: true }));
    if (typeof onChange === 'function') onChange(updated);
  };

  const handleUnCheckAll = () => {
    const updated = value.map((item) => ({ ...item, checked: false }));
    if (typeof onChange === 'function') onChange(updated);
  };
  return (
    <div className="w-full relative">
      <button
        className={`py-2 px-4 rounded-md border-2 flex w-full ${isOpen ? 'border-indigo-500' : 'border-gray-300'} ${
          checkedItems?.length === 0 ? 'text-gray-500' : ''
        }`}
        onClick={handleClick}
      >
        {checkedItems?.length > 0 ? checkedItems.map((item) => item.value).join(', ') : placeholder}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-6 w-6 ml-auto ${isOpen ? 'text-indigo-500' : 'text-gray-500'}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && value && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded border border-gray-300 flex flex-col">
          <button className="px-4 cursor-pointer hover:bg-gray-300 flex justify-between" onClick={handleCheckAll}>
            {checkAllText}
          </button>
          <button
            className="px-4 cursor-pointer hover:bg-gray-300 flex justify-between border-b border-gray-300"
            onClick={handleUnCheckAll}
          >
            {uncheckAllText}
          </button>
          {value?.map((item, i) => (
            <button
              className="py-2 px-4 cursor-pointer hover:bg-gray-300 flex justify-between"
              onClick={() => handleItemClick(item)}
              key={i}
            >
              {item.value}
              {item.checked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
