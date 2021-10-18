import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import Button from './Button';
import CategoryEditor from './CategoryEditor';
import { FieldWrapper } from './FieldWrapper';
import TextInput from './TextInput';

const api = process.env.NEXT_PUBLIC_API_URL;
export default function TransactionModal({ mode = 'creating', transaction, show, onClose }) {
  const {
    user: { token },
  } = useAuth();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (transaction) {
      reset({
        desc: transaction.desc,
        amount: transaction.amount,
        date: new Date(transaction.date).toISOString().split('T')[0],
        categories: transaction.categories,
      });
    } else {
      reset({
        desc: '',
        amount: 1,
        date: new Date().toISOString().split('T')[0],
        categories: [],
        type: '0',
      });
    }
  }, [show, transaction]);

  const onSubmit = async (data) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (mode === 'editing' && transaction) {
        await axios.put(
          `${api}/transactions/${transaction.id}`,
          {
            ...transaction,
            ...data,
          },
          { headers }
        );
        onClose({ ...data, id: transaction.id });
      } else if (mode === 'creating') {
        const res = await axios.post(`${api}/transactions`, { ...data }, { headers });
        onClose(res.data);
      }
    } catch {
      onClose();
    }
  };

  return show ? (
    <div className="fixed z-10 flex w-full h-full inset-0" role="dialog">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <article className="bg-white w-full max-w-md mx-auto my-auto z-20 rounded px-10 py-5">
        <h1 className="font-medium text-2xl text-indigo-600">{mode === 'creating' ? 'Nueva operación' : 'Editar'}</h1>
        <form className="py-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {mode === 'creating' ? (
            <FieldWrapper label="Tipo">
              <input {...register('type')} type="radio" value="0" id="income" />
              <label htmlFor="income"> Ingreso</label>

              <input {...register('type')} type="radio" value="1" className="ml-2" id="expense" />
              <label htmlFor="expense"> Egreso</label>
            </FieldWrapper>
          ) : null}

          <FieldWrapper className="my-4" label="Concepto" htmlFor="desc">
            <TextInput id="desc" {...register('desc', { required: true })} />
          </FieldWrapper>

          <FieldWrapper className="my-4" label="Monto" htmlFor="amount">
            <TextInput id="amount" type="number" min={1} {...register('amount', { required: true, min: 1 })} />
          </FieldWrapper>

          <FieldWrapper className="my-4" label="Fecha" htmlFor="date">
            <TextInput id="date" type="date" {...register('date', { required: true })} />
          </FieldWrapper>

          <FieldWrapper htmlFor="category-input" label="Categorías">
            <Controller
              name="categories"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CategoryEditor
                  value={value}
                  onAdd={(category) => onChange([...value, category])}
                  onDelete={(category) => onChange(value.filter((_category) => _category !== category))}
                />
              )}
            />
          </FieldWrapper>

          <div className="flex justify-between mt-10 gap-x-10">
            <Button className="flex-1" color="bg-green-500" disabled={isSubmitting || !isValid || !isDirty}>
              {mode === 'creating' ? 'Crear' : 'Guardar'}
            </Button>
            <Button
              className="flex-1"
              color="bg-red-500"
              onClick={() => typeof onClose === 'function' && onClose()}
              disabled={isSubmitting}
              type="button"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </article>
    </div>
  ) : null;
}
