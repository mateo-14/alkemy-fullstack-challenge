import axios from 'axios';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import TransactionModal from './TransactionModal';

export default function TransactionList({ list, onListChange }) {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [currTransaction, setCurrTransaction] = useState(false);
  const {
    user: { token },
  } = useAuth();

  const handleEdit = (transaction) => {
    setCurrTransaction(transaction);
    setIsModalShowing(true);
  };

  const handleDelete = async (transaction) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transaction.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (typeof onListChange === 'function') onListChange('delete', transaction);
    } catch {}
  };

  const handleModalClose = (transaction) => {
    setIsModalShowing(false);
    if (transaction) {
      if (typeof onListChange === 'function') onListChange('update', transaction);
    }
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
                <button
                  className="text-indigo-500 hover:text-indigo-600 ml-2"
                  onClick={() => handleDelete(transaction)}
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TransactionModal show={isModalShowing} mode="editing" onClose={handleModalClose} transaction={currTransaction} />
    </>
  );
}
