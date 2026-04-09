import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Users, DollarSign, Calculator, Settings, BarChart } from 'lucide-react';

export default function Sidebar({ role }) {
  const location = useLocation();

  const menuItems = {
    Admin: [
      { path: '/dashboard', name: 'Dashboard Global', icon: BarChart },
      { path: '/dashboard/users', name: 'Gestión Usuarios', icon: Users },
      { path: '/dashboard/products', name: 'Gestión Productos', icon: ShoppingBag },
    ],
    Cajero: [
      { path: '/dashboard', name: 'TPV / POS', icon: Calculator },
      { path: '/dashboard/history', name: 'Historial de Ventas', icon: ShoppingBag },
      { path: '/dashboard/arqueo', name: 'Arqueo de Caja', icon: DollarSign },
    ],
    Tesoreria: [
      { path: '/dashboard', name: 'Resumen Diario', icon: BarChart },
      { path: '/dashboard/validations', name: 'Validar Arqueos', icon: Settings },
    ]
  };

  const links = menuItems[role] || [];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:block shrink-0 h-full overflow-y-auto shadow-sm">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-benmarket-50 text-benmarket-700 border-l-4 border-benmarket-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-benmarket-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}