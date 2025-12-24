import { useState } from 'react';
import { X } from 'lucide-react';

export default function SidebarDrawer({ open, onClose, onShowMainMenu, onShowProducts, onLogin, currentUser, onLogout, onOpenAdmin, onOpenWorker, db }) {
  const [authView, setAuthView] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = () => {
    if (!loginEmail || !loginPassword) {
      setError('Complete todos los campos');
      return;
    }
    // Pass credentials to App
    onLogin({ email: loginEmail, password: loginPassword });
    // Note: App will handle success/failure logic, but here we might want to wait.
    // For simplicity, we assume App handles alerts. But ideally we check result.
    // Since onLogin in App handles alert on failure, we just clear form on success or wait.
    // However, App.jsx logic is: if login ok -> setCurrentUser -> redirects.
    // We can just close if we detect user change or we can't easily detect it here without prop change.
    // Let's just rely on App to close/redirect or show error.
    // Actually App doesn't close sidebar on login failure.
    // Let's modify: we'll call db directly here to validate, then call onLogin if success.
    
    const user = db.login(loginEmail, loginPassword);
    if (user) {
      onLogin(user);
      onClose();
      setAuthView(null);
      setLoginEmail('');
      setLoginPassword('');
      setError('');
    } else {
      setError('Credenciales inválidas');
    }
  };

  const handleRegisterSubmit = () => {
    if (!regEmail || !regPassword || !regName) {
      setError('Complete todos los campos');
      return;
    }
    try {
      const newUser = db.register({
        nombre: regName,
        email: regEmail,
        password: regPassword,
        role: 'cliente'
      });
      onLogin(newUser);
      onClose();
      setAuthView(null);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-40`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full sm:w-[300px] bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} z-50 border-l-2 border-green-600`}>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-green-800">{authView ? (authView === 'login' ? 'Iniciar Sesión' : 'Registrarse') : 'Menú'}</h2>
            {authView && (
              <button onClick={() => { setAuthView(null); setError(''); }} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
            )}
          </div>

          {!authView && (
            <div className="space-y-3">
              <button onClick={() => { onShowMainMenu(); onClose(); }} className="w-full px-4 py-2 text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition">Menú Principal</button>
              <button onClick={() => { onShowProducts(); onClose(); }} className="w-full px-4 py-2 text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition">Ver Productos</button>
              {currentUser && currentUser.role === 'admin' && (
                <button onClick={() => { onOpenAdmin(); onClose(); }} className="w-full px-4 py-2 text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition">Panel Administrador</button>
              )}
              {currentUser && currentUser.role === 'trabajador' && (
                <button onClick={() => { onOpenWorker(); onClose(); }} className="w-full px-4 py-2 text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition">Panel Trabajador</button>
              )}
              {currentUser ? (
                <button onClick={() => { onLogout(); }} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Cerrar Sesión</button>
              ) : (
                <>
                  <button onClick={() => setAuthView('login')} className="w-full px-4 py-2 text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition">Iniciar Sesión</button>
                  <button onClick={() => setAuthView('register')} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Registrarse</button>
                </>
              )}
            </div>
          )}

          {authView === 'login' && (
            <div className="pt-4 space-y-3">
              {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
              <input value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') handleLoginSubmit(); }} type="email" placeholder="Correo electrónico" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
              <input value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') handleLoginSubmit(); }} type="password" placeholder="Contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
              <button onClick={handleLoginSubmit} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Entrar</button>
            </div>
          )}

          {authView === 'register' && (
            <div className="pt-4 space-y-3">
              {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
              <input value={regName} onChange={(e)=>setRegName(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') handleRegisterSubmit(); }} type="text" placeholder="Nombre completo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
              <input value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') handleRegisterSubmit(); }} type="email" placeholder="Correo electrónico" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
              <input value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') handleRegisterSubmit(); }} type="password" placeholder="Contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
              <button onClick={handleRegisterSubmit} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Crear Cuenta</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
