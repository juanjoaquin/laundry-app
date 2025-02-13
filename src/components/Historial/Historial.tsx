import axios from 'axios';
import { useEffect, useState } from 'react'
import { HistorialList } from './HistorialList';

export interface Orders {
    id: number;
    user_id: number;
    status: string;
    notes: string | null;
    total_amount: number;
    created_at: string;
    items: Items[];
    delivery: Delivery;
}

export interface Items {
    id: number;
    clothes_id: number;
    quantity: number;
    price_per_unit: number;
    subtotal: number;
    clothe: {
        category_id: number;
    }
}

export interface Delivery {
    id: number;
    address: string;
    on_sucursal: string;
    delivery_status: string;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    price: number;
    image: string;
    created_at: string;
    updated_at: string;
}

export const Historial = () => {


    const [orderHistorial, setOrderHistorial] = useState<Orders[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);


    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('Error al obtener token');
        return;
    }

    useEffect(() => {
        const getHistorial = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_HISTORIAL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                setOrderHistorial(response.data.orders);
            } catch (error) {
                console.log(error);
            }
        }

        const getCategories = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_CATEGORIES, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getHistorial();
        getCategories();

        document.title = "Purchase history"
    }, [])

    return (
        <div>
            {orderHistorial.length === 0 ? (
                <div>
                    <p className="text-center text-gray-600 text-xl mt-4">No hay pedidos en tu historial.</p>
                </div>
            ) : (
                orderHistorial.map((historial) => (
                    <HistorialList key={historial.id} historial={historial} categories={categories} />
                ))
            )}
        </div>
    );
};
