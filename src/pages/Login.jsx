import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store, LogIn, UserCircle, Calculator, Wallet, ShieldCheck } from 'lucide-react';
import { users } from '../data/mock';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/dashboard'); // Redirigirá a home si es cliente por la lógica de App.jsx o DashboardLayout
      }
    } else {
      setError('Credenciales inválidas. Intenta de nuevo.');
    }
  };

  const handleFastLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
    // Simular el submit para UX más fluida
    setTimeout(() => {
      const form = document.getElementById('login-form');
      if (form) form.requestSubmit();
    }, 100);
  };

  const roleIcons = {
    Cliente: UserCircle,
    Cajero: Calculator,
    Tesoreria: Wallet,
    Admin: ShieldCheck
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sección Izquierda: Formulario de Login */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-benmarket-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-benmarket-200 mb-6 transform rotate-3 hover:rotate-0 transition-transform">
              <Store className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Iniciar Sesión</h2>
            <p className="mt-3 text-lg text-slate-500">
              Ingresa a tu cuenta de <span className="font-bold text-benmarket-600">Benmarket</span>
            </p>
          </div>
          
          <form id="login-form" className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-medium animate-pulse">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="input-field bg-slate-50 focus:bg-white transition-colors"
                  placeholder="ejemplo@benmarket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  required
                  className="input-field bg-slate-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2 py-3.5 text-lg font-bold shadow-lg shadow-benmarket-200/50 hover:shadow-benmarket-300/50 hover:-translate-y-0.5 transition-all">
              <LogIn className="w-5 h-5" /> Ingresar
            </button>
          </form>
        </div>
      </div>

      {/* Sección Derecha: Atajos de Prueba */}
      <div className="flex-1 bg-benmarket-900 text-white flex flex-col justify-center py-12 px-4 sm:px-12 lg:px-24 relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-md mx-auto w-full relative z-10">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 text-white">Perfiles de Prueba 🧪</h3>
            <p className="text-benmarket-200">Haz clic en cualquier perfil para iniciar sesión automáticamente y probar las diferentes vistas del MVP.</p>
          </div>

          <div className="grid gap-4">
            {users.slice(0, 4).map((testUser) => {
              const Icon = roleIcons[testUser.role] || UserCircle;
              return (
                <button
                  key={testUser.id}
                  type="button"
                  onClick={() => handleFastLogin(testUser.email, testUser.password)}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-benmarket-800/80 border border-benmarket-700 hover:bg-white hover:border-white transition-all text-left shadow-sm hover:shadow-xl"
                >
                  <div className="relative">
                    <img src={testUser.avatar} alt={testUser.name} className="w-14 h-14 rounded-full object-cover border-2 border-benmarket-500 group-hover:border-benmarket-600 transition-colors" />
                    <div className="absolute -bottom-1 -right-1 bg-benmarket-900 group-hover:bg-white p-1 rounded-full text-benmarket-300 group-hover:text-benmarket-600 transition-colors shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-white group-hover:text-slate-900 transition-colors">{testUser.name}</p>
                    <p className="text-sm text-benmarket-300 group-hover:text-slate-500 font-mono transition-colors">{testUser.email}</p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-benmarket-900 text-benmarket-200 group-hover:bg-benmarket-100 group-hover:text-benmarket-700 transition-colors border border-benmarket-700 group-hover:border-benmarket-200 shadow-inner">
                      Rol: {testUser.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}