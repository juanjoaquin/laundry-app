import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Realiza la solicitud al backend para invalidar el token
            await axios.post(import.meta.env.VITE_LOGOUT, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            // Eliminar el token de localStorage
            localStorage.removeItem("authToken");

            // Redirigir al usuario a la página de login
            navigate("/auth/login");
        } catch (error) {
            console.error("Error during logout", error);
            // Opcionalmente, puedes mostrar un mensaje de error si algo sale mal
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
            Logout
        </button>
    );
};
