import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';

export const Payment = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const navigate = useNavigate();

  const paymentSchema = z.object({
    amount: z.number().min(1, 'El monto debe ser mayor a 0'),
    payment_method: z.string().min(2, 'Debe tener al menos 2 caracteres'),
    number_card: z.string().length(13, 'El número de tarjeta debe tener exactamente 16 dígitos').regex(/^\d+$/, 'El número de tarjeta solo debe contener números'),
    code_security: z.string().length(3, 'El código de seguridad debe tener exactamente 3 dígitos').regex(/^\d+$/, 'El código de seguridad solo debe contener números'),
    name_card: z.string().min(1, 'Debe ser un string, y un mínimo de carácter')
  });

  type PaymentForm = z.infer<typeof paymentSchema>;

  const [formData, setFormData] = useState<PaymentForm>({
    amount: 0,
    payment_method: '',
    number_card: '',
    code_security: '',
    name_card: ''
  });

  const [errors, setErrors] = useState<{ amount?: string ; payment_method?: string; number_card?: string ; code_security?: string; name_card?: string; }>({});
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number_card' || name === 'code_security' ? value : type === 'number' ? Number(value) : value
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = paymentSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      setErrors({
        amount: formattedErrors.amount?._errors[0],
        payment_method: formattedErrors.payment_method?._errors[0],
        number_card: formattedErrors.number_card?._errors[0],
        code_security: formattedErrors.code_security?._errors[0],
        name_card: formattedErrors.name_card?._errors[0],
      });
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/pay`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Pago registrado con éxito.');
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000);
      setErrors({});
    } catch (error) {
      console.error(error);
      setMessage('Error al procesar el pago. Intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-teal-600">Realizar Pago</h1>
      <p className="text-lg">ID de la Orden: {orderId}</p>
      <form onSubmit={handleSubmit} className="mt-4">

      <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="name_card">
          Nombre del titular
          <input
            id="name_card"
            name="name_card"
            type="string"
            value={formData.name_card}
            onChange={handleChange}
            className={`w-full mt-2 px-3 py-2 border ${
              errors.name_card ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
            placeholder='Nombre del titular de la tarjeta'
          />
          {errors.name_card && <p className="text-red-500 text-sm">{errors.name_card}</p>}
        </label>

        <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="number_card">
          Número de la tarjeta
          <input
            id="number_card"
            name="number_card"
            type="string"
            value={formData.number_card}
            onChange={handleChange}
            className={`w-full mt-2 px-3 py-2 border ${
              errors.number_card ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
            placeholder='Numero de la tarjeta'
            
          />
          {errors.number_card && <p className="text-red-500 text-sm">{errors.number_card}</p>}
        </label>

        <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="amount">
          Monto
          <input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full mt-2 px-3 py-2 border ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
            
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </label>

        <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="code_security">
          Código de seguridad de la tarjeta
          <input
            id="code_security"
            name="code_security"
            type="string"
            value={formData.code_security}
            onChange={handleChange}
            className={`w-full mt-2 px-3 py-2 border ${
              errors.code_security ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
            placeholder='Los últimos 3 números detrás de la tarjeta'
          />
          {errors.code_security && <p className="text-red-500 text-sm">{errors.code_security}</p>}
        </label>

        <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="payment_method">
          Método de pago
          <input
            id="payment_method"
            name="payment_method"
            type="text"
            value={formData.payment_method}
            placeholder='Tarjeta de crédito o débito'
            onChange={handleChange}
            className={`w-full mt-2 px-3 py-2 border ${
              errors.payment_method ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
            
          />
          {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method}</p>}
        </label>

        <button
          type="submit"
          className="bg-teal-600 text-white font-semibold px-4 py-2 rounded mt-4"
        >
          Guardar pago
        </button>
      </form>

      {message && <p className="mt-4 text-teal-500 ">{message}</p>}
    </div>
  );
};
