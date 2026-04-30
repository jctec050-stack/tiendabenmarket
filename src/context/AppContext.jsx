import { createContext, useState, useContext, useEffect } from 'react';
import { sales as mockSales, cashReconciliations as mockArqueos, users as mockUsers } from '../data/mock';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(mockSales);
  const [arqueos, setArqueos] = useState(mockArqueos);
  const [users, setUsers] = useState(mockUsers);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const [categories, setCategories] = useState([]);
  const [rawCategories, setRawCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Products with category names
      const { data: prodData, error: prodError } = await supabase.from('productos').select('*, categorias(nombre)');
      if (prodError) {
        console.error('Error fetching products:', prodError);
      } else {
        const mappedProducts = (prodData || []).map(p => ({
          id: p.codigo_producto,
          name: p.nombre,
          price: p.precio,
          stock: p.cantidad_disponible,
          image: p.foto_url || 'https://placehold.co/400x400/f8fafc/94a3b8?text=Sin+Imagen',
          category: p.categorias?.nombre || p.codigo_categoria || 'Sin Categoría'
        }));
        setProducts(mappedProducts);
      }

      // Fetch Categories
      const { data: catData, error: catError } = await supabase.from('categorias').select('*');
      if (catError) {
        console.error('Error fetching categories:', catError);
      } else {
        setRawCategories(catData || []);
        const mappedCategories = (catData || []).map(c => c.nombre);
        setCategories(mappedCategories);
      }
    };
    fetchData();
  }, []);

  // Funciones de Productos
  const addProduct = async (product) => {
    const newId = Date.now().toString();
    const cat = rawCategories.find(c => c.nombre === product.category);
    const dbProduct = {
      codigo_producto: newId,
      nombre: product.name,
      precio: product.price,
      cantidad_disponible: product.stock,
      foto_url: product.image,
      codigo_categoria: cat ? cat.codigo_categoria : null
    };
    
    const { data, error } = await supabase.from('productos').insert([dbProduct]).select();
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    } else if (data) {
      setProducts([...products, { ...product, id: newId }]);
    }
  };

  const updateProduct = async (id, updated) => {
    const dbProduct = {};
    if (updated.name !== undefined) dbProduct.nombre = updated.name;
    if (updated.price !== undefined) dbProduct.precio = updated.price;
    if (updated.stock !== undefined) dbProduct.cantidad_disponible = updated.stock;
    if (updated.image !== undefined) dbProduct.foto_url = updated.image;
    if (updated.category !== undefined) {
      const cat = rawCategories.find(c => c.nombre === updated.category);
      dbProduct.codigo_categoria = cat ? cat.codigo_categoria : null;
    }

    const { data, error } = await supabase.from('productos').update(dbProduct).eq('codigo_producto', id).select();
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    } else if (data) {
      setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p));
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('productos').delete().eq('codigo_producto', id);
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Funciones de Ventas
  const addSale = (sale) => setSales([...sales, { ...sale, id: Date.now() }]);

  // Funciones de Arqueos
  const addArqueo = (arqueo) => setArqueos([...arqueos, { ...arqueo, id: Date.now() }]);
  const updateArqueoStatus = (id, status, notes) => setArqueos(arqueos.map(a => a.id === id ? { ...a, status, notes } : a));

  // Funciones de Usuarios
  const addUser = (user) => setUsers([...users, { ...user, id: Date.now() }]);
  const updateUser = (id, updated) => setUsers(users.map(u => u.id === id ? { ...u, ...updated } : u));
  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      categories,
      sales, addSale,
      arqueos, addArqueo, updateArqueoStatus,
      users, addUser, updateUser, deleteUser,
      globalSearchQuery, setGlobalSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);