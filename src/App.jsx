import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages de clientes — carga inmediata (bundle principal)
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirm from './pages/Confirm';
import Bienvenida from './pages/Bienvenida';
import About from './pages/About';
import Jobs from './pages/Jobs';
import Shipping from './pages/Shipping';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// Pages del Dashboard — carga diferida (chunk separado, solo staff las usa)
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));
const UsersManager      = lazy(() => import('./pages/UsersManager'));
const ProductsManager   = lazy(() => import('./pages/ProductsManager'));
const ThemeManager      = lazy(() => import('./pages/ThemeManager'));
const SalesHistory      = lazy(() => import('./pages/SalesHistory'));
const DeliveryManager   = lazy(() => import('./pages/DeliveryManager'));
const BannersManager    = lazy(() => import('./pages/BannersManager'));
const TesoreriaDashboard = lazy(() => import('./pages/TesoreriaDashboard'));
const ValidarArqueos    = lazy(() => import('./pages/ValidarArqueos'));

// Spinner de carga para el dashboard
const DashboardSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);



// Componente para proteger rutas según rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Componente para decidir qué dashboard renderizar en la raíz de /dashboard según el rol
const DashboardHome = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Cajero':
      return <SalesHistory />;
    case 'Tesoreria':
      return <TesoreriaDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Rutas Públicas / Cliente */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="about" element={<About />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="shipping" element={<Shipping />} />
                  <Route path="faq" element={<Faq />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="privacidad" element={<PrivacyPolicy />} />
                  <Route path="terminos" element={<TermsAndConditions />} />
                </Route>

                {/* Ruta de Login independiente */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirm" element={<Confirm />} />
                <Route path="/bienvenida" element={<Bienvenida />} />

                {/* Rutas Privadas / Staff — Cargadas de forma diferida (lazy) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={
                    <Suspense fallback={<DashboardSpinner />}>
                      <DashboardHome />
                    </Suspense>
                  } />
                  <Route path="theme" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <Suspense fallback={<DashboardSpinner />}>
                        <ThemeManager />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="delivery" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Cajero']}>
                      <Suspense fallback={<DashboardSpinner />}>
                        <DeliveryManager />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="users" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <Suspense fallback={<DashboardSpinner />}>
                        <UsersManager />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="products" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Cajero']}>
                      <Suspense fallback={<DashboardSpinner />}>
                        <ProductsManager />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="banners" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Cajero']}>
                      <Suspense fallback={<DashboardSpinner />}>
                        <BannersManager />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="validations" element={
                    <ProtectedRoute allowedRoles={['Tesoreria']}>
                      <Suspense fallback={<DashboardSpinner />}>
                        <ValidarArqueos />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </AppProvider>
  );
}
