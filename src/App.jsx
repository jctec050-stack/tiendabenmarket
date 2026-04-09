import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UsersManager from './pages/UsersManager';
import ProductsManager from './pages/ProductsManager';

// Cajero Pages
import POS from './pages/POS';
import SalesHistory from './pages/SalesHistory';
import Arqueo from './pages/Arqueo';

// Tesoreria Pages
import TesoreriaDashboard from './pages/TesoreriaDashboard';
import ValidarArqueos from './pages/ValidarArqueos';

// Componente para proteger rutas según rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Enrutador del Dashboard según rol
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'Admin':
      return (
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UsersManager />} />
          <Route path="/products" element={<ProductsManager />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    case 'Cajero':
      return (
        <Routes>
          <Route path="/" element={<POS />} />
          <Route path="/history" element={<SalesHistory />} />
          <Route path="/arqueo" element={<Arqueo />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    case 'Tesoreria':
      return (
        <Routes>
          <Route path="/" element={<TesoreriaDashboard />} />
          <Route path="/validations" element={<ValidarArqueos />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    default:
      return <Navigate to="/" replace />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas Públicas / Cliente */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>

              {/* Ruta de Login independiente */}
              <Route path="/login" element={<Login />} />

              {/* Rutas Privadas / Staff */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="*" element={<DashboardRouter />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </AppProvider>
  );
}