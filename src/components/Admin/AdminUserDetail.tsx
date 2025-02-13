import axios from 'axios';
import { Box, Calendar, ShieldHalf, Trash2, User, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Order {
    id: number;
    status: string;
    total_amount: number;
}

interface User {
    id: number;
    name: string;
    role: string;
    created_at: string;
    orders: Order[];
}

export const AdminUserDetail = () => {
    const [user, setUser] = useState<User | null>(null);
    const { id } = useParams<{ id: string }>();
    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();


    useEffect(() => {
        if (!authToken) {
            navigate('/auth/login');
            return;
        }

        const getUserById = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_ADMIN_USERS}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUserById();

    }, [id, authToken, navigate]);

    const deleteUser = async () => {

        if (!user) return;

        const isConfirmed = window.confirm(`Estás seguro de eliminar a ${user.name}?`);

        if (!isConfirmed) return;

        try {
            await axios.delete(`${import.meta.env.VITE_ADMIN_CONFIRM_USER_DELETE}/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            alert("Usuario eliminado correctamente.");
            setUser(null);
            navigate("/admin/users");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario.");
        }
    };

    return (
        <div className='p-6'>
            {user ? (
                <div>
                    <div className=' bg-gray-100 space-y-2 py-4 rounded-lg shadow-lg'>
                        <div className='flex justify-center items-center gap-6 mb-4'>

                            <div className='bg-teal-100 px-2 py-2 rounded-full'>

                                <User size={28} className='text-teal-500' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-800'>{user.name}</h2>
                                <p className='text-sm text-gray-400'>User Profile Details</p>
                            </div>
                        </div>

                    </div>

                    <div className=' bg-gray-100 space-y-2 py-4 rounded-lg shadow-lg mt-4'>
                        <div className='flex items-center justify-evenly'>
                            <p className='flex items-center gap-2 text-gray-600'><Calendar size={20} className='text-teal-700' />Ingresó en {new Date(user.created_at).toLocaleDateString()}</p>
                            <p className='flex  items-center gap-2 text-gray-600'><UserCog size={20} className='text-teal-700' /> Rol {user.role}</p>

                        </div>

                    </div>

                    <div className='p-4 bg-gray-50 mt-4 shadow-lg rounded-lg'>

                        <h3 className='flex gap-2 text-lg items-center font-semibold text-gray-700'><Box size={22} />Detalles Ordenes</h3>

                        <div className='p-4 mt-2 rounded-lg shadow-sm border border-gray-200 bg-gray-100'>

                            {user.orders.length > 0 ? (
                                <div>
                                    {user.orders.map(order => (
                                        <div key={order.id}>
                                            <div className='flex items-center justify-around'>
                                                <p className='font-semibold text-gray-800 '>ID #{order.id}</p>
                                                <p className={`px-2 rounded-full font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'pennding' ? 'bg-yellow-100 text-yellow-700' : order.status === 'processed' ? 'bg-blue-200 text-blue-700' : ''}`}>{order.status === "delivered" ? "Delivered" : order.status === "pending" ? "Pending" : order.status === "processed" ? "Processed" : ""}</p>

                                            </div>
                                            <div className='flex items-center justify-around mt-4'>
                                                <p className='text-gray-700'>Total</p>
                                                <p className='px-2 text-lg font-semibold text-green-700'> ${order.total_amount ? order.total_amount : 'No price'}</p>

                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Este usuario no tiene órdenes.</p>
                            )}

                        </div>
                        <div className='w-50 text-center flex justify-center  mt-2 bg-red-500 rounded-sm'>
                            <button onClick={deleteUser} className=' flex items-center gap-2 justify-center uppercase text-gray-100 font-semibold'><Trash2 size={19} />Eliminar Usuario</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando usuario...</p>
            )}
        </div>
    );
};
