import React from 'react';
import DeliveryConfig from '../components/DeliveryConfig';

export default function DeliveryManager() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Precio Delivery</h1>
        <p className="text-slate-500 text-sm mt-1">Configura el costo de envío para los pedidos web.</p>
      </div>
      
      <div className="max-w-3xl">
        <DeliveryConfig />
      </div>
    </div>
  );
}
