import { useState } from 'react';
import Button from './Button';
import CategoryEditor from './CategoryEditor';
import TextInput from './TextInput';

export default function TransactionModal({ mode = 'creating', transaction, show, onClose }) {
  const [categories, setCategories] = useState(mode === 'editing' && transaction ? transaction.categories : []);

  const handleAddCategory = (category) => {
    setCategories([...categories, category]);
  };

  const handleDeleteCategory = (category) => {
    setCategories(categories.filter((_category) => _category !== category));
  };

  return show ? (
    <div className="fixed z-10 flex w-full h-full inset-0" role="dialog">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <article className="bg-white w-full max-w-md mx-auto my-auto z-20 rounded px-10 py-5">
        <h1 className="font-medium text-2xl text-indigo-600">{mode === 'creating' ? 'Nueva operación' : 'Editar'}</h1>
        <form className="py-5">
          <TextInput label="Concepto" value={transaction?.desc || ''} />
          <TextInput label="Monto" type="number" className="my-4" value={transaction?.amount || ''} />
          <TextInput
            label="Fecha"
            type="date"
            className="my-4"
            value={transaction ? new Date(transaction.date).toISOString().split('T')[0] : ''}
          />

          <div className={`md:flex md:items-center`}>
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold mb-1 md:mb-0" htmlFor="category-input">
                Categorías
              </label>
            </div>
            <div className="md:w-2/3">
              <CategoryEditor categories={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
            </div>
          </div>

          <div className="flex justify-between mt-10 gap-x-10">
            <Button className="flex-1" color="bg-green-500">
              {mode === 'creating' ? 'Crear' : 'Guardar'}
            </Button>
            <Button className="flex-1" color="bg-red-500" onClick={() => typeof onClose === 'function' && onClose()}>
              Cancelar
            </Button>
          </div>
        </form>
      </article>
    </div>
  ) : null;
}
