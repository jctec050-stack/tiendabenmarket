import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Store, ShieldCheck, Calculator, Wallet, UserCircle, Search, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { globalSearchQuery, setGlobalSearchQuery } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setGlobalSearchQuery(query);
    if (location.pathname !== '/') {
      navigate('/');
    }
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
        <div className="flex justify-between h-20 items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="bg-primary/20 p-2 sm:p-2.5 rounded-xl group-hover:bg-primary/30 transition-colors transform group-hover:scale-105 shadow-sm">
              <Store className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <span className="font-headline font-extrabold text-xl sm:text-2xl tracking-tighter text-white hidden sm:block">Benmarket</span>
          </Link>

          {/* Buscador Integrado en el Header */}
          {(!user || user.role === 'Cliente') && (
            <div className="flex-1 max-w-xl relative group mx-2 sm:mx-6">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <input 
                className="w-full bg-white border border-slate-200 py-2 sm:py-2.5 pl-9 sm:pl-11 pr-4 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 text-slate-800 shadow-sm text-sm sm:text-base font-medium outline-none" 
                placeholder="Buscar productos" 
                type="text"
                value={globalSearchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}
          
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
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
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all shadow-sm group"
                  aria-label="Menú de usuario"
                >
                  <User className="w-6 h-6 transition-transform group-hover:scale-110" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      to="/login" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      Registrarme
                    </Link>
                  </div>
                )}
              </div>
            )}

            {(!user || user.role === 'Cliente') && (
              <>
                <Link to="/favorites" className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all group text-white flex items-center justify-center" title="Mis Favoritos">
                  <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
                </Link>
                
                <Link to="/cart" className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all group text-white flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-black">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}