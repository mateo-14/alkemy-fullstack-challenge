import { useState } from 'react';
import Button from '../components/Button';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import AuthGuard from '../guards/AuthGuard';
import useAuth from '../hooks/useAuth';
import Link from 'next/link';
import useBalance from '../hooks/useBalance';
import Layout from '../components/Layout';

export default function Home() {
  const { user } = useAuth();
  const [isModalShowing, setIsModalShowing] = useState(false);
  const { update: updateBalance, data: balanceData } = useBalance();

  const handleListChange = () => {
    updateBalance();
  };

  const handleModalClose = (newTransaction) => {
    setIsModalShowing(false);
    if (newTransaction) {
      updateBalance();
    }
  };

  return (
    <AuthGuard>
      <Layout title="Inicio">
        <div className="container mx-auto py-20 flex flex-wrap gap-16 px-5">
          <section className="flex flex-col w-full lg:flex-1 lg:w-auto">
            <div className="mb-10">
              <h1 className="text-indigo-600 font-medium text-5xl mb-3">Balance actual de {user?.name}</h1>
              <p className="text-4xl text-indigo-600 font-medium">
                ${balanceData?.balance !== undefined ? balanceData?.balance : '-'}
              </p>
              <div className="mt-12 text-4xl">
                <p className="font-medium flex-1 text-indigo-600 flex items-center">
                  Ingresos:
                  <span className="ml-auto text-3xl">
                    ${balanceData?.income !== undefined ? balanceData?.income : '-'}
                  </span>
                </p>
                <p className="font-medium flex-1 text-indigo-600 flex mt-2 items-center">
                  Egresos:
                  <span className="ml-auto text-3xl">
                    ${balanceData?.expense !== undefined ? balanceData?.expense : '-'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-auto flex justify-between gap-x-4">
              <Button className="flex-1" onClick={() => setIsModalShowing(true)} disabled={!balanceData}>
                Nuevo
              </Button>
              <Link href="/transactions" passHref>
                <Button className="flex-1" disabled={!balanceData}>
                  Ver lista completa
                </Button>
              </Link>
            </div>
          </section>
          <section className="flex flex-col w-full lg:flex-[2] lg:w-auto">
            <h1 className="text-indigo-600 font-medium text-5xl mb-14"> ??ltimos gastos</h1>
            <div className="overflow-auto flex-[1_1_1px] min-h-[500px]">
              <TransactionList list={balanceData?.transactions} onListChange={handleListChange} />
            </div>
          </section>

          <TransactionModal show={isModalShowing} onClose={handleModalClose} />
        </div>
      </Layout>
    </AuthGuard>
  );
}
