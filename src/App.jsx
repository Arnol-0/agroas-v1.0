import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Leaf, Menu } from 'lucide-react';
import agroasLogo from './assets/Logo Agroas.png';
import reactLogo from './assets/react.svg';
import SidebarDrawer from './components/SidebarDrawer';
import MainMenu from './components/MainMenu';
import AdminPanel from './components/AdminPanel';
import WorkerPanel from './components/WorkerPanel';
import CartDrawer from './components/CartDrawer';
import { db } from './services/db';

export default function SemillasEcommerce() {
  const [cart, setCart] = useState([]);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showWorker, setShowWorker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);

  // Load initial data
  useEffect(() => {
    setProductos(db.getProducts());
    setUsuarios(db.getUsers());
    setVentas(db.getSales());
  }, []);

  // Persist changes
  useEffect(() => {
    if (productos.length) db.saveProducts(productos);
  }, [productos]);

  useEffect(() => {
    if (usuarios.length) db.saveUsers(usuarios);
  }, [usuarios]);

  useEffect(() => {
    if (ventas.length) db.saveSales(ventas);
  }, [ventas]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p);
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, cantidad: quantity } : p));
  };

  const handleCheckout = () => {
    if (!currentUser) return;
    const newSale = {
      id: Date.now(),
      cliente: currentUser.nombre || currentUser.email,
      fecha: new Date().toISOString(),
      total: cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
      items: cart,
      estado: 'asignada', // Initial state for admin visibility
      trabajadorId: null // To be assigned
    };
    setVentas(prev => [newSale, ...prev]);
    setCart([]);
    setShowCart(false);
    alert('Compra realizada con éxito. Un administrador procesará su pedido.');
  };

  const handleLogin = (credentials) => {
    // If credentials is an object from Sidebar (user object)
    if (credentials.role) {
      setCurrentUser(credentials);
      handleRoleRedirect(credentials);
    } else {
      // Direct login logic if needed
      const user = db.login(credentials.email, credentials.password);
      if (user) {
        setCurrentUser(user);
        handleRoleRedirect(user);
      } else {
        alert('Credenciales inválidas');
      }
    }
  };

  const handleRoleRedirect = (user) => {
    if (user.role === 'admin') {
      setShowAdmin(true);
      setShowMainMenu(false);
      setShowWorker(false);
    } else if (user.role === 'trabajador') {
      setShowWorker(true);
      setShowMainMenu(false);
      setShowAdmin(false);
    } else {
      setShowMainMenu(false);
      setShowAdmin(false);
      setShowWorker(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setShowAdmin(false); setShowWorker(false); setShowMainMenu(false); }}>
              <img
                src={agroasLogo}
                alt="AGROAS"
                onError={(e) => { e.currentTarget.src = reactLogo; }}
                className="h-10 md:h-12 w-auto"
              />
              <span className="sr-only">AGROAS</span>
            </div>

            {!showAdmin && !showWorker && (
              <div className="flex-1 max-w-xl mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar semillas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="hidden md:flex items-center gap-2 text-sm text-green-800">
                  <User size={18} />
                  <span>{currentUser.nombre || currentUser.email}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded capitalize">{currentUser.role}</span>
                </div>
              )}
              <button onClick={() => setShowSidebar(true)} className="p-2 rounded-full hover:bg-gray-100 transition" aria-label="Abrir menú">
                <Menu className="text-[#0EA84D]" size={24} />
              </button>
              <button onClick={() => setShowCart(true)} className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <ShoppingCart className="text-[#0EA84D]" size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((a, c) => a + c.cantidad, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {!showAdmin && !showWorker && (
        <div className="relative text-white py-16 overflow-hidden">
          {/* Capa de imagen de fondo (colocar grass.jpg en /public) */}
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: 'url(/grass.jpg)' }}
            />
          </div>

          {/* Capa de gradiente (más clara) para hacer juego con el logo y mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#34D399]/45 via-[#22C55E]/35 to-[#16A34A]/45" />

          {/* Decoración de hojas para darle estilo flor/planta */}
          <div className="pointer-events-none absolute inset-0">
            <Leaf size={72} className="absolute -top-3 left-6 text-white/20" />
            <Leaf size={64} className="absolute top-10 right-1/3 text-white/10 -rotate-6" />
            <Leaf size={96} className="absolute top-6 left-1/3 text-white/18 rotate-[18deg] blur-[0.2px]" />
            <Leaf size={76} className="absolute bottom-10 left-12 text-white/20 -rotate-[14deg]" />
            <Leaf size={110} className="absolute -bottom-8 right-1/4 text-white/14 rotate-[28deg] blur-[0.6px]" />
            <Leaf size={68} className="absolute top-1/2 right-6 text-white/22 rotate-[6deg]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <img
              src={agroasLogo}
              alt="Semillas Agroas"
              onError={(e) => { e.currentTarget.src = reactLogo; }}
              className="mx-auto h-16 md:h-24 drop-shadow-lg"
            />
          </div>
        </div>
      )}

      {showAdmin ? (
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-12">
          <AdminPanel
            productos={productos}
            setProductos={setProductos}
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            ventas={ventas}
            setVentas={setVentas}
            trabajadores={usuarios.filter(u => u.role === 'trabajador')}
          />
        </main>
      ) : showWorker ? (
        <main className="max-w-7xl mx-auto px-4 py-12">
          <WorkerPanel ventas={ventas} setVentas={setVentas} currentUser={currentUser} />
        </main>
      ) : showMainMenu ? (
        <main className="max-w-7xl mx-auto px-4 py-12">
          <MainMenu productos={productos} />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Nuestros Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-xl shadow-lg ring-1 ring-green-100 overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                  <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-700">
                      ${producto.precio.toLocaleString('es-CL')}
                    </span>
                    <button
                      onClick={() => addToCart(producto)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p>&copy; 2024 SemillasVerde. Todos los derechos reservados.</p>
        </div>
      </footer>

      {showSidebar && (
        <SidebarDrawer
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          onShowMainMenu={() => { setShowAdmin(false); setShowMainMenu(true); }}
          onShowProducts={() => { setShowAdmin(false); setShowMainMenu(false); }}
          onLogin={handleLogin}
          currentUser={currentUser}
          onLogout={() => { setCurrentUser(null); setShowAdmin(false); setShowWorker(false); setShowSidebar(false); }}
          onOpenAdmin={() => { setShowAdmin(true); setShowMainMenu(false); }}
          onOpenWorker={() => { setShowWorker(true); setShowAdmin(false); setShowMainMenu(false); }}
          usuarios={usuarios}
          db={db}
        />
      )}

      {showCart && (
        <CartDrawer
          open={showCart}
          onClose={() => setShowCart(false)}
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
