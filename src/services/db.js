import { initialVentas } from '../constants';

const DB_KEYS = {
  USERS: 'semillas_users_v2',
  PRODUCTS: 'semillas_products_v2',
  SALES: 'semillas_sales_v2'
};

const initialProducts = [
  {
    id: 1,
    nombre: "Semillas de Tomate Cherry",
    precio: 2500,
    imagen: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
    descripcion: "Ideales para huertos caseros"
  },
  {
    id: 2,
    nombre: "Semillas de Lechuga",
    precio: 1800,
    imagen: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
    descripcion: "Variedad criolla resistente"
  },
  {
    id: 3,
    nombre: "Semillas de Albahaca",
    precio: 2200,
    imagen: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
    descripcion: "Aromática y fácil de cultivar"
  },
  {
    id: 4,
    nombre: "Semillas de Zanahoria",
    precio: 2000,
    imagen: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop",
    descripcion: "Cosecha en 90 días"
  },
  // Cilantro removed as requested
  {
    id: 6,
    nombre: "Semillas de Pimentón",
    precio: 2800,
    imagen: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop",
    descripcion: "Dulce y sabroso"
  }
];

const initialUsers = [
  { id: 'admin1', nombre: 'Admin', email: 'admin@agroas.cl', password: 'admin', role: 'admin' },
  { id: 'trab1', nombre: 'Juan Trabajador', email: 'juan@agroas.cl', password: '123', role: 'trabajador', contratoTipo: 'Indefinido', inicio: '2023-01-01' },
  { id: 'client1', nombre: 'Cliente Ejemplo', email: 'cliente@gmail.com', password: '123', role: 'cliente' }
];

// Helper to get data
const get = (key, defaultVal) => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultVal;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultVal;
  }
};

// Helper to set data
const set = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const db = {
  getProducts: () => get(DB_KEYS.PRODUCTS, initialProducts),
  saveProducts: (products) => set(DB_KEYS.PRODUCTS, products),
  
  getUsers: () => get(DB_KEYS.USERS, initialUsers),
  saveUsers: (users) => set(DB_KEYS.USERS, users),
  
  getSales: () => get(DB_KEYS.SALES, initialVentas),
  saveSales: (sales) => set(DB_KEYS.SALES, sales),
  
  // Authentication
  login: (email, password) => {
    const users = get(DB_KEYS.USERS, initialUsers);
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  },
  
  register: (user) => {
    const users = get(DB_KEYS.USERS, initialUsers);
    if (users.find(u => u.email === user.email)) {
      throw new Error('El correo ya está registrado');
    }
    const newUser = { ...user, id: Date.now().toString() };
    users.push(newUser);
    set(DB_KEYS.USERS, users);
    return newUser;
  }
};
