import { X } from 'lucide-react';

export default function CategoryModal({ cat, onClose }) {
  if (!cat) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-lg font-bold text-gray-800">{cat.name}</h5>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <img
            src={cat.img}
            alt={cat.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
            className="w-12 h-12 rounded object-cover ring-1 ring-green-100"
          />
          <p className="text-gray-600">{cat.desc}</p>
        </div>
        <button onClick={onClose} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Cerrar</button>
      </div>
    </div>
  );
}
