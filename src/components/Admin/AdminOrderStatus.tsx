import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Boxes, Calendar, CircleFadingArrowUp, Package, User } from 'lucide-react';

interface OrderProp {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  total_amount: number;
}


const AdminOrderStatus: React.FC = () => {
  const [orders, setOrders] = useState<OrderProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_ADMIN_ORDERS}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (!authToken) {
      navigate('/auth/login');
      return;
    }

    fetchOrders();
  }, [authToken, navigate]);

  if (loading) return <div>Loading...</div>;


  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_ADMIN_ORDERS}/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );


      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      alert(response.data.message);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className='p-6'>
      <div>
        <h1 className='flex gap-2 text-2xl items-center font-semibold'> <Boxes className='text-teal-700' size={28} /> Historial de Ordenes</h1>
        <h4 className='mt-2 text-gray-600 text-sm'>Acá podrás actualizar el proceso de las ordenes.</h4>
      </div>

      <div className='mt-6'>
        {orders.length > 0 ? (
          <div>
            {orders.map((order) => (
              <div key={order.id} className='flex flex-col  rounded-lg mt-6 shadow-lg bg-gray-100'>
                <div className='space-y-2 px-4 py-2'>
                  <div className='flex justify-between '>
                    <p className='text-lg font-semibold flex items-center gap-2'><Package className='text-teal-700' size={20} /> #{order.id}</p>
                    <p className={`bg-gray-200 px-2 rounded-lg shadow-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-700 font-semibold' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 font-semibold' : order.status === 'cancelled' ? 'bg-red-100 text-red-700 font-semibold' : order.status === 'processed' ? 'bg-sky-100 text-blue-700 font-semibold' : '' }`}>{order.status}</p>

                  </div>
                  <div>
                    <p className='flex items-center gap-2 text-gray-600'><User size={20} /> Cliente:  {order.user_id}</p>

                  </div>

                  <div>
                    <p className='flex items-center gap-2 text-gray-600'><BadgeDollarSign size={20} /><span className='text-green-700 font-semibold'>{order.total_amount}</span></p>

                  </div>

                  <div>
                    <p className='flex items-center gap-2 text-gray-600'><Calendar size={20} />{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className='flex items-center gap-2 text-gray-700 font-semibold'><CircleFadingArrowUp size={20} /> Actualizar orden</p>
                  </div>

                </div>
                <div className='w-72 px-2 py-3 flex justify-center text-center mx-auto '>
                  <select
                  className='w-full py-2 px-2 bg-gray-100 rounded-lg font-semibold text-gray-700 border border-gray-200 shadow-sm'
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={order.status === "delivered"}
                  >
                    <option value="processed" className='font-semibold'>Processed</option>
                    <option value="delivered" className='font-semibold '>Delivered</option>
                  </select>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders available.</p>
        )}
      </div>


    </div>
  );
};

export default AdminOrderStatus;
