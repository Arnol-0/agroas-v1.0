export const NOW_TS = Date.now();
export const CURRENT_MONTH = new Date(NOW_TS).getMonth();
export const LAST_SIX_MONTHS = Array.from({ length: 6 }).map((_, i) => ((CURRENT_MONTH - 5 + i + 12) % 12));
export const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export const initialVentas = [
  { id: 1001, cliente: 'Cliente A', fecha: new Date(NOW_TS).toISOString(), total: 4300, items: [ { nombre: 'Semillas de Lechuga', precio: 1800, cantidad: 1 }, { nombre: 'Semillas de Zanahoria', precio: 2000, cantidad: 1 } ] },
  { id: 1002, cliente: 'Cliente B', fecha: new Date(NOW_TS - 86400000).toISOString(), total: 2500, items: [ { nombre: 'Semillas de Tomate Cherry', precio: 2500, cantidad: 1 } ] },
  { id: 1003, cliente: 'Cliente C', fecha: new Date(NOW_TS - 2*86400000).toISOString(), total: 4800, items: [ { nombre: 'Semillas de Pimentón', precio: 2800, cantidad: 1 }, { nombre: 'Semillas de Albahaca', precio: 2200, cantidad: 1 } ] },
  // Mes pasado (approx 30-35 días)
  { id: 901, cliente: 'Cliente Pasado 1', fecha: new Date(NOW_TS - 32*86400000).toISOString(), total: 15000, items: [], estado: 'finalizada', trabajadorId: 'trab1' },
  { id: 902, cliente: 'Cliente Pasado 2', fecha: new Date(NOW_TS - 35*86400000).toISOString(), total: 22500, items: [], estado: 'finalizada', trabajadorId: 'trab1' },
  { id: 903, cliente: 'Cliente Pasado 3', fecha: new Date(NOW_TS - 40*86400000).toISOString(), total: 8000, items: [], estado: 'asignada', trabajadorId: 'trab1' },
  // 2 Meses atrás
  { id: 801, cliente: 'Cliente Antiguo 1', fecha: new Date(NOW_TS - 65*86400000).toISOString(), total: 35000, items: [], estado: 'finalizada' },
  { id: 802, cliente: 'Cliente Antiguo 2', fecha: new Date(NOW_TS - 70*86400000).toISOString(), total: 12000, items: [], estado: 'finalizada' },
  // 3 Meses atrás
  { id: 701, cliente: 'Cliente Antiguo 3', fecha: new Date(NOW_TS - 95*86400000).toISOString(), total: 45000, items: [], estado: 'finalizada' }
];
