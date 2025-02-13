import axios from 'axios';
import { Shirt } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export const AdminStore = () => {

  const [errors, setErrors] = useState<string>('');
  const [isOk, setIsOk] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);


  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();


  const categorySchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 carácteres"),
    price: z.number().int("El precio debe ser un número entero"),
    image: z.string().min(1, "La URL de la imagen es obligatoria"),
  });

  type CategoryForm = z.infer<typeof categorySchema>

  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    price: 0,
    image: ''
  })

  useEffect(() => {
    if (!authToken) {
      navigate('/auth/login');
      return;
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();

    setErrors('');
    setIsOk('');
    setIsLoading(true);


    try {
      categorySchema.parse(formData);

      await axios.post(import.meta.env.VITE_ADMIN_CREATE_CATEGORY, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      setIsOk('La categoria fue creada correctamente ');
      navigate('/dashboard')
    } catch (error) {
      setErrors('Error al agregar la categoria');
      console.log(error)
    }
  }

  return (

    <div className='p-6'>

      <div>
        <h1 className='flex gap-2 text-2xl items-center font-semibold'> <Shirt className='text-teal-700' size={28} />Agregar ropa a la tienda</h1>
        <h4 className='mt-2 text-gray-600 text-sm'>Se podrá agregar nuevas prendas de ropa y blanqueria para el carrito.</h4>
      </div>

      <form action="" onSubmit={handleSubmit} className='space-y-4 mt-6'>

        <label htmlFor="monto" className="block text-base font-medium text-gray-700 mb-1">Name</label>

        <input type="text"
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder='Nombre de la prenda de ropa'
        />

        <label htmlFor="price" className="block text-base font-medium text-gray-700 mb-1">Price</label>

        <input type="number"
          id='price'
          name='price'
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />



        <label htmlFor="image" className="block text-base font-medium text-gray-700 mb-1">Image</label>

        <input type="text"
          id='image'
          name='image'
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='Agregar URL para la imagen'
        />


        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <p className="font-bold text-sky-500">Creando...</p>
          ) : (
            <span className="font-bold text-white">Agregar Monto</span>
          )}
        </button>

      </form>
      <div className="m-2 flex justify-center text-center ">

        {errors && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors}
          </div>
        )}
      </div>

      {isOk && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {isOk}
        </div>
      )}
    </div>
  );
};
