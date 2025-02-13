import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

interface CartItem {
  id: number;
  quantity: number;
}

export const Dashboard = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTem] = useState('');

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_CATEGORIES);
        setCategories(response.data);
      } catch (error) {
        setError('Failed to load categories. Please try again later.');
        console.error(error);
      }
    };
    getCategories();
  }, []);

  const handleQuantityChange = (id: number, action: 'increment' | 'decrement') => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === id);

      if (!existingItem && action === 'increment') {
        return [...prevCart, { id, quantity: 1 }];
      }

      return prevCart
        .map(item => {
          if (item.id === id) {
            const newQuantity =
              action === 'increment' ? item.quantity + 1 : Math.max(0, item.quantity - 1);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const addToCart = async (categoryId: number, quantity: number) => {
    if (quantity < 1) {
      setError('Seleccioná un item mínimo');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Inicia sesión para seguir comprando');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        import.meta.env.VITE_CART,
        { category_id: categoryId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setCart(prev => prev.filter(item => item.id !== categoryId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add item to cart');
      console.error('Error adding item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className='mb-6'>
        <h1 className='flex gap-2 text-2xl items-center font-semibold'> <ShoppingBag className='text-teal-700' size={28} /> Carrito Laundry</h1>
        <h4 className='mt-2 text-gray-600 text-sm'>Seleccioná la ropa que deseas agregar en el carrito.</h4>
      </div>

      <div className="mt-6 mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-teal-600 " />
        </div>
        <input
          type="text"
          placeholder="Buscá por nombre de la prenda"
          className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTem(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCategories.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex items-center"
          >
            
            <div className="w-1/2 p-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>

            
            <div className="w-2/3 p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-teal-600 font-semibold mt-1">${item.price}</p>

              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, 'decrement')}
                    className="p-1 rounded-sm text-gray-500 bg-gray-200 hover:bg-gray-200"
                  >
                    <Minus size={20} />
                  </button>

                  <span className="w-8 text-center text-blue-500 font-bold">
                    {cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(item.id, 'increment')}
                    className="p-1 rounded-sm bg-teal-500 text-gray-100 hover:bg-teal-600 "
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    addToCart(
                      item.id,
                      cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0
                    )
                  }
                  disabled={
                    loading ||
                    !cart.some(
                      (cartItem) => cartItem.id === item.id && cartItem.quantity > 0
                    )
                  }
                  className={`flex items-center mt-2 w-full py-1 justify-center rounded-lg ${loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    } text-white transition-colors`}
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className='flex justify-center '>
          <Link className='bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-center w-full uppercase font-semibold text-white' to="/carrito">Ver carrito</Link>
        </div>


      </div>
    </div>
  );
};
