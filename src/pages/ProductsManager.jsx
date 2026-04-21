import { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mock';
import { Edit, Trash2, Plus, X, Upload, Download, FileJson } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ name: '', price: '', category: categories[0], stock: '', image: '' });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: categories[0], stock: '', image: 'https://placehold.co/200x200/ef4444/white?text=Nuevo' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, formattedData);
    } else {
      addProduct(formattedData);
    }
    setIsModalOpen(false);
  };

  // Función para exportar productos a JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `benmarket_productos_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Función para importar productos desde JSON
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          // En un caso real, aquí deberíamos validar la estructura de cada objeto
          // y llamar a un método del contexto como `importProducts(importedData)`
          alert(`Simulación: Se importarían ${importedData.length} productos correctamente.`);
        } else {
          alert('El archivo no tiene el formato de array esperado.');
        }
      } catch (error) {
        alert('Error al leer el archivo JSON. Asegúrate de que el formato sea correcto.');
      }
    };
    reader.readAsText(file);
    // Limpiar el input para permitir importar el mismo archivo de nuevo si es necesario
    e.target.value = '';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Catálogo de Productos</h1>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImportData} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-300 shadow-sm"
            title="Importar productos desde JSON"
          >
            <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Importar DB</span><span className="sm:hidden">Importar</span>
          </button>

          <button 
            onClick={handleExportData} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-300 shadow-sm"
            title="Exportar productos a JSON"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar DB</span><span className="sm:hidden">Exportar</span>
          </button>

          <button onClick={() => handleOpenModal()} className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 ml-auto md:ml-2">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold text-right">Precio</th>
                <th className="p-4 font-semibold text-right">Stock</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    <span className="font-medium text-slate-900">{product.name}</span>
                  </td>
                  <td className="p-4 text-slate-600">{product.category}</td>
                  <td className="p-4 text-right font-medium text-slate-900">{formatCurrency(product.price)}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock === 0 ? 'bg-red-100 text-red-700' :
                      product.stock <= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio (PYG)</label>
                  <input required type="number" step="1" min="0" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input required type="number" min="0" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Imagen</label>
                <input required type="text" className="input-field" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}