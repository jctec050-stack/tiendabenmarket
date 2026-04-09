import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const { user } = useAuth();

  if (!user || user.role === 'Cliente') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}