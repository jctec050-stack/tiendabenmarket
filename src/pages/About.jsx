import React from 'react';
import { Store, Heart, ShieldCheck, Leaf } from 'lucide-react';
import tiendaImg from '../images/tienda.jpg';

export default function About() {
  return (
    <div className="w-full bg-surface min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mb-20 md:mb-0">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="font-headline text-4xl sm:text-5xl font-black text-on-surface mb-4 tracking-tight">
            Nuestra <span className="text-primary">Historia</span>
          </h1>
          <p className="text-on-surface-variant text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Desde nuestros inicios, nos hemos comprometido a llevar los mejores productos frescos y locales directamente a tu mesa.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden mb-12 sm:mb-16 shadow-lg border border-outline-variant/20">
          <img 
            src={tiendaImg} 
            alt="Nuestra Tienda" 
            className="w-full h-[250px] sm:h-[400px] object-cover object-top" 
          />
        </div>

        <div className="space-y-12 sm:space-y-16">
          <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/20 shadow-sm">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-6">¿Cómo empezamos?</h2>
            <div className="space-y-4">
              <p className="text-on-surface-variant leading-relaxed text-base sm:text-lg">
                Benmarket nació con la visión de transformar la manera en que haces tus compras diarias. Todo comenzó en un pequeño local en Ciudad del Este, donde nos dimos cuenta de que la comunidad necesitaba un lugar de confianza que ofreciera calidad, rapidez y una atención cálida.
              </p>
              <p className="text-on-surface-variant leading-relaxed text-base sm:text-lg">
                Con el paso de los años, hemos crecido gracias a la lealtad de nuestros clientes, expandiendo nuestro catálogo pero manteniendo siempre la esencia de un mercado local: conocer a quienes nos compran y ofrecerles solo lo mejor.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-6 text-center sm:text-left">Nuestros Valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-on-surface">Pasión por la Calidad</h3>
                <p className="text-on-surface-variant text-sm sm:text-base font-medium">Seleccionamos cuidadosamente cada producto para asegurar que lleves a casa frescura y sabor incomparables.</p>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-on-surface">Apoyo Local</h3>
                <p className="text-on-surface-variant text-sm sm:text-base font-medium">Trabajamos de la mano con productores de la región para fomentar el crecimiento económico de nuestra comunidad.</p>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-on-surface">Confianza</h3>
                <p className="text-on-surface-variant text-sm sm:text-base font-medium">Tu tranquilidad es lo primero. Garantizamos la calidad de tus compras y la seguridad en cada transacción.</p>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-on-surface">Siempre Cerca</h3>
                <p className="text-on-surface-variant text-sm sm:text-base font-medium">Abiertos las 24 horas y con un sistema de envíos rápidos para que nunca te falte nada.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
