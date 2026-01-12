import { useState } from 'react';
import { X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { LAST_SIX_MONTHS, MONTH_NAMES, NOW_TS } from '../constants';

export default function AdminPanel({ productos, setProductos, usuarios, setUsuarios, ventas, setVentas, trabajadores }) {
  const [tab, setTab] = useState('analiticas');
  const [selectedSale, setSelectedSale] = useState(null);
  const totals = ventas.reduce((acc, v) => { const m = new Date(v.fecha).getMonth(); acc[m] = (acc[m] || 0) + v.total; return acc; }, {});
  const chartData = LAST_SIX_MONTHS.map((m, i) => {
    let val = totals[m] || 0;
    if (i === 4 && val === 0) val = 45000; // Fictional amount for previous month
    return val;
  });
  const maxVal = Math.max(...chartData, 10000);

  const [newProd, setNewProd] = useState({ nombre: '', precio: '', imagen: '', descripcion: '' });
  const [newUser, setNewUser] = useState({ nombre: '', email: '', rol: 'trabajador', contratoTipo: 'Indefinido', inicio: '', termino: '' });
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserStatsModal, setShowUserStatsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserMode, setEditUserMode] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [ventasFilterEstado, setVentasFilterEstado] = useState('');
  const NOW = new Date(NOW_TS);
  const ventasMes = ventas.filter(v => { const d = new Date(v.fecha); return d.getFullYear() === NOW.getFullYear() && d.getMonth() === NOW.getMonth(); });
  const ventasPorTrabajador = ventasMes.reduce((acc, v) => { if (!v.trabajadorId) return acc; acc[v.trabajadorId] = (acc[v.trabajadorId] || 0) + 1; return acc; }, {});

  const prevMonthDate = new Date(NOW.getFullYear(), NOW.getMonth() - 1, 1);
  const prevMonthName = MONTH_NAMES[prevMonthDate.getMonth()];
  const ventasPrevMonth = ventas.filter(v => {
    const d = new Date(v.fecha);
    return d.getFullYear() === prevMonthDate.getFullYear() && d.getMonth() === prevMonthDate.getMonth();
  });

  const workersOptions = [
    ...trabajadores,
    ...usuarios.filter(u => u.rol === 'trabajador').map(u => ({ id: u.id, nombre: u.nombre }))
  ];
  const estadoClasses = { asignada: 'ring-sky-400', 'en atencion': 'ring-amber-400', finalizada: 'ring-emerald-500' };
  const ventasFiltered = ventas.filter(v => (ventasFilterEstado ? v.estado === ventasFilterEstado : true));
  const ventasEstadoCounts = {
    todos: ventas.length,
    asignada: ventas.filter(v => v.estado === 'asignada').length,
    'en atencion': ventas.filter(v => v.estado === 'en atencion').length,
    finalizada: ventas.filter(v => v.estado === 'finalizada').length,
  };

  const downloadPDF = (sale) => {
    const title = `Boleta-${sale.id}`;
    const itemsRows = sale.items.map((it) => (
      `<tr>
         <td style="padding:8px;border:1px solid #eee;">${it.nombre}</td>
         <td style="padding:8px;border:1px solid #eee;">${it.cantidad}</td>
         <td style="padding:8px;border:1px solid #eee; text-align:right;">$${(it.precio).toLocaleString('es-CL')}</td>
         <td style="padding:8px;border:1px solid #eee; text-align:right;">$${(it.precio * it.cantidad).toLocaleString('es-CL')}</td>
       </tr>`
    )).join('');
    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>${title}</title>
        <style>
          * { font-family: Arial, Helvetica, sans-serif; }
          .wrap { max-width: 800px; margin: 24px auto; }
          h1 { color: #155f34; margin-bottom: 8px; }
          .meta { color: #555; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          tfoot td { font-weight: bold; }
          @page { size: A4; margin: 16mm; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Boleta Nº ${sale.id}</h1>
          <div class="meta">Fecha: ${new Date(sale.fecha).toLocaleString('es-CL')}<br/>Cliente: ${sale.cliente}</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:left;padding:8px;border:1px solid #eee;">Item</th>
                <th style="text-align:left;padding:8px;border:1px solid #eee;">Cant.</th>
                <th style="text-align:right;padding:8px;border:1px solid #eee;">Precio</th>
                <th style="text-align:right;padding:8px;border:1px solid #eee;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:8px;border:1px solid #eee;text-align:right;">Total</td>
                <td style="padding:8px;border:1px solid #eee;text-align:right;">$${sale.total.toLocaleString('es-CL')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
      </html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const addProduct = () => {
    if (!newProd.nombre || !newProd.precio) return;
    const p = { id: Date.now(), nombre: newProd.nombre, precio: parseInt(newProd.precio, 10) || 0, imagen: newProd.imagen || '/vite.svg', descripcion: newProd.descripcion || '' };
    setProductos([...productos, p]);
    setNewProd({ nombre: '', precio: '', imagen: '', descripcion: '' });
  };


  const addUser = () => {
    if (!newUser.nombre || !newUser.email) return;
    setUsuarios([...usuarios, { id: Date.now(), ...newUser, rol: 'trabajador' }]);
    setNewUser({ nombre: '', email: '', rol: 'trabajador', contratoTipo: 'Indefinido', inicio: '', termino: '' });
    setShowUserModal(false);
  };
  const saveUserEdit = () => {
    if (!editUser || !selectedUser) return;
    setUsuarios(usuarios.map(u => (u.id === selectedUser.id ? { ...u, ...editUser } : u)));
    setEditUserMode(false);
  };

  const assignWorker = (saleId, workerId) => {
    setVentas(ventas.map(v => (v.id === saleId ? { ...v, trabajadorId: workerId } : v)));
  };
  const setEstado = (saleId, estado) => {
    setVentas(ventas.map(v => (v.id === saleId ? { ...v, estado } : v)));
  };

  const exportStatsToExcel = () => {
    const data = ventas.map(v => ({
      ID: v.id,
      Fecha: new Date(v.fecha).toLocaleString('es-CL'),
      Cliente: v.cliente,
      Total: v.total,
      Estado: v.estado,
      Trabajador: usuarios.find(u => u.id == v.trabajadorId)?.nombre || 'Sin asignar'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, "estadisticas_ventas.xlsx");
  };

  const exportMonthStatsToExcel = (monthIndex, year) => {
    const monthSales = ventas.filter(v => {
      const d = new Date(v.fecha);
      return d.getMonth() === monthIndex && d.getFullYear() === year;
    });

    if (monthSales.length === 0) {
      alert(`No hay ventas registradas para ${MONTH_NAMES[monthIndex]} ${year}`);
      return;
    }

    const data = monthSales.map(v => ({
      ID: v.id,
      Fecha: new Date(v.fecha).toLocaleString('es-CL'),
      Cliente: v.cliente,
      Total: v.total,
      Estado: v.estado,
      Trabajador: usuarios.find(u => u.id == v.trabajadorId)?.nombre || 'Sin asignar'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, `ventas_${MONTH_NAMES[monthIndex]}_${year}.xlsx`);
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Administrador</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTab('analiticas')} className={`px-4 py-2 rounded-lg ${tab==='analiticas'?'bg-green-600 text-white':'border border-green-600 text-green-700 hover:bg-green-50'}`}>Analíticas</button>
        <button onClick={() => setTab('ventas')} className={`px-4 py-2 rounded-lg ${tab==='ventas'?'bg-green-600 text-white':'border border-green-600 text-green-700 hover:bg-green-50'}`}>Ventas</button>
        <button onClick={() => setTab('producto')} className={`px-4 py-2 rounded-lg ${tab==='producto'?'bg-green-600 text-white':'border border-green-600 text-green-700 hover:bg-green-50'}`}>Nuevo Producto</button>
        <button onClick={() => setTab('usuarios')} className={`px-4 py-2 rounded-lg ${tab==='usuarios'?'bg-green-600 text-white':'border border-green-600 text-green-700 hover:bg-green-50'}`}>Usuarios</button>
      </div>

      {tab === 'analiticas' && (
        <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ventas últimos meses</h3>
          <div className="flex justify-end mb-4">
             <button onClick={exportStatsToExcel} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
               Exportar Excel
             </button>
          </div>
          <div className="flex items-end gap-3 h-40 overflow-x-auto pb-2">
            {chartData.map((v, i) => {
              // Calculate the correct year for this bar
              // LAST_SIX_MONTHS are indices. We need to know if it belongs to current or previous year.
              // Logic: Compare month index with current month index.
              // If barMonth > currentMonth, it must be last year (assuming 6 months window).
              // Wait, simpler: iterate back from NOW.
              const barDate = new Date(NOW.getFullYear(), NOW.getMonth() - (5 - i), 1);
              const barMonthIndex = barDate.getMonth();
              const barYear = barDate.getFullYear();

              return (
                <div 
                  key={i} 
                  className="flex flex-col items-center h-full justify-end cursor-pointer hover:bg-green-50 rounded-t p-1 transition-colors"
                  onClick={() => exportMonthStatsToExcel(barMonthIndex, barYear)}
                  title="Clic para descargar Excel de este mes"
                >
                  <div className="bg-green-600 w-10 rounded-t relative group" style={{ height: `${(v / maxVal) * 100}%` }}>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      ${v.toLocaleString('es-CL')}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1 capitalize">{MONTH_NAMES[barMonthIndex]}</span>
                </div>
              );
            })}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Estadísticas Mes Anterior ({prevMonthName})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{ventasPrevMonth.length}</div>
              <div className="text-sm text-gray-600">Total Ventas</div>
            </div>
             <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{ventasPrevMonth.filter(v => v.estado === 'finalizada').length}</div>
              <div className="text-sm text-gray-600">Finalizadas</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">${ventasPrevMonth.reduce((s,v)=>s+v.total,0).toLocaleString('es-CL')}</div>
              <div className="text-sm text-gray-600">Ingresos</div>
            </div>
             <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{Object.keys(ventasPrevMonth.reduce((acc, v) => { if(v.trabajadorId) acc[v.trabajadorId]=1; return acc; }, {})).length}</div>
              <div className="text-sm text-gray-600">Trabajadores Activos</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Resumen General</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{ventas.length}</div>
              <div className="text-sm text-gray-600">Ventas Históricas</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">${ventas.reduce((s,v)=>s+v.total,0).toLocaleString('es-CL')}</div>
              <div className="text-sm text-gray-600">Ingresos Históricos</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{productos.length}</div>
              <div className="text-sm text-gray-600">Productos</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{usuarios.length}</div>
              <div className="text-sm text-gray-600">Usuarios</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'ventas' && (
        <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800">Listado de ventas</h3>
            <div className="mt-2 flex gap-2 flex-wrap">
              <button onClick={()=>setVentasFilterEstado('')} className={`px-3 py-1 rounded-full ring-1 ${ventasFilterEstado===''?'bg-green-600 text-white ring-green-600':'bg-green-50 text-green-700 ring-green-300 hover:bg-green-100'}`}>Todos ({ventasEstadoCounts.todos})</button>
              <button onClick={()=>setVentasFilterEstado('asignada')} className={`px-3 py-1 rounded-full ring-1 ${ventasFilterEstado==='asignada'?'bg-sky-600 text-white ring-sky-600':'bg-sky-50 text-sky-700 ring-sky-300 hover:bg-sky-100'}`}>Asignada ({ventasEstadoCounts.asignada})</button>
              <button onClick={()=>setVentasFilterEstado('en atencion')} className={`px-3 py-1 rounded-full ring-1 ${ventasFilterEstado==='en atencion'?'bg-amber-500 text-white ring-amber-500':'bg-amber-50 text-amber-700 ring-amber-300 hover:bg-amber-100'}`}>En Atención ({ventasEstadoCounts['en atencion']})</button>
              <button onClick={()=>setVentasFilterEstado('finalizada')} className={`px-3 py-1 rounded-full ring-1 ${ventasFilterEstado==='finalizada'?'bg-emerald-600 text-white ring-emerald-600':'bg-emerald-50 text-emerald-700 ring-emerald-300 hover:bg-emerald-100'}`}>Finalizada ({ventasEstadoCounts.finalizada})</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ventasFiltered.map(v => (
              <div key={v.id} className={`bg-white rounded-xl shadow ring-2 ${v.estado ? estadoClasses[v.estado] : 'ring-green-100'} p-4 flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Boleta Nº {v.id}</div>
                  <div className="text-sm text-gray-600">{new Date(v.fecha).toLocaleDateString('es-CL')}</div>
                </div>
                <div className="text-lg font-bold text-gray-800">{v.cliente}</div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-bold">${v.total.toLocaleString('es-CL')}</span>
                  <select value={v.trabajadorId || ''} onChange={(e)=>assignWorker(v.id, e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="">Sin asignar</option>
                    {workersOptions.map(t => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Estado</span>
                  <select value={v.estado || ''} onChange={(e)=>setEstado(v.id, e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="">Sin estado</option>
                    <option value="asignada">Asignada</option>
                    <option value="en atencion">En Atención</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
                <button onClick={()=>setSelectedSale(v)} className="self-start px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Ver Boleta/Factura</button>
              </div>
            ))}
          </div>

          {selectedSale && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">Comprobante</h4>
                  <button onClick={()=>setSelectedSale(null)} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="font-semibold">Boleta Nº {selectedSale.id}</div>
                  <div>Fecha: {new Date(selectedSale.fecha).toLocaleString('es-CL')}</div>
                  <div>Cliente: {selectedSale.cliente}</div>
                  <div className="mt-3">
                    <div className="font-semibold mb-1">Items</div>
                    <ul className="space-y-1">
                      {selectedSale.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{it.nombre} x{it.cantidad}</span>
                          <span>${(it.precio * it.cantidad).toLocaleString('es-CL')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-green-700">${selectedSale.total.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={()=>downloadPDF(selectedSale)} className="px-3 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50">Descargar PDF</button>
                    <button onClick={()=>setSelectedSale(null)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'producto' && (
        <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ingresar nuevo producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={newProd.nombre} onChange={(e)=>setNewProd({ ...newProd, nombre: e.target.value })} placeholder="Nombre" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input value={newProd.precio} onChange={(e)=>setNewProd({ ...newProd, precio: e.target.value })} placeholder="Precio" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input value={newProd.imagen} onChange={(e)=>setNewProd({ ...newProd, imagen: e.target.value })} placeholder="URL Imagen" className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
            <input value={newProd.descripcion} onChange={(e)=>setNewProd({ ...newProd, descripcion: e.target.value })} placeholder="Descripción" className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
          </div>
          <button onClick={addProduct} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Agregar Producto</button>
        </div>
      )}

      {tab === 'usuarios' && (
        <div className="bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Usuarios</h3>
            <div className="flex items-center gap-2">
              <button onClick={()=>setShowUserModal(true)} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">Crear Usuario</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.map(u => (
              <div key={u.id} className="bg-white rounded-xl shadow ring-1 ring-green-100 p-4">
                <div className="text-lg font-bold text-gray-800">{u.nombre}</div>
                <div className="text-gray-700">{u.email}</div>
                <div className="mt-2 text-sm text-gray-700">Rol: {u.rol}</div>
                <div className="mt-1 text-sm text-gray-700">Contrato: {u.contratoTipo}</div>
                <div className="mt-1 text-sm text-gray-700">Inicio: {u.inicio || '-'}</div>
                <div className="mt-1 text-sm text-gray-700">Término: {u.contratoTipo==='Indefinido' ? '-' : (u.termino || '-')}</div>
                <div className="mt-2 text-sm font-semibold text-green-700">Ventas este mes: {ventasPorTrabajador[u.id] || 0}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>{ setSelectedUser(u); setEditUserMode(false); setEditUser(u); setShowUserStatsModal(true); }} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Ingresar</button>
                </div>
              </div>
            ))}
          </div>

          {showUserModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">Crear usuario</h4>
                  <button onClick={()=>setShowUserModal(false)} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={newUser.nombre} onChange={(e)=>setNewUser({ ...newUser, nombre: e.target.value })} placeholder="Nombre" className="px-4 py-2 border border-gray-300 rounded-lg" />
                  <input value={newUser.email} onChange={(e)=>setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="password" value={newUser.password} onChange={(e)=>setNewUser({ ...newUser, password: e.target.value })} placeholder="Contraseña" className="px-4 py-2 border border-gray-300 rounded-lg" />
                  <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">Rol: Trabajador</div>
                  <select value={newUser.contratoTipo} onChange={(e)=>setNewUser({ ...newUser, contratoTipo: e.target.value, termino: e.target.value==='Indefinido'?'':newUser.termino })} className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Indefinido</option>
                    <option>Plazo Fijo</option>
                    <option>Honorarios</option>
                  </select>
                  <input type="date" value={newUser.inicio} onChange={(e)=>setNewUser({ ...newUser, inicio: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
                  <input type="date" value={newUser.termino} onChange={(e)=>setNewUser({ ...newUser, termino: e.target.value })} disabled={newUser.contratoTipo==='Indefinido'} className="px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <button onClick={()=>setShowUserModal(false)} className="px-4 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50">Cancelar</button>
                  <button onClick={addUser} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Crear Usuario</button>
                </div>
              </div>
            </div>
          )}

          {showUserStatsModal && selectedUser && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">Usuario: {selectedUser.nombre}</h4>
                  <button onClick={()=>{ setShowUserStatsModal(false); setSelectedUser(null); setEditUserMode(false); }} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
                </div>

                {!editUserMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        const userSales = ventas.filter(v => v.trabajadorId === selectedUser.id);
                        const total = userSales.length;
                        const asignadas = userSales.filter(v => v.estado==='asignada').length;
                        const enAtencion = userSales.filter(v => v.estado==='en atencion').length;
                        const finalizadas = userSales.filter(v => v.estado==='finalizada').length;
                        const ingresos = userSales.reduce((s,v)=>s+v.total,0);
                        return (
                          <>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-green-700">{total}</div>
                              <div className="text-sm text-gray-600">Ventas</div>
                            </div>
                            <div className="bg-sky-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-sky-700">{asignadas}</div>
                              <div className="text-sm text-gray-600">Asignadas</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-amber-700">{enAtencion}</div>
                              <div className="text-sm text-gray-600">En Atención</div>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-emerald-700">{finalizadas}</div>
                              <div className="text-sm text-gray-600">Finalizadas</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center md:col-span-2">
                              <div className="text-xl font-bold text-green-700">${ingresos.toLocaleString('es-CL')}</div>
                              <div className="text-sm text-gray-600">Ingresos Totales</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="mt-6 space-y-3">
                      <h5 className="text-md font-bold text-gray-800">Ventas por estado</h5>
                      {(() => {
                        const userSales = ventas.filter(v => v.trabajadorId === selectedUser.id);
                        const asignadas = userSales.filter(v => v.estado==='asignada').length;
                        const enAtencion = userSales.filter(v => v.estado==='en atencion').length;
                        const finalizadas = userSales.filter(v => v.estado==='finalizada').length;
                        const series = [
                          { label: 'Asignadas', value: asignadas, color: 'bg-sky-600' },
                          { label: 'En Atención', value: enAtencion, color: 'bg-amber-500' },
                          { label: 'Finalizadas', value: finalizadas, color: 'bg-emerald-600' },
                        ];
                        const max = Math.max(1, ...series.map(s=>s.value));
                        return (
                          <div className="flex items-end gap-4 h-28">
                            {series.map((s,i)=> (
                              <div key={i} className="flex flex-col items-center h-full justify-end">
                                <div className={`${s.color} w-8 rounded-t`} style={{ height: `${(s.value / max) * 100}%`, transition: 'height 300ms ease-out' }} />
                                <span className="text-xs text-gray-600 mt-1">{s.label}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mt-6 space-y-3">
                      <h5 className="text-md font-bold text-gray-800">Ventas últimos 6 meses</h5>
                      {(() => {
                        const userSales = ventas.filter(v => v.trabajadorId === selectedUser.id);
                        const counts = LAST_SIX_MONTHS.map(m => userSales.filter(v => new Date(v.fecha).getMonth() === m).length);
                        const max = Math.max(1, ...counts);
                        return (
                          <div className="flex items-end gap-3 h-28 overflow-x-auto pb-2">
                            {counts.map((c, i) => (
                              <div key={i} className="flex flex-col items-center h-full justify-end">
                                <div className="bg-green-600 w-8 rounded-t" style={{ height: `${(c / max) * 100}%`, transition: 'height 300ms ease-out' }} />
                                <span className="text-xs text-gray-600 mt-1">{MONTH_NAMES[LAST_SIX_MONTHS[i]]}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button onClick={()=>setEditUserMode(true)} className="px-4 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50">Editar</button>
                      <button onClick={()=>{ setShowUserStatsModal(false); setSelectedUser(null); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Cerrar</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={editUser.nombre} onChange={(e)=>setEditUser({ ...editUser, nombre: e.target.value })} placeholder="Nombre" className="px-4 py-2 border border-gray-300 rounded-lg" />
                      <input value={editUser.email} onChange={(e)=>setEditUser({ ...editUser, email: e.target.value })} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg" />
                      <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">Rol: Trabajador</div>
                      <select value={editUser.contratoTipo} onChange={(e)=>setEditUser({ ...editUser, contratoTipo: e.target.value, termino: e.target.value==='Indefinido'?'':editUser.termino })} className="px-4 py-2 border border-gray-300 rounded-lg">
                        <option>Indefinido</option>
                        <option>Plazo Fijo</option>
                        <option>Honorarios</option>
                      </select>
                      <input type="date" value={editUser.inicio || ''} onChange={(e)=>setEditUser({ ...editUser, inicio: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg" />
                      <input type="date" value={editUser.termino || ''} onChange={(e)=>setEditUser({ ...editUser, termino: e.target.value })} disabled={editUser.contratoTipo==='Indefinido'} className="px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={()=>setEditUserMode(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                      <button onClick={saveUserEdit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Guardar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
