import { X } from 'lucide-react';

export default function LoginDrawer({ open, onClose }) {
  return (
    <>
      <div className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full sm:w-[380px] bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-800">Iniciar Sesión</h2>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
          </div>
          <input type="email" placeholder="Correo electrónico" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-green-500" />
          <input type="password" placeholder="Contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-green-500" />
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Entrar</button>
        </div>
      </div>
    </>
  );
}
