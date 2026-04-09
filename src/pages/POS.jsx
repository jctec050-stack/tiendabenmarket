import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function POS() {
  const { products, addSale } = useAppContext();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const sale = {
      cashierId: user.id,
      cashierName: user.name,
      total,
      date: new Date().toISOString(),
      items: cart.map(i => ({ productId: i.id, qty: i.quantity, price: i.price, name: i.name })),
      type: 'Presencial'
    };
    addSale(sale);
    setCart([]);
    alert('Venta registrada exitosamente');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <input 
            type="text" 
            placeholder="Buscar producto por nombre..." 
            className="input-field"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <button 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="flex flex-col items-center p-3 border border-slate-200 rounded-lg hover:border-benmarket-500 hover:shadow-md transition-all bg-slate-50"
              >
                <div className="w-16 h-16 bg-white rounded-md mb-2 overflow-hidden shadow-sm">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-slate-800 text-center line-clamp-2 h-10">{p.name}</span>
                <span className="text-benmarket-600 font-bold mt-1">{formatCurrency(p.price)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
        <div className="p-4 bg-slate-800 text-white rounded-t-xl flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Venta Actual</h2>
          <span className="text-sm bg-slate-700 px-2 py-1 rounded">Cajero: {user.name}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Selecciona productos para iniciar
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex-1 pr-2">
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(item.price)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"><Minus className="w-3 h-3" /></button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"><Plus className="w-3 h-3" /></button>
                  <button onClick={() => remove(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <div className="flex flex-col mb-4">
            <span className="text-lg font-medium text-slate-700">Total a cobrar:</span>
            <span className="text-3xl font-black text-benmarket-600 text-right">{formatCurrency(total)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="btn-primary w-full py-3 text-lg shadow-md"
          >
            Cobrar e Imprimir Ticket
          </button>
        </div>
      </div>
    </div>
  );
}