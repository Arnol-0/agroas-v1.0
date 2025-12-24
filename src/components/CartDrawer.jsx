import { X, Trash2 } from 'lucide-react';

export default function CartDrawer({ open, onClose, cart, removeFromCart, updateQuantity, onCheckout, currentUser }) {
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Tu Carrito</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Tu carrito está vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.imagen} alt={item.nombre} className="w-16 h-16 rounded object-cover ring-1 ring-gray-200" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 line-clamp-1">{item.nombre}</h4>
                  <p className="text-green-700 font-bold">${item.precio.toLocaleString('es-CL')}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.cantidad - 1))} className="px-2 py-0.5 hover:bg-gray-100">-</button>
                      <span className="px-2 text-sm">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="px-2 py-0.5 hover:bg-gray-100">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Total</span>
            <span className="text-2xl font-bold text-green-700">${total.toLocaleString('es-CL')}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {currentUser ? 'Confirmar Compra' : 'Inicia sesión para comprar'}
          </button>
        </div>
      </div>
    </>
  );
}
