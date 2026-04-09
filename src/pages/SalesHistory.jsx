import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FileText } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function SalesHistory() {
  const { sales } = useAppContext();
  const { user } = useAuth();

  // Mostrar solo ventas presenciales del cajero actual (o todas si es admin, pero esta vista es para cajero)
  const mySales = sales.filter(s => s.cashierId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Mis Ventas Recientes</h1>
      
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">ID Venta</th>
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Artículos</th>
                <th className="p-4 font-semibold text-right">Total</th>
                <th className="p-4 font-semibold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mySales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No hay ventas registradas aún.</td>
                </tr>
              ) : (
                mySales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-900">#{sale.id}</td>
                    <td className="p-4 text-slate-600">{new Date(sale.date).toLocaleString()}</td>
                    <td className="p-4 text-slate-600">
                      {sale.items?.length || 0} prod. diferentes
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">{formatCurrency(sale.total)}</td>
                    <td className="p-4 text-center">
                      <button className="text-benmarket-600 hover:text-benmarket-800 p-2 rounded-lg hover:bg-benmarket-50 inline-flex items-center gap-1" title="Ver Ticket">
                        <FileText className="w-4 h-4" /> <span className="sr-only">Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}