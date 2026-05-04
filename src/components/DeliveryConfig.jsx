import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { Bike, Check, Loader2 } from 'lucide-react';

export default function DeliveryConfig() {
  const { deliveryPrice, updateDeliveryPrice } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleSave = async () => {
    const parsed = parseInt(inputValue.replace(/\D/g, ''), 10);
    if (isNaN(parsed) || parsed < 0) return;

    setStatus('loading');
    try {
      await updateDeliveryPrice(parsed);
      setInputValue('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div className="card p-5 mb-6 border-l-4 border-l-benmarket-500">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Ícono + Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-3 bg-benmarket-50 rounded-xl text-benmarket-600 shrink-0">
            <Bike className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-700">Precio de Delivery — Ciudad del Este</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Precio actual:{' '}
              <span className="font-black text-benmarket-600 text-sm">
                {formatCurrency(deliveryPrice)}
              </span>
            </p>
          </div>
        </div>

        {/* Input + Botón */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="500"
            className="input-field w-40 text-right font-mono"
            placeholder="Ej: 15000"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === 'loading'}
          />
          <button
            onClick={handleSave}
            disabled={status === 'loading' || inputValue === ''}
            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              status === 'success'
                ? 'bg-green-500 text-white'
                : status === 'error'
                ? 'bg-red-500 text-white'
                : 'btn-primary'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === 'success' ? (
              <><Check className="w-4 h-4" /> Guardado</>
            ) : status === 'error' ? (
              'Error'
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600 mt-2">
          Hubo un error al guardar. Verificá la conexión con Supabase.
        </p>
      )}
    </div>
  );
}
