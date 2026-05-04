import { useAppContext } from '../context/AppContext';
import { FileText, Package } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import DeliveryConfig from '../components/DeliveryConfig';

export default function SalesHistory() {
  const { sales } = useAppContext();

  // Mostrar todas las ventas (pedidos web) ordenadas por fecha
  const mySales = sales.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Historial de Pedidos Web</h1>
      
      <DeliveryConfig />
      
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">ID Pedido</th>
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Artículos</th>
                <th className="p-4 font-semibold">Cliente / Email</th>
                <th className="p-4 font-semibold text-right">Total</th>
                <th className="p-4 font-semibold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mySales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No hay pedidos web registrados aún.</td>
                </tr>
              ) : (
                mySales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-900">#{sale.id}</td>
                    <td className="p-4 text-slate-600">{new Date(sale.date).toLocaleString()}</td>
                    <td className="p-4 text-slate-600">
                      {sale.items?.length || 0} prod.
                    </td>
                    <td className="p-4 text-slate-600">
                      {sale.customerName || 'Cliente Web'}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">{formatCurrency(sale.total)}</td>
                    <td className="p-4 text-center">
                      <button className="text-benmarket-600 hover:text-benmarket-800 p-2 rounded-lg hover:bg-benmarket-50 inline-flex items-center gap-1" title="Ver Detalle">
                        <Package className="w-4 h-4" /> <span className="sr-only">Ver</span>
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