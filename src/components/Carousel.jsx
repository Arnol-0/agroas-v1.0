import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ images = [], captions = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = images.length || 1;

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 1500);
    return () => clearInterval(id);
  }, [paused, total]);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div
      className="relative bg-white rounded-xl shadow-md ring-1 ring-green-100 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0 relative">
            <img
              src={src}
              alt={captions[i] || `Slide ${i + 1}`}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
              className="w-full h-64 md:h-72 lg:h-80 object-cover"
            />
            {captions[i] && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-4 py-2">
                {captions[i]}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-green-700 rounded-full p-2 shadow"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-green-700 rounded-full p-2 shadow"
        aria-label="Siguiente"
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-green-600' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}
