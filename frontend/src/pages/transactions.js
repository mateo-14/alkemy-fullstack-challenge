import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import AuthGuard from '../guards/AuthGuard';
import useAuth from '../hooks/useAuth';
import { FieldWrapper } from '../components/FieldWrapper';
import Select from '../components/Select';
import useBalance from '../hooks/useBalance';
import Layout from '../components/Layout';

export default function Transactions() {
  const { user, isReady } = useAuth();
  const { update: updateBalance, data: balanceData } = useBalance();
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (balanceData) {
      const updated = categories.filter((category) =>
        balanceData.categories.includes(category.value),
      );
      for (const category of balanceData.categories) {
        if (!categories.some(({ value }) => value === category)) {
          updated.push({ value: category, checked: false });
        }
      }
      setCategories(updated);
    }
  }, [balanceData?.categories]);

  const fetchTransactions = (offset) => {
    const searchParams = new URLSearchParams();
    searchParams.set('offset', offset);
    for (const { value, checked } of categories) {
      if (checked) {
        searchParams.append('categories[]', value);
      }
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/transactions?${searchParams.toString()}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(({ data }) => {
        if (data instanceof Array && data.length > 0) {
          setTransactions([...transactions.slice(0, offset), ...data]);
        }
      });
  };

  useEffect(() => {
    if (isReady && user) {
      fetchTransactions(0);
    }
  }, [user, isReady, categories.filter(({ checked }) => checked).length]);

  const handleLoadClick = () => {
    fetchTransactions(transactions.length);
  };

  const handleListChange = (type, updatedTransaction) => {
    if (type === 'update') {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === updatedTransaction.id
            ? { ...transaction, ...updatedTransaction }
            : transaction,
        ),
      );
    } else if (type === 'delete') {
      setTransactions(
        transactions.filter((transaction) => transaction.id !== updatedTransaction.id),
      );
    }
  };

  const handleModalClose = (newTransaction) => {
    setIsModalShowing(false);
    if (newTransaction) {
      console.log(newTransaction);
      updateBalance();
      setTransactions([newTransaction, ...transactions]);
    }
  };

  return (
    <AuthGuard>
      <Layout title="Gastos">
        <div className="container mx-auto py-10 flex flex-wrap gap-x-20 gap-y-10 px-5 sm:px-0">
          <section className="flex flex-col w-full">
            <h1 className="text-indigo-600 font-medium text-6xl mb-14">Gastos de {user?.name}</h1>
            <FieldWrapper label="Filtrar por categorías" className="mb-4">
              <Select
                value={categories}
                onChange={(value) => setCategories(value)}
                placeholder="Seleccionar categorías"
                checkAllText="Seleccionar todas"
                uncheckAllText="Deseleccionar todas"
              />
            </FieldWrapper>
            <div className="overflow-auto flex-[1_1_1px] min-h-[500px]">
              <TransactionList list={transactions} onListChange={handleListChange} />
            </div>
            <div className="mt-4 flex justify-between gap-x-6">
              <Button className="flex-1" onClick={() => setIsModalShowing(true)}>
                Nueva
              </Button>
              <Button className="flex-1" onClick={handleLoadClick}>
                Cargar más
              </Button>
            </div>
          </section>

          <TransactionModal show={isModalShowing} onClose={handleModalClose} />
        </div>
      </Layout>
    </AuthGuard>
  );
}
