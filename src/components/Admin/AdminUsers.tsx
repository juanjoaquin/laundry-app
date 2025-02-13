import axios from "axios";
import { Calendar, Mail, Search, ShieldHalf, UserCheck2, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserProp {
    id: number;
    name: string;
    email: string;
    role: string;
    password: string;
    created_at: string;
}

export const AdminUsers = () => {

    const [users, setUsers] = useState<UserProp[]>([]);
    const [searchTerm, setSearchTem] = useState('');

    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();



    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_ADMIN_USERS, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })
                setUsers(response.data.users);
            } catch (error) {
                console.log(error);
            }
        }

        if (!authToken) {
            navigate('/auth/login');
            return;
        }
        getUsers();
    }, []);

    const filtererdUsers = users.filter(user => user.role === 'user')
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6">

            <div>
                <h1 className='flex gap-2 text-2xl items-center font-semibold'> <Users2 className='text-teal-700' size={28} /> Lista de Users</h1>
                <h4 className='mt-2 text-gray-600 text-sm'>Registro de usuarios. Se podrán ver, y eliminar.</h4>
            </div>

            <div className="mt-6 mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-teal-600 " />
                </div>
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTem(e.target.value)}
                />
            </div>

            <div className="w-full border border-gray-200 shadow-lg rounded-lg px-4 py-4">
                <h2 className="font-semibold text-lg text-gray-700">Estadísticas</h2>
                <div className="mt-4 px-4 flex gap-3 bg-teal-100 rounded-lg py-2 items-center">
                    <UserCheck2 size={32} className="text-teal-600" />
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm">Total Users</h3>
                        <span className="text-2xl font-bold">

                            {filtererdUsers.length}
                        </span>

                    </div>
                </div>
            </div>

            <div className="p-2 py-4 space-y-4">

                {filtererdUsers
                    .map((user) => (
                        <div key={user.id}>
                            <div className="border border-gray-200 rounded-lg shadow-lg space-y-2 pb-4  ">
                                <div className="p-4 flex gap-4">
                                    <div className="h-12 w-12  bg-blue-100 rounded-full flex items-center justify-center ">
                                        <span className="text-teal-500 font-bold ">{user.name.charAt(0).toLocaleUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700">{user.name}</h2>
                                        <p className="text-gray-600 text-sm">ID: {user.id}</p>

                                    </div>
                                </div>

                                <div className="px-4 space-y-2">
                                    <p className="flex items-center gap-2 text-gray-600"><Mail /> {user.email}</p>
                                    <p className="flex items-center gap-2 text-gray-600"><ShieldHalf />{user.role}</p>
                                    <p className="flex items-center gap-2 text-gray-600"><Calendar />Registró {new Date(user.created_at).toLocaleDateString()}</p>

                                </div>

                                <div className="px-6 py-4 bg-gray-50 rounded-b-lg ">
                                    <Link to={`${user.id}`} className="w-full bg-teal-600 hover:bg-teal-700 text-gray-200 py-2 px-4 rounded-md transition-colors font-semibold duration-300">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
