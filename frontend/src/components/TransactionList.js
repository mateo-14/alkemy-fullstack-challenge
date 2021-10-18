import { useState } from 'react';
import TransactionModal from './TransactionModal';

export default function TransactionList({ list }) {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [currTransaction, setCurrTransaction] = useState(false);

  const handleEdit = (transaction) => {
    setCurrTransaction(transaction);
    setIsModalShowing(true);
  };
  return (
    <>
      <table className="table-auto text-left w-full">
        <thead>
          <tr className="w-full border-gray-300 border-b h-10">
            <th className="text-gray-600 font-normal">Tipo</th>
            <th className="text-gray-600 font-normal px-2">Monto</th>
            <th className="text-gray-600 font-normal px-2">Fecha</th>
            <th className="text-gray-600 font-normal px-2">Concepto</th>
            <th className="text-gray-600 font-normal px-2">Categorías</th>
            <th className="text-gray-600 font-normal px-2"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((transaction) => (
            <tr className="h-20 border-gray-300 border-b font-medium" key={transaction.id}>
              <td>{transaction.type === 0 ? 'Ingreso' : 'Egreso'}</td>
              <td className="text-indigo-600 px-2">${transaction.amount}</td>
              <td className="px-2">{new Date(transaction.date).toLocaleString()}</td>
              <td className="px-2">{transaction.desc}</td>
              <td className="px-2">
                {transaction.categories.map((category) => (
                  <span
                    className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-indigo-100 bg-indigo-600 rounded-full"
                    key={category}
                  >
                    {category}
                  </span>
                ))}
              </td>
              <td className="px-2">
                <button className="text-indigo-500 hover:text-indigo-600" onClick={() => handleEdit(transaction)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TransactionModal
        show={isModalShowing}
        mode="editing"
        onClose={() => setIsModalShowing(false)}
        transaction={currTransaction}
      />
    </>
  );
}
