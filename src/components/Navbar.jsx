import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Store, ShieldCheck, Calculator, Wallet, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getRoleIcon = () => {
    if (!user) return null;
    switch(user.role) {
      case 'Admin': return <ShieldCheck className="w-5 h-5 text-benmarket-100" />;
      case 'Cajero': return <Calculator className="w-5 h-5 text-benmarket-100" />;
      case 'Tesoreria': return <Wallet className="w-5 h-5 text-benmarket-100" />;
      default: return <UserCircle className="w-5 h-5 text-benmarket-100" />;
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary/20 p-2.5 rounded-xl group-hover:bg-primary/30 transition-colors transform group-hover:scale-105 shadow-sm">
              <Store className="w-7 h-7 text-primary" />
            </div>
            <span className="font-headline font-extrabold text-2xl tracking-tighter text-white">Benmarket</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {!user || user.role === 'Cliente' ? (
              <Link to="/cart" className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all group text-white flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-black">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            ) : null}

            {user ? (
              <div className="flex items-center gap-5 border-l border-white/20 pl-6 ml-2">
                <div className="flex items-center gap-3 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    getRoleIcon()
                  )}
                  <div className="hidden sm:flex flex-col pr-2">
                    <span className="text-sm font-bold leading-tight text-white">{user.name}</span>
                    <span className="text-[10px] text-white/70 font-mono font-bold uppercase tracking-wider leading-none">{user.role}</span>
                  </div>
                </div>
                
                {user.role !== 'Cliente' && (
                  <Link to="/dashboard" className="text-sm font-semibold bg-primary text-white hover:bg-primary-container px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                    Dashboard
                  </Link>
                )}
                
                <button onClick={handleLogout} className="p-2.5 hover:bg-error hover:text-white text-white/70 rounded-xl transition-colors group" title="Cerrar sesión">
                  <LogOut className="w-5 h-5 group-hover:text-white" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary text-white hover:bg-primary-container font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}