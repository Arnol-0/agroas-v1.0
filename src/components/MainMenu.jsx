import { useState } from 'react';
import { MapPin, BadgePercent, Headset } from 'lucide-react';
import Carousel from './Carousel';
import CategoryModal from './CategoryModal';

export default function MainMenu({ productos }) {
  const images = productos.map(p => p.imagen);
  const captions = productos.map(p => p.nombre);
  const [selectedCat, setSelectedCat] = useState(null);

  return (
    <section className="space-y-10">
      <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido a Semillas Agroas</h3>
        <p className="text-gray-600">Fundada en el año 1985, AGROAS es una empresa dedicada a la multiplicación y comercialización de semillas para el mercado Nacional e Internacional</p>
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
            title="Ubicación SemillasVerde"
            src="https://www.google.com/maps?q=Santiago%20de%20Chile&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-64 md:h-80 lg:h-96"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6 flex items-start gap-4">
          <BadgePercent className="text-green-700" size={28} />
          <div>
            <h5 className="text-lg font-bold text-gray-800">Descuentos</h5>
            <p className="text-gray-600">Promociones activas en seleccionadas. Ver ofertas.</p>
            <a href="#" className="inline-block mt-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Ver ofertas</a>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6 flex items-start gap-4">
          <Headset className="text-green-700" size={28} />
          <div>
            <h5 className="text-lg font-bold text-gray-800">Cotiza con un agente</h5>
            <p className="text-gray-600">Recibe asesoría y precios a medida para tu proyecto.</p>
            <a href="mailto:ventas@semillasverde.cl" className="inline-block mt-2 px-3 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50">Contactar</a>
          </div>
        </div>
      </div>
    </section>
  );
}
