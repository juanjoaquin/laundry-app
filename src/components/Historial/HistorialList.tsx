import React from 'react';
import { Category, Delivery, Items } from "./Historial";
import { Package2, MapPin, Clock, CreditCard, ShoppingBag, Truck } from 'lucide-react';

interface HistorialProps {
    historial: {
        id: number;
        user_id: number;
        status: string;
        total_amount: number;
        created_at: string;
        items: Items[];
        delivery: Delivery;
    };
    categories: Category[];
}

export const HistorialList: React.FC<HistorialProps> = ({ historial, categories }) => {
    const getCategoryName = (categoryId: number): string => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Category not found";
    };

    const getCategoryImage = (categoryId: number): string => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.image : "Image not found";
    };



    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <ShoppingBag className="w-6 h-6 text-teal-600" />
                        <h2 className="text-2xl font-semibold text-gray-800">Pedido #{historial.id}</h2>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${historial.status}`}>
                        {
                            historial.status === "processed" ?
                                <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>Procesado</span> :
                                historial.status === "delivered" ?
                                    <span className='bg-green-100 text-green-600 px-2 py-1 rounded-full'>Recibido</span> :
                                    ""
                        }
                    </span>

                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-teal-500" />
                        <span>{new Date(historial.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                    <Package2 className="w-5 h-5 text-teal-600" />
                    <h3 className="text-xl font-semibold text-gray-800"> Items</h3>
                </div>
                <div className="space-y-6">
                    {historial.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                                className="w-20 h-20 object-cover rounded-md"
                                src={getCategoryImage(item.clothe.category_id)}
                                alt={getCategoryName(item.clothe.category_id)}
                            />
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{getCategoryName(item.clothe.category_id)}</h4>
                                <div className="mt-1 text-sm text-gray-600">
                                    <p>{item.quantity} x</p>
                                    <p>Precio p/u: ${item.price_per_unit.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-teal-600">${item.subtotal.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-teal-600" />
                            <span className="text-lg font-semibold text-gray-800">Total </span>
                        </div>
                        <div className="text-2xl font-bold text-teal-600">
                            ${historial.total_amount.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                    <Truck className="w-5 h-5 text-teal-600" />
                    <h3 className="text-xl font-semibold text-gray-800">Información Delivery</h3>
                    <p>{historial.delivery ? historial.delivery.id : "Sin información de delivery"}</p>
                </div>
                {historial.delivery ? (
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-teal-500 mt-1" />
                            <div>
                                <p className="font-medium text-gray-800">Dirección del lugar</p>
                                <p className="text-gray-600 uppercase">{historial.delivery.address}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-600">Buscar en tienda:</p>
                                <p className="font-medium text-gray-800">
                                    {historial.delivery.on_sucursal ? "Si" : "No"}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg ">
                                <p className="text-gray-600">Delivery Status:</p>
                                <p className="font-medium text-gray-800">
                                    {
                                        historial.delivery.delivery_status === 'pending' ? 'Pendiente' :
                                            historial.delivery.delivery_status === 'in_transit' ? 'En camino' :
                                                historial.delivery.delivery_status === 'delivered' ? <span className='bg-green-100 text-green-600 px-2 rounded-full'>Entregado</span> :
                                                    ''
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No delivery information assigned yet</p>
                )}
            </div>
        </div>
    );
};