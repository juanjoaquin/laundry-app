import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CircleUser, ChevronDown, LogOut, ShoppingCart, WashingMachine, History, DiamondPercent, Shield,
  CreditCardIcon,
  Truck,
  Users,
  Store,
  BadgeDollarSign
} from "lucide-react";
import { getUserData } from "../../services/authService"; 

export const Nav = () => {
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  

  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) return;
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [authToken]);

  const handleLogout = async () => {
    if (!authToken) return;

    try {
      await axios.post(import.meta.env.VITE_LOGOUT, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      localStorage.removeItem("authToken");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setMenuOpen(false);
  };

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="bg-teal-500 text-white p-4 flex items-center justify-between relative z-50">
      <div className="text-lg font-bold">
        <Link className="flex items-center gap-2" to="/dashboard">
          <DiamondPercent size={22} /> Laundry App
        </Link>
      </div>

      <div className="flex items-center space-x-4 ">
        {authToken ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 p-2 bg-teal-600 rounded-lg hover:bg-teal-700"
            >
              <CircleUser size={24} />
              <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-500 rounded-lg shadow-lg">
                <ul>
                  {user?.role !== "admin" && (
                    <>
                      <li>
                        <Link
                          to="/dashboard"
                          className="flex gap-2 px-4 py-2 hover:bg-teal-100"
                          onClick={handleLinkClick}
                        >
                          <WashingMachine /> Lavandería
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/carrito"
                          className="flex gap-2 px-4 py-2 hover:bg-teal-100"
                          onClick={handleLinkClick}
                        >
                          <ShoppingCart /> Carrito
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/historial"
                          className="flex gap-2 px-4 py-2 hover:bg-teal-100"
                          onClick={handleLinkClick}
                        >
                          <History /> Historial
                        </Link>
                      </li>
                    </>
                  )}

                  {user?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex gap-2 px-4 py-2 hover:bg-teal-100 font-semibold text-blue-600"
                        onClick={handleLinkClick}
                      >
                        <Shield /> Admin Panel
                      </Link>

                      <Link
                        to="/admin/orders"
                        className="flex gap-2 px-4 py-2 hover:bg-teal-100 font-semibold text-gray-600"
                        onClick={handleLinkClick}
                      >
                        <CreditCardIcon /> Orders
                      </Link>

                      <Link
                        to="/admin/deliveries"
                        className="flex gap-2 px-4 py-2 hover:bg-teal-100 font-semibold text-gray-600"
                        onClick={handleLinkClick}
                      >
                        <Truck /> Delivery
                      </Link>

                      <Link
                        to="/admin/users"
                        className="flex gap-2 px-4 py-2 hover:bg-teal-100 font-semibold text-gray-600"
                        onClick={handleLinkClick}
                      >
                        <Users /> Users
                      </Link>

                      <Link
                        to="/admin/store"
                        className="flex gap-2 px-4 py-2 hover:bg-teal-100 font-semibold text-gray-600"
                        onClick={handleLinkClick}
                      >
                        <Store /> Tienda
                      </Link>

                      <Link
                        to="/admin/prices"
                        className="flex gap-2 px-4 py-2 hover:bg-teal-100 font-semibold text-gray-600"
                        onClick={handleLinkClick}
                      >
                        <BadgeDollarSign /> Precios
                      </Link>
                    </li>
                  )}

                  

                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex gap-2 w-full text-left px-4 py-2 text-red-500 bg-red-100 font-semibold"
                    >
                      <LogOut /> Logout
                    </button>
                  </li>
                </ul>

              </div>
            )}
          </div>
        ) : null}
      </div>
    </nav>
  );
};
