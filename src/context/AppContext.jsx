import { createContext, useState, useContext } from 'react';
import { products as mockProducts, sales as mockSales, cashReconciliations as mockArqueos, users as mockUsers } from '../data/mock';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [sales, setSales] = useState(mockSales);
  const [arqueos, setArqueos] = useState(mockArqueos);
  const [users, setUsers] = useState(mockUsers);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Funciones de Productos
  const addProduct = (product) => setProducts([...products, { ...product, id: Date.now() }]);
  const updateProduct = (id, updated) => setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p));
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

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