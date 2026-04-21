import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mock';
import ProductCard from '../components/ProductCard';
import tiendaImg from '../images/tienda.jpg';
import { 
  Search, ArrowRight, Sparkles, ShoppingBag, 
  Coffee, Carrot, Cookie, Milk, SearchX, 
  Mail, LayoutGrid, Leaf
} from 'lucide-react';

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'Todos': return <LayoutGrid size={20} />;
    case 'Comida': return <Carrot size={20} />;
    case 'Bebidas': return <Coffee size={20} />;
    case 'Snacks': return <Cookie size={20} />;
    case 'Lácteos': return <Milk size={20} />;
    case 'Limpieza': return <Sparkles size={20} />;
    case 'Despensa': return <ShoppingBag size={20} />;
    case 'Frescos': return <Leaf size={20} />;
    default: return <ShoppingBag size={20} />;
  }
};

export default function Home() {
  const { products, globalSearchQuery, setGlobalSearchQuery } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('Productos Recomendados');
  const gridRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Cuando cambia la búsqueda global, scrolleamos hacia abajo suavemente
  useEffect(() => {
    if (globalSearchQuery?.length === 1 && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [globalSearchQuery]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Productos Recomendados' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(globalSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-surface">
      {/* Hero Section */}
      <section className="mb-12 sm:mb-20 pt-0">
        <div className="relative h-[380px] sm:h-[500px] md:h-[600px] w-full mx-auto overflow-hidden bg-surface-container-lowest shadow-sm">
          <img 
            src={tiendaImg}
            alt="Tienda Benmarket" 
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-tertiary/90 backdrop-blur-sm text-on-tertiary text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full w-fit mb-4 sm:mb-6 shadow-sm border border-tertiary-container/30">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
              </span>
              ABIERTO LAS 24HS
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-3 sm:mb-6 tracking-tight font-headline">
              Tu market más completo <br />
              <span className="text-primary-container">a un clic de distancia.</span>
            </h1>
            <p className="text-surface-variant font-medium text-base sm:text-xl mb-6 sm:mb-8 max-w-lg leading-relaxed">
              Productos locales y de primera calidad, seleccionados cuidadosamente para tu día a día.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Scroller */}
      {!globalSearchQuery && (
        <section className="mb-10 sm:mb-16 max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between px-4 sm:px-6 mb-4 sm:mb-6">
            <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-on-surface">Nuestros Productos</h2>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto hide-scrollbar gap-2.5 sm:gap-4 px-4 sm:px-6 pb-6 pt-2 snap-x scroll-smooth cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              const ele = scrollContainerRef.current;
              if (!ele) return;
              ele.isDown = true;
              ele.startX = e.pageX - ele.offsetLeft;
              ele.scrollLeftStart = ele.scrollLeft;
            }}
            onMouseLeave={() => {
              if (scrollContainerRef.current) scrollContainerRef.current.isDown = false;
            }}
            onMouseUp={() => {
              if (scrollContainerRef.current) scrollContainerRef.current.isDown = false;
            }}
            onMouseMove={(e) => {
              const ele = scrollContainerRef.current;
              if (!ele || !ele.isDown) return;
              e.preventDefault();
              const x = e.pageX - ele.offsetLeft;
              const walk = (x - ele.startX) * 2; // Multiplicador para velocidad de arrastre
              ele.scrollLeft = ele.scrollLeftStart - walk;
            }}
          >
            {['Productos Recomendados', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start flex-none px-5 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 transition-all duration-300 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 -translate-y-1'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/20 hover:shadow-md'
                }`}
              >
                <div className={selectedCategory === cat ? 'text-on-primary' : 'text-primary'}>
                  {cat === 'Productos Recomendados' ? <LayoutGrid size={20} /> : getCategoryIcon(cat)}
                </div>
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section ref={gridRef} className="px-4 sm:px-6 mb-20 sm:mb-24 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-10 gap-3 sm:gap-4">
          <div>
            {globalSearchQuery && (
              <>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Sparkles className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="font-headline text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
                    Resultados de búsqueda
                  </h2>
                </div>
                <p className="text-on-surface-variant font-medium text-sm sm:text-lg">
                  Mostrando resultados para "{globalSearchQuery}"
                </p>
              </>
            )}
          </div>
          {!globalSearchQuery && (
            <button className="text-primary font-bold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 group bg-primary/5 hover:bg-primary/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors w-full sm:w-auto justify-center">
              Ver Todo 
              <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 sm:py-24 flex flex-col items-center justify-center text-outline bg-surface-container-lowest rounded-2xl sm:rounded-3xl border border-outline-variant/20 shadow-sm px-4 text-center">
            <div className="bg-surface-container-high p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
              <SearchX className="w-8 h-8 sm:w-12 sm:h-12 text-outline-variant" strokeWidth={1.5} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-on-surface mb-2 font-headline">No encontramos lo que buscas</p>
            <p className="text-on-surface-variant text-sm sm:text-base font-medium max-w-md">
              Intenta con otro término de búsqueda o selecciona otra categoría para ver más productos.
            </p>
            <button 
              onClick={() => { setGlobalSearchQuery(''); setSelectedCategory('Productos Recomendados'); }}
              className="mt-6 sm:mt-8 bg-primary text-on-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 text-sm sm:text-base"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="px-4 sm:px-6 mb-12 sm:mb-20 max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary to-secondary rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-12 flex flex-col items-center text-center overflow-hidden shadow-lg sm:shadow-xl shadow-primary/20">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" className="absolute top-[-30%] left-[-10%] w-[70%] h-[70%]"><circle cx="200" cy="200" r="200" fill="white"/></svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%]"><circle cx="200" cy="200" r="200" fill="white"/></svg>
          </div>
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="bg-white/20 backdrop-blur-md p-2.5 sm:p-3 rounded-xl mb-3 sm:mb-5">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="font-headline text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-4 text-white">Únete al Colectivo</h2>
            <p className="text-white/90 font-medium text-xs sm:text-base max-w-lg mb-5 sm:mb-8 leading-relaxed px-2">
              Suscríbete para recibir acceso anticipado, historias de diseño y ofertas exclusivas para miembros. ¡10% de descuento en tu primera compra!
            </p>
            <form className="w-full max-w-md flex flex-col sm:flex-row gap-2 sm:gap-2 p-0 sm:p-1.5 sm:bg-white/10 sm:backdrop-blur-md sm:rounded-2xl" onSubmit={(e) => e.preventDefault()}>
              <input 
                className="flex-1 bg-white border-none px-4 py-3 sm:py-3.5 rounded-xl focus:ring-4 focus:ring-white/30 text-on-surface text-sm font-medium placeholder:text-outline shadow-sm" 
                placeholder="Tu correo electrónico..." 
                type="email" 
                required 
              />
              <button 
                type="submit" 
                className="bg-on-primary text-primary px-6 py-3 sm:py-3.5 rounded-xl font-bold active:scale-95 transition-all shadow-sm hover:shadow-md hover:bg-surface-container-lowest text-sm"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}