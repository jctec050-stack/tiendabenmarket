import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { addSale } = useAppContext();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular retraso de red
    setTimeout(() => {
      const sale = {
        total,
        date: new Date().toISOString(),
        items: cart.map(item => ({ productId: item.id, qty: item.quantity })),
        type: 'Online'
      };
      addSale(sale);
      clearCart();
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="bg-green-100 text-green-600 p-6 rounded-full inline-block mb-6 shadow-sm">
          <CheckCircle className="w-20 h-20" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">¡Pago Exitoso!</h2>
        <p className="text-lg text-slate-600 mb-8">Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación en breve.</p>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 text-left">
          <p className="text-sm text-slate-500 mb-2">Número de orden: <span className="font-mono text-slate-900 font-bold">#{Math.floor(Math.random() * 100000)}</span></p>
          <p className="text-sm text-slate-500">Fecha: <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span></p>
        </div>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
          <ArrowLeft className="w-5 h-5" /> Volver a la tienda
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b">
        <button onClick={() => navigate('/cart')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Finalizar Compra</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-benmarket-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Datos de envío
          </h2>
          <form id="checkout-form" onSubmit={handleSimulatePayment} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input required type="text" className="input-field" defaultValue="Juan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                <input required type="text" className="input-field" defaultValue="Pérez" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input required type="text" className="input-field" defaultValue="Calle Falsa 123" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
                <input required type="text" className="input-field" defaultValue="Asunción" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código Postal</label>
                <input required type="text" className="input-field" defaultValue="1000" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-6 mt-10 flex items-center gap-2">
              <span className="bg-benmarket-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Método de pago
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <input type="radio" id="card" name="payment" defaultChecked className="w-4 h-4 text-benmarket-600 focus:ring-benmarket-500" />
                <label htmlFor="card" className="font-medium text-slate-700">Tarjeta de Crédito / Débito (Simulado)</label>
              </div>
              <div className="space-y-4 pl-7">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Número de tarjeta</label>
                  <input type="text" className="input-field" placeholder="**** **** **** ****" defaultValue="4000 1234 5678 9010" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Vencimiento</label>
                    <input type="text" className="input-field" placeholder="MM/YY" defaultValue="12/25" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">CVC</label>
                    <input type="text" className="input-field" placeholder="***" defaultValue="123" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div>
          <div className="card p-6 sticky top-24 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Resumen de tu pedido</h3>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">{item.quantity}</span>
                    <span className="font-medium text-slate-700 line-clamp-1 max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex flex-col pt-4 mt-2 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-black text-benmarket-600 text-right mt-1">{formatCurrency(total)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Confirmar y Pagar'
              )}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Pago seguro encriptado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}