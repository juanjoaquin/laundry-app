import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Widget } from '../Widget/Widget';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClotheProps {
  id: number;
  status: string;
  total_amount: number;
  items: ItemsProps[];
}

interface ItemsProps {
  id: number;
  order_id: number;
  quantity: number;
  price_per_unit: number;
  subtotal: number;
  clothe?: {
    id: number;
    category_id: number;
    user_id: number;
    description: string | null;
    created_at: string;
    updated_at: string;
    name: string;
  };
}

interface Category {
  id: number;
  image: string;
  name: string;
}

export const Cart = () => {
  const [clothes, setClothes] = useState<ClotheProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState(0);

  const token = localStorage.getItem('authToken');
  if (!token) {
    setError('Please login to view your cart.');
    return <div>{error}</div>;
  }

  useEffect(() => {
    const getClothes = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_CLOTHES_CART, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        const clothesData = response.data.clothes;
        if (!clothesData || clothesData.length === 0) {
          setError("Tu carrito está vacío.");
          return;
        }
    
        setClothes(clothesData);
    
        const totalItems = clothesData.reduce((total: number, clothe: ClotheProps) => {
          return total + clothe.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
        }, 0);
        
        setItemCount(totalItems);
      } catch (error: any) {
        console.error(error);
        if (error.response?.status === 404) {
          setError("Tu carrito está vacío.");
        } else {
          setError("Error al obtener los datos del carrito.");
        }
      }
    };


    const getCategories = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_CATEGORIES, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error(error);
        setError('Error fetching category data');
      }
    };

    getClothes();
    getCategories();
  }, [token]);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  const getCategoryImage = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.image : 'No image';
  };

  const handleRemoveItem = async (orderItemId: number) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/${orderItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Item eliminado del carrito", response.data);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <Widget itemCount={itemCount} /> */}
  
      {error ? (
        <div className="text-center text-gray-600 mt-10 ">
          <p className="text-xl font-semibold mb-4">{error}</p>
          <Link to="/dashboard" className="text-white font-semibold px-2 py-2 border bg-teal-500">
            Ir a la tienda
          </Link>
        </div>
      ) : clothes.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p className="text-xl font-semibold">Tu carrito está vacío.</p>
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        clothes.map((clothe) => (
          <div key={clothe.id}>
            <h3 className="text-2xl font-semibold mt-6 mb-2 text-gray-600">Review Carrito</h3>
            <div className="space-y-4">
              {clothe.items.map((item) => (
                <div key={item.id} className="bg-white shadow px-4 py-4 rounded-lg">
                  {item.clothe && (
                    <div className="flex justify-evenly items-center m-2">
                      <div className="flex items-center gap-14">
                        <img src={getCategoryImage(item.clothe.category_id)} className="w-14" alt="" />
  
                        <div className="flex flex-col">
                          <h2 className="font-semibold text-lg w-2">
                            {getCategoryName(item.clothe.category_id)}
                          </h2>
                          <p className="text-teal-600 font-semibold">${item.subtotal}</p>
                          <p className="font-semibold text-gray-500">x {item.quantity}</p>
                        </div>
  
                        <div>
                          <span
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 cursor-pointer"
                          >
                            <Trash2 />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-2">
              <hr className="mt-2" />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xl font-semibold text-teal-600">Total</p>
                <p className="text-2xl font-bold text-teal-600">${clothe.total_amount}</p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Link
                to={`/orders/${clothe.id}/delivery`}
                className="bg-gradient-to-r from-teal-500 flex items-center gap-4 justify-center to-teal-600 px-4 py-2 text-center w-full uppercase font-semibold text-white"
              >
                CONTINUAR COMPRA <ShoppingBag size={20} />
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
