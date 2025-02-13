import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';

export const OrderDelivery = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ address?: string; on_sucursal?: string }>({});

  const navigate = useNavigate();

  const orderDeliverySchema = z.object({
    address: z.string().min(3, 'El campo debe tener al menos 3 caracteres'),
    on_sucursal: z.string().min(2, 'Debe tener al menos 2 caracteres'),
  });

  type OrderDeliveryForm = z.infer<typeof orderDeliverySchema>;

  const [formData, setFormData] = useState<OrderDeliveryForm>({
    address: '',
    on_sucursal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const handleErrorForm = orderDeliverySchema.safeParse(formData);
    if (!handleErrorForm.success) {
      const formattedErrors = handleErrorForm.error.format();
      setErrors({
        address: formattedErrors.address?._errors[0],
        on_sucursal: formattedErrors.on_sucursal?._errors[0],
      });
      return;
    }

    setErrors({});

    const token = localStorage.getItem('authToken');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/delivery`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('¡Entrega registrada con éxito!');
      navigate(`/orders/${orderId}/pay`);
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar la entrega. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-teal-600">Order Delivery</h1>
      <p className="text-lg">Order ID: {orderId}</p>
      <form onSubmit={handleSubmit} className="mt-4">

        <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="address">
          Dirección
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full mt-2 px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
            placeholder="Dirección del domicilio"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </label>

        <label className="block text-lg text-gray-600 font-semibold mb-2" htmlFor="on_sucursal">
          Retiro en sucursal:
          <input
            id="on_sucursal"
            type="text"
            name="on_sucursal"
            value={formData.on_sucursal}
            onChange={handleChange}
            placeholder="Sí o No"
            className={`w-full mt-2 px-3 py-2 border ${errors.on_sucursal ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100`}
          />
          {errors.on_sucursal && <p className="text-red-500 text-sm">{errors.on_sucursal}</p>}
        </label>

        <button
          type="submit"
          className="bg-teal-600 text-white font-semibold px-4 py-2 rounded mt-4"
        >
          Guardar dirección
        </button>
      </form>

      {message && <p className="mt-4 text-teal-500">{message}</p>}
    </div>
  );
};
