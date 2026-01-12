import { useState } from 'react';
import { Leaf, MapPin } from 'lucide-react';
import Carousel from './Carousel';
import CategoryModal from './CategoryModal';
import SalesCarousel from './SalesCarousel';

export default function MainMenu({ productos }) {
  const images = productos.map(p => p.imagen);
  const captions = productos.map(p => p.nombre);
  const [selectedCat, setSelectedCat] = useState(null);

  return (
    <section className="space-y-10">
      <div className="rounded-xl bg-gray-100/80 shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="px-6 py-10 md:py-12">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white ring-1 ring-gray-200 flex items-center justify-center">
              <Leaf className="text-[#0EA84D]" size={22} />
            </div>
            <h3 className="text-[13px] tracking-[0.22em] font-semibold text-[#0EA84D]">AGROAS</h3>
            <div className="w-14 h-[2px] bg-[#0EA84D]/70 rounded-full" />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-gray-600">
            <p className="leading-relaxed text-sm md:text-[15px]">
              La empresa Comercial Agropecuaria Agroas Limitada fue fundada en 1985 en Temuco, Chile, y se ha consolidado como una empresa líder en la producción y comercialización de semillas forrajeras y agrícolas para mercados nacionales e internacionales. Destaca por su profesionalismo, enfoque en la investigación y altos estándares de calidad, respaldados por una sólida infraestructura y alianzas con universidades y centros de investigación. Gracias a su trayectoria y seriedad, ha construido relaciones comerciales de largo plazo y una posición de liderazgo y confianza dentro de la industria.
            </p>
            <p className="leading-relaxed text-sm md:text-[15px]">
              Nuestro objetivo es ofrecer a nuestros clientes la más amplia gama de especies y variedades de semillas híbridas de la más alta calidad y para ello contamos con acuerdos de colaboración e investigación.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Semillas que trabajamos</h4>
        <Carousel images={images} captions={captions} />
      </div>

      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Tipos de semillas</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Hortalizas', desc: 'Tomate, lechuga, zanahoria', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=120&h=120&fit=crop' },
            { name: 'Aromáticas', desc: 'Albahaca, cilantro, perejil', img: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=120&h=120&fit=crop' },
            { name: 'Raíces', desc: 'Zanahoria, betarraga, rábano', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&h=120&fit=crop' },
            { name: 'Leguminosas', desc: 'Porotos, arvejas', img: 'https://images.unsplash.com/photo-1506803682981-6e1a44e8d0e6?w=120&h=120&fit=crop' }
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCat(cat)}
              className="text-left bg-white rounded-xl shadow-md ring-1 ring-green-100 p-5 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={cat.img}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
                  className="w-12 h-12 rounded object-cover ring-1 ring-green-100"
                />
                <div>
                  <h5 className="text-lg font-bold text-gray-800">{cat.name}</h5>
                  <p className="text-gray-600">{cat.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {selectedCat && <CategoryModal cat={selectedCat} onClose={() => setSelectedCat(null)} />}
      </div>

      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><MapPin className="text-green-700" /> Ubicación</h4>
        <div className="rounded-xl overflow-hidden shadow-md ring-1 ring-green-100">
          <iframe
            title="Ubicación Agroas Ltda"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.151790514144!2d-72.72221449999999!3d-38.760222399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96152b33f5e954b7%3A0xb8b7b65ca5af6f40!2sAgroas%20Ltda!5e0!3m2!1ses-419!2scl!4v1768232081375!5m2!1ses-419!2scl"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-64 md:h-80 lg:h-96"
          />
        </div>
    
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <SalesCarousel
            team={[
              { role: 'Vendedor Zona Norte', name: "Enrique D’etigny", email: 'Edetigny@agroas.cl', phone: '964945980' },
              { role: 'Gerente de Ventas', name: 'Rodrigo Gotschlich', email: 'Rgotschill@agroas.cl', phone: '9932240546' },
              { role: 'Vendedor Zona Sur', name: 'Cristian Sanhueza', email: 'csanhueza@agroas.cl', phone: '993240517' }
            ]}
          />
        </div>
      </div>
    </section>
  );
}
