
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { Home } from './components/Home/Home';
import { Login } from './auth/components/Login';
import { Register } from './auth/components/Register';
import { Logout } from './auth/components/Logout';
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoutes';
import { Dashboard } from './components/Dashboard';
import { Cart } from './components/Cart/Cart';
import { Nav } from './components/Nav/Nav';
import { OrderDelivery } from './components/OrderDelivery/OrderDelivery';
import { Payment } from './components/Payment/Payment';
import { Historial } from './components/Historial/Historial';
import AdminContainer from './components/Admin/AdminContainer';
import AdminOrderStatus from './components/Admin/AdminOrderStatus';
import { AdminDelivery } from './components/Admin/AdminDelivery';
import { AdminUsers } from './components/Admin/AdminUsers';
import { AdminUserDetail } from './components/Admin/AdminUserDetail';
import { AdminStore } from './components/Admin/AdminStore';
import { AdminClothesPrice } from './components/Admin/AdminClothesPrice';



function App() {
  return (
    <BrowserRouter >
      <Nav />
      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/logout" element={<Logout />} />



        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId/delivery"
          element={
            <ProtectedRoute>
              <OrderDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId/pay"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminContainer />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrderStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/deliveries"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/users/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUserDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/store"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminStore />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/prices"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminClothesPrice />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
