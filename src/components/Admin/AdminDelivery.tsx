import axios from "axios";
import { Calendar1Icon, CircleFadingArrowUp, House, LucideForklift, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Delivery {
    id: number;
    order_id: number;
    address: string;
    on_sucursal: string;
    delivery_status: string;
    created_at: string;
}

interface OrderProp {
    id: number;
    user_id: number;
    delivery?: Delivery;  
}

export const AdminDelivery = () => {
    const [ordersDelivery, setOrdersDelivery] = useState<OrderProp[]>([]);
    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/auth/login');
            return;
        }

        const getOrders = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_ADMIN_ORDERS, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });

                setOrdersDelivery(response.data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        getOrders();
    }, [authToken, navigate]);

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_ADMIN_DELIVERY}/${id}/status`,
                { delivery_status: newStatus },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            setOrdersDelivery((prevOrders) =>
                prevOrders.map(order =>
                    order.delivery?.id === id
                        ? { ...order, delivery: { ...order.delivery, delivery_status: newStatus } }
                        : order
                )
            );

            alert(response.data.message);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className='flex gap-2 text-2xl items-center font-semibold'> <LucideForklift className='text-teal-700' size={28} /> Lógistica de delivery</h1>
                <h4 className='mt-2 text-gray-600 text-sm'>Acá podrás actualizar el proceso de las entregas de los paquetes.</h4>
            </div>
            {ordersDelivery
                .filter(order => order.delivery)
                .map((order) => (
                    <div key={order.id} className="border border-gray-200 shadow-lg rounded-lg">
                        <div className="bg-gray-100 p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="flex items-center gap-2 text-lg font-semibold"><Truck size={20} className="text-teal-700" /> #{order.delivery?.id}</p>
                                    <p className={
                                        `px-2 rounded-full ${order.delivery?.delivery_status === 'delivered' ? 'bg-green-100 font-semibold text-green-700' :
                                            order.delivery?.delivery_status === 'in_transit' ? 'bg-blue-100 font-semibold text-blue-700' :
                                                order.delivery?.delivery_status === 'pending' ? 'bg-yellow-100 font-semibold text-yellow-700' : ''
                                        }`}> {order.delivery?.delivery_status === 'in_transit' ? 'In transit' : order.delivery?.delivery_status === 'delivered' ? 'Delivered' :
                                            order.delivery?.delivery_status === 'pending' ? 'Pending' : ''
                                        }</p>
                                </div>

                                <p className="flex items-center gap-2 text-gray-700"><Package size={20} />Order ID: {order.id}</p>
                                <p className="flex items-center gap-2 text-gray-700"><MapPin size={20} /> {order.delivery?.address}</p>
                                <p className="flex items-center gap-2 text-gray-700"><House size={20} />En sucursal: <span className="uppercase">{order.delivery?.on_sucursal}</span></p>
                                <p className="flex items-center gap-2 text-gray-700">
                                    <Calendar1Icon size={20} />
                                    {order.delivery?.created_at
                                        ? new Date(order.delivery.created_at).toLocaleDateString()
                                        : 'No delivery yet'}
                                </p>

                                <div>
                                    <p className='flex items-center gap-2 text-gray-700 font-semibold'><CircleFadingArrowUp size={20} /> Actualizar orden</p>
                                </div>
                                {order.delivery && (
                                    <select
                                        className='w-full py-2 px-2 bg-gray-50 rounded-lg font-semibold text-gray-600'
                                        value={order.delivery.delivery_status}
                                        onChange={(e) => handleStatusChange(order.delivery!.id, e.target.value)}
                                        disabled={order.delivery.delivery_status === "delivered"}
                                    >
                                        <option value="pending" className="font-semibold">Pending</option>
                                        <option value="in_transit" className="font-semibold">En tránsito</option>
                                        <option value="delivered" className="font-semibold text-teal-700">Delivered</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
        </div>

    );
};
