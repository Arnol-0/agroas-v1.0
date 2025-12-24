import { useState } from 'react';
import { X } from 'lucide-react';

export default function WorkerPanel({ ventas, setVentas, currentUser }) {
  const [filterEstado, setFilterEstado] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const mySales = ventas.filter(v => v.trabajadorId === currentUser?.id);
  const filteredSales = mySales.filter(v => (filterEstado ? v.estado === filterEstado : true));
  const myEstadoCounts = {
    todos: mySales.length,
    asignada: mySales.filter(v => v.estado === 'asignada').length,
    'en atencion': mySales.filter(v => v.estado === 'en atencion').length,
    finalizada: mySales.filter(v => v.estado === 'finalizada').length,
  };
  const estadoClasses = { asignada: 'ring-sky-400', 'en atencion': 'ring-amber-400', finalizada: 'ring-emerald-500' };
  const estadoBadge = {
    asignada: 'bg-sky-50 text-sky-700 ring-sky-300',
    'en atencion': 'bg-amber-50 text-amber-700 ring-amber-300',
    finalizada: 'bg-emerald-50 text-emerald-700 ring-emerald-300'
  };
  const setEstado = (saleId, estado) => {
    setVentas(ventas.map(v => (v.id === saleId ? { ...v, estado } : v)));
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

  return (
    <section className="space-y-8">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Mis ventas asignadas</h2>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <button onClick={()=>setFilterEstado('')} className={`px-3 py-1 rounded-full ring-1 ${filterEstado===''?'bg-green-600 text-white ring-green-600':'bg-green-50 text-green-700 ring-green-300 hover:bg-green-100'}`}>Todos ({myEstadoCounts.todos})</button>
          <button onClick={()=>setFilterEstado('asignada')} className={`px-3 py-1 rounded-full ring-1 ${filterEstado==='asignada'?'bg-sky-600 text-white ring-sky-600':'bg-sky-50 text-sky-700 ring-sky-300 hover:bg-sky-100'}`}>Asignada ({myEstadoCounts.asignada})</button>
          <button onClick={()=>setFilterEstado('en atencion')} className={`px-3 py-1 rounded-full ring-1 ${filterEstado==='en atencion'?'bg-amber-500 text-white ring-amber-500':'bg-amber-50 text-amber-700 ring-amber-300 hover:bg-amber-100'}`}>En Atención ({myEstadoCounts['en atencion']})</button>
          <button onClick={()=>setFilterEstado('finalizada')} className={`px-3 py-1 rounded-full ring-1 ${filterEstado==='finalizada'?'bg-emerald-600 text-white ring-emerald-600':'bg-emerald-50 text-emerald-700 ring-emerald-300 hover:bg-emerald-100'}`}>Finalizada ({myEstadoCounts.finalizada})</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSales.map(v => (
          <div key={v.id} className={`bg-white rounded-xl shadow ring-2 ${v.estado ? estadoClasses[v.estado] : 'ring-green-100'} p-4 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Boleta Nº {v.id}</div>
              <div className="text-sm text-gray-600">{new Date(v.fecha).toLocaleDateString('es-CL')}</div>
            </div>
            <div className="text-lg font-bold text-gray-800">{v.cliente}</div>
            <div className="flex items-center justify-between">
              <span className="text-green-700 font-bold">${v.total.toLocaleString('es-CL')}</span>
              <span className="text-sm text-gray-600">Items: {v.items.reduce((s,it)=>s+it.cantidad,0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ring-1 ${v.estado ? estadoBadge[v.estado] : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>{v.estado || 'Sin estado'}</span>
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
      {filteredSales.length === 0 && (
        <div className="bg-white rounded-xl shadow ring-1 ring-green-100 p-8 text-center text-gray-700">
          No tienes ventas asignadas en este estado.
        </div>
      )}

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
                <ul className="list-disc pl-5 space-y-1">
                  {selectedSale.items.map((it,idx)=>(
                    <li key={idx}>{it.nombre} x{it.cantidad} - ${it.precio.toLocaleString('es-CL')}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 font-bold">Total: ${selectedSale.total.toLocaleString('es-CL')}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={()=>downloadPDF(selectedSale)} className="px-3 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50">Descargar PDF</button>
              <button onClick={()=>setSelectedSale(null)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
