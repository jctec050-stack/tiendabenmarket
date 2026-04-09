import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
      <Navbar />
      <main className="flex-grow w-full pt-20 pb-24">
        <Outlet />
      </main>
      <footer className="bg-black py-8 sm:py-12 px-6 md:px-12 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <p className="font-headline font-extrabold tracking-tighter text-2xl sm:text-3xl mb-3 sm:mb-4 text-primary">Benmarket</p>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-medium">Tu mercado local de confianza. Productos frescos y de calidad a la vuelta de la esquina.</p>
          </div>
          <div>
            <p className="font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest text-white">Categorías</p>
            <ul className="space-y-2 sm:space-y-3 text-sm text-white/70 font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">Frescos</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Bebidas</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Despensa</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Ofertas de hoy</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest text-white">Nosotros</p>
            <ul className="space-y-2 sm:space-y-3 text-sm text-white/70 font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">Nuestra Historia</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Productores Locales</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Sustentabilidad</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Trabaja con nosotros</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest text-white">Ayuda</p>
            <ul className="space-y-2 sm:space-y-3 text-sm text-white/70 font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">Envíos y Entregas</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Devoluciones</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Preguntas Frecuentes</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/50 font-bold">
          <span className="mb-4 md:mb-0">© {new Date().getFullYear()} Benmarket - Tu Mercado de Confianza</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  );
}