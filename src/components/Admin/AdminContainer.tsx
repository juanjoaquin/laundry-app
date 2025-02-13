// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { CircleCheckBig, Clock,  ExternalLink,  LayoutGrid,  Package, TrendingUp, User, Users2 } from 'lucide-react';


interface OrderProp {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
}


const AdminContainer: React.FC = () => {
  const [orders, setOrders] = useState<OrderProp[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

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

    const getUsers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_ADMIN_USERS, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });
        setUsers(response.data.users)
      } catch (error) {
        console.log(error);
      };

    }

    if (!authToken) {
      navigate('/auth/login');
      return;
    }

    getUsers();
    fetchOrders();
  }, [authToken, navigate]);

  if (loading) return <div>Loading...</div>;

  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const processedOrders = orders.filter(order => order.status === "processed").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;
  const usersFilter = users.filter(user => user.role === "user").length;

  return (
    <div className='p-6'>

      <div className='mb-8'>
        <h1 className='flex gap-2 text-2xl items-center font-semibold'> <LayoutGrid className='text-teal-700' size={28}/> Admin Dashboard</h1>
        <p className='mt-1 text-sm text-gray-500'>Desde el panel, se podrá actualizar las ordenes, los pagos y los envíos</p>
      </div>

      <div>
        {orders.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='py-8 border border-yellow-400 bg-yellow-50 shadow rounded-lg'>

              <div className='px-6 space-y-4 flex flex-col'>

                <Clock className='text-amber-600' />
                <div className='flex justify-between'>
                  <p className='text-amber-800 text-sm font-semibold '> Ordenes pendientes</p>


                  <span className='flex text-green-600 font-semibold items-center gap-2 text-sm'> <TrendingUp size={20} className="text-green-600" />+1.1%</span>

                </div>
                <p className='text-2xl text-gray-900 font-bold'>{pendingOrders}</p>


              </div>




            </div>

            <div className='py-8 border border-green-400 bg-green-100 shadow rounded-lg'>

              <div className='px-6 space-y-4 flex flex-col'>

                <CircleCheckBig className='text-teal-600' />
                <div className='flex justify-between'>
                  <p className='text-green-800 text-sm font-semibold '> Ordenes aprobadas</p>


                  <span className='flex text-green-600 font-semibold items-center gap-2 text-sm'> <TrendingUp size={20} className="text-green-600" />+4.3%</span>

                </div>
                <p className='text-2xl text-gray-900 font-bold'>{processedOrders}</p>


              </div>




            </div>

            <div className='py-8 border border-blue-400 bg-blue-100 shadow rounded-lg'>

              <div className='px-6 space-y-4 flex flex-col'>

                <Package className='text-sky-600' />
                <div className='flex justify-between'>
                  <p className='text-sky-800 text-sm font-semibold '> Ordenes con delivery</p>


                  <span className='flex text-green-600 font-semibold items-center gap-2 text-sm'> <TrendingUp size={20} className="text-green-600" />+4.1%</span>

                </div>
                <p className='text-2xl text-gray-900 font-bold'>{deliveredOrders}</p>


              </div>




            </div>



          </div>

        ) : (
          <p>No orders available.</p>
        )}



      </div>



      {users.length > 0 ? (
        <div >
          <div className='py-8 border border-indigo-400 bg-indigo-100 shadow rounded-lg'>

            <div className='px-6 space-y-4 flex flex-col'>

              <Users2 className='text-indigo-600' />
              <div className='flex justify-between'>
                <p className='text-purple-700 text-sm font-semibold '> Usuarios</p>


                <span className='flex text-green-600 font-semibold items-center gap-2 text-sm'> <TrendingUp size={20} className="text-green-600" />+9.8%</span>

              </div>
              <p className='text-2xl text-gray-900 font-bold'>{usersFilter}</p>


            </div>




          </div>

        </div>
      ) : <p>No hay users</p>}

      {orders.length > 0 ? (
        <div className='overflow-x-auto mt-4 border shadow-lg rounded-lg'>
          <div className='p-6 flex justify-between items-center'>
            <div>
            <h3 className='text-lg font-semibold text-gray-700'>Últimas ordenes</h3>
            <p className='text-sm'>Mirá las últimas ordenes</p>
            </div>
            <div className='bg-blue-600 px-2 py-2 rounded-lg shadow-sm'>
              <Link to="/admin/orders" className='flex  items-center text-gray-100 gap-1'>Ver <ExternalLink size={20} /></Link>
            </div>
          </div>
          <table className='w-full'>
            <thead >
              <tr className='bg-gray-50 border-b border-gray-100'>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                  Customer ID
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                  Date
                </th>

              </tr>
            </thead>

            <tbody className='divide-y divide-gray-200 bg-white'>

              {orders.map((order, index) => (
                <tr key={order.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} w-full`}>
                  <td className='px-6 py-3 text-left font-semibold'>#{order.id}</td>
                  <td className="px-6 py-3 text-left">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full 
                      ${order.status === 'processed' ? 'bg-blue-100 text-blue-600' : ''} 
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : ''} 
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-600' : ''}
                      ${order.status === 'pending'   ? 'bg-yellow-50 text-yellow-600' : ''}`}
                      
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className='px-6 py-3 text-left '> <span className='bg-gray-200 rounded-full px-3 py-1 flex items-center font-semibold'><User className='text-gray-500' size={20 }/>{order.user_id}</span></td>
                  <td className='px-6 py-3 text-left text-sm'>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No orders yet</p>}


    </div>
  );
};

export default AdminContainer;
