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
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [themeColor, setThemeColor] = useState(null);

  const [categories, setCategories] = useState([]);
  const [rawCategories, setRawCategories] = useState([]);
  const [banners, setBanners] = useState([
    { id: 1, name: 'Banner Principal Web', image: '/src/images/tienda.jpg', active: true },
    { id: 2, name: 'Promo Fin de Semana', image: '/src/images/banner.png', active: true },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Theme Colors
      const { data: themeData, error: themeError } = await supabase
        .from('configuracion')
        .select('valor')
        .eq('clave', 'theme_colors')
        .single();
      
      if (!themeError && themeData && themeData.valor) {
        try {
          const colors = JSON.parse(themeData.valor);
          setThemeColor(colors);
          applyThemeToDocument(colors);
        } catch(e) {
          console.error("Error parsing theme colors", e);
        }
      }

      // Fetch delivery price from configuracion table
      const { data: configData, error: configError } = await supabase
        .from('configuracion')
        .select('valor')
        .eq('clave', 'delivery_price')
        .single();
      if (!configError && configData) {
        setDeliveryPrice(Number(configData.valor) || 0);
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

      // Fetch Products with category names (Paginated to bypass 1000 limit)
      let allProducts = [];
      let keepFetching = true;
      let start = 0;
      const limit = 1000;

      while (keepFetching) {
        const { data: prodData, error: prodError } = await supabase
          .from('productos')
          .select('*, categorias(nombre)')
          .range(start, start + limit - 1);

        if (prodError) {
          console.error('Error fetching products:', prodError);
          break;
        }

        if (prodData) {
          allProducts = [...allProducts, ...prodData];
          if (prodData.length < limit) {
            keepFetching = false;
          } else {
            start += limit;
          }
        } else {
          keepFetching = false;
        }
      }

      const mappedProducts = allProducts.map(p => ({
        id: p.codigo_producto,
        name: p.nombre,
        price: p.precio,
        stock: p.cantidad_disponible,
        image: p.foto_url || 'https://placehold.co/400x400/f8fafc/94a3b8?text=Sin+Imagen',
        category: p.categorias?.nombre || p.codigo_categoria || 'Sin Categoría'
      }));
      setProducts(mappedProducts);
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

  // Funciones de Delivery
  const updateDeliveryPrice = async (newPrice) => {
    const price = Number(newPrice) || 0;
    const { error } = await supabase
      .from('configuracion')
      .upsert({ clave: 'delivery_price', valor: String(price), updated_at: new Date().toISOString() }, { onConflict: 'clave' });
    if (error) {
      console.error('Error saving delivery price:', error);
      throw error;
    }
    setDeliveryPrice(price);
  };

  // Funciones de Arqueos
  const addArqueo = (arqueo) => setArqueos([...arqueos, { ...arqueo, id: Date.now() }]);
  const updateArqueoStatus = (id, status, notes) => setArqueos(arqueos.map(a => a.id === id ? { ...a, status, notes } : a));

  // Funciones de Usuarios
  const addUser = (user) => setUsers([...users, { ...user, id: Date.now() }]);
  const updateUser = (id, updated) => setUsers(users.map(u => u.id === id ? { ...u, ...updated } : u));
  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  // Funciones de Theme
  const applyThemeToDocument = (colors) => {
    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
    if (colors.primaryContainer) root.style.setProperty('--color-primary-container', colors.primaryContainer);
    if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
  };

  const updateThemeColor = async (newColors) => {
    const { error } = await supabase
      .from('configuracion')
      .upsert({ clave: 'theme_colors', valor: JSON.stringify(newColors), updated_at: new Date().toISOString() }, { onConflict: 'clave' });
    if (error) {
      console.error('Error saving theme colors:', error);
      throw error;
    }
    setThemeColor(newColors);
    applyThemeToDocument(newColors);
  };

  // Funciones de Banners
  const addBanner = (banner) => setBanners([...banners, { ...banner, id: Date.now() }]);
  const updateBannerStatus = (id) => setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
  const deleteBanner = (id) => setBanners(banners.filter(b => b.id !== id));

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      categories,
      sales, addSale,
      arqueos, addArqueo, updateArqueoStatus,
      users, addUser, updateUser, deleteUser,
      themeColor, updateThemeColor,
      banners, addBanner, updateBannerStatus, deleteBanner,
      globalSearchQuery, setGlobalSearchQuery,
      deliveryPrice, updateDeliveryPrice,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);