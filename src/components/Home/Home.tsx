import React from 'react'
import laundry from '../../assets/images/laundry.png'
import { Link } from 'react-router-dom'

export const Home = () => {
  return (
    <div>
      <div>
        <div className='bg-teal-500 pt-40 rounded-b-md'>
        <h2 className='text-center  uppercase text-gray-100 font-bold text-4xl pb-8 '>Bienvenidos</h2>

        </div>

        <div className="flex justify-center">
          <img src={laundry} className="w-64" alt="Laundry logo" />
        </div>

        <div className='flex justify-center gap-8'>
        <Link to="/auth/login" className="py-3 px-5 me-2 mb-2  text-sm font-medium border text-gray-200 bg-teal-500 hover:bg-teal-600 cursor-pointer ">Iniciar sesión</Link>
        
        <Link to="/auth/register" className="py-3 px-5 me-2 mb-2 text-gray-700 text-sm font-medium border hover:text-gray-200 border-teal-500 hover:bg-teal-600 cursor-pointer ">Registrarse</Link>
        </div>

      </div>

    </div>
  )
}
