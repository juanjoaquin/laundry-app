import axios from "axios"
import { CheckIcon, CircleDollarSignIcon, IdCard, OctagonX, PencilIcon,  XIcon } from "lucide-react";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

interface CategoryProp {
    id: number;
    name: string;
    price: number;
    image: string;
}

export const AdminClothesPrice = () => {

    const [categories, setCategories] = useState<CategoryProp[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<string>('');

    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/auth/login');
            return;
        }

        const getCategories = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_CATEGORIES, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })
                setCategories(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        getCategories();
    }, []);

    const handleEdit = (category: CategoryProp) => {
        setEditId(category.id);
        setEditPrice(category.price.toString());
    }

    const handleCancel = () => {
        setEditId(null);
        setEditPrice('');
    }

    const handleSave = async (id: number) => {
        try {
            const nuevoPrecio = parseFloat(editPrice);
            if (nuevoPrecio === 0) {
                alert('Ingresar precio valido');
                return;
            }

            await axios.put(`${import.meta.env.VITE_API_URL}/admin/clothes/update-price/${id}`,
                { price: nuevoPrecio }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
            );

            setCategories(categories.map(cate =>
                cate.id === id ? { ...cate, price: nuevoPrecio } : cate
            ));

            setEditId(null);
            setEditPrice("");
            alert('Precio modificado correctamente')
        } catch (error) {
            console.error("Error al actualizar el precio:", error);
            alert("Error al actualizar el precio. Por favor, intente nuevamente.");
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar esta categoria?`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`${import.meta.env.VITE_ADMIN_DEFAULT}/clothes/delete-category/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            // setCategories((prevCategories) => prevCategories.filter(category => category.id !== id));

            setCategories(categories.filter((category) => category.id !== id));
        } catch (error) {
            console.log('Error al eliminar la categoria:', error);
        }
    }

    return (
        <div className='p-6'>
            <div>
                <h1 className='flex gap-2 text-2xl items-center font-semibold'> <CircleDollarSignIcon className='text-teal-700' size={28} /> Modificar precios</h1>
                <h4 className='mt-2 text-gray-600 text-sm'>Acá podrás actualizar los precios de la ropa, y eliminar las prendas de ropa.</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                {categories.map((category) => (
                    <div key={category.id}>
                        <div className="border border-gray-200 rounded-lg shadow-lg mt-4">

                            <div className="flex justify-end px-2 mt-1">
                                <button onClick={() => handleDelete(category.id)} className="text-red-700 bg-red-100 rounded-sm p-1"><OctagonX /></button>

                            </div>

                            <div className="mx-auto text-center flex justify-center">
                                <img className="w-40  object-cover" src={category.image} alt="" />

                            </div>
                            <div className="bg-gray-200 py-2  rounded-b-lg">
                                <div className="flex justify-around">
                                    <h3 className="font-semibold text-gray-800 text-xl">{category.name}</h3>
                                    <p className="text-gray-800 flex items-center gap-2 font-semibold"><IdCard size={20} />{category.id}</p>

                                </div>


                                {editId === category.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            type="number"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:border-teal-500"
                                            step="0.01"
                                            min="0"
                                        />
                                        <button
                                            onClick={() => handleSave(category.id)}
                                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                        >
                                            <CheckIcon size={18} />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <XIcon size={18} />
                                        </button>

                                    </div>

                                ) : (
                                    <div className="flex justify-around items-center">
                                        <div className="text-lg font-semibold text-teal-700">
                                            ${category.price}
                                        </div>
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-1 rounded-lg bg-blue-100 text-blue-700  "
                                        >
                                            <PencilIcon size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}
