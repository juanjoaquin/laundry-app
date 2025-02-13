import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import laundry from '../../assets/images/laundry.png'



export const Register = () => {

    const registerSchema = z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1)
    });

    type RegisterForm = z.infer<typeof registerSchema>

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterForm>({
        name: '',
        email: '',
        password: ''
    });


    const [errors, setErrors] = useState<string>('');
    const [isOk, setIsOk] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors('');
        setIsOk('');

        try {
            registerSchema.parse(formData);

            await axios.post(import.meta.env.VITE_REGISTER, formData);
            setIsOk('User registered successfully!');

            setTimeout(() => {
                setTimeout(() => {
                    navigate("/");
                }, 500);
            }, 2000);
        }
        catch (error: any) {
            console.log("Error:", error);
            setErrors('Error al crear el usuario. Por favor, intente nuevamente.');

        }
    }

    useEffect(() => {
        document.title = 'Registrarse'
    }, [])

    return (

        <div>
            <div className="text-center ">
                <div className="flex justify-center">
                    <img src={laundry} className="w-64" alt="Laundry logo" />
                </div>
                <h1 className="mt-10 text-3xl uppercase font-bold text-teal-500">Register</h1>
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit} action="" className="space-y-4">
                    <div>

                        <label htmlFor="name" className="font-semibold text-gray-600">Nombre</label>
                        <input type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full mt-2 px-3 py-2 bg-gray-100  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Escribé tú nombre"

                        />
                    </div>

                    <div>

                        <label htmlFor="email" className="font-semibold text-gray-600">Email</label>
                        <input type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-2 px-3 py-2  bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Escribé tú email"

                        />
                    </div>

                    <div>

                        <label htmlFor="password" className="font-semibold text-gray-600">Contraseña</label>
                        <input type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full mt-2 px-3  bg-gray-100 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Escribé la contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        Registrarse
                    </button>

                    <div className="flex justify-center mt-4">
                        <span>¿Ya tenes cuenta? <Link className="text-teal-600 font-bold" to="/auth/login">Inicía sesión</Link></span>

                    </div>
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
        </div>
    );
};
