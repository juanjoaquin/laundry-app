import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getUserData } from "../../services/authService"; 
import axios from "axios";
import laundry from '../../assets/images/laundry.png'

interface LoginResponse {
  access_token: string;
}

export const Login = () => {
  const loginSchema = z.object({
    email: z.string().min(1, "El email es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  });

  type LoginForm = z.infer<typeof loginSchema>;

  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string>("");
  const [isOk, setIsOk] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsOk("");

    try {
      const response = await axios.post<LoginResponse>(
        import.meta.env.VITE_LOGIN,
        formData
      );

      const token = response.data.access_token;

      if (token) {
        localStorage.setItem("authToken", token);

        const userData = await getUserData();
        setIsOk("Inicio de sesión exitoso");

        setTimeout(() => {
          if (userData.role === "admin") {
            navigate("/admin"); 
          } else {
            navigate("/dashboard"); 
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error en el inicio de sesión:", error);
      setErrors("Credenciales incorrectas. Inténtalo nuevamente.");
    }
  };

  
  useEffect(() => {
    document.title = "Login";

    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const userData = await getUserData(); 
          console.log("User data:", userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("authToken"); 
        }
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const userData = await getUserData();
          if (userData) {
            navigate("/dashboard"); 
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("authToken"); 
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div>
      <div className="text-center">
        <div className="flex justify-center">
          <img src={laundry} className="w-64" alt="Laundry logo" />
        </div>
        <h1 className="mt-10 text-3xl uppercase font-bold text-teal-500">
          
          Login
        </h1>
      </div>

      <div className="p-4 ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>

            <label htmlFor="email" className="font-semibold text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100"
              placeholder="Escribá su email"
            />
          </div>

          <div>

            <label htmlFor="password" className="font-semibold text-gray-600">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100"
              placeholder="Escribá su contraseña"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Iniciar sesión
          </button>

          <div className="flex justify-center mt-4">
            <span>¿No ténes cuenta? <Link className="text-teal-600 font-bold" to="/auth/register">Registraté</Link></span>

          </div>
        </form>

        {errors && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors}
          </div>
        )}

        {isOk && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {isOk}
          </div>
        )}
      </div>
    </div>
  );
};
