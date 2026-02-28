import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types";

const initialProducts = [
  {
    id: "PROD-001",
    name: "Cámara Mirrorless Sony",
    description: "Cámara profesional 24MP con lente intercambiable y video 4K.",
    price: 3200000,
    imageUrl:
      "https://images.unsplash.com/photo-1642396948521-77c0bf2cd92d?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 5,
  },
  {
    id: "PROD-002",
    name: "Audífonos Noise Cancelling",
    description:
      "Audífonos inalámbricos con cancelación activa de ruido y 30h de batería.",
    price: 850000,
    imageUrl:
      "https://images.unsplash.com/photo-1612478120679-5b7412e15f84?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 12,
  },
  {
    id: "PROD-003",
    name: "Smartwatch Pro",
    description:
      "Reloj inteligente con GPS, monitor cardíaco y resistencia al agua.",
    price: 1200000,
    imageUrl:
      "https://images.unsplash.com/photo-1669480380743-f76990b9bc44?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 8,
  },
  {
    id: "PROD-004",
    name: "Teclado Mecánico RGB",
    description:
      "Teclado gaming mecánico con switches Cherry MX e iluminación RGB.",
    price: 450000,
    imageUrl:
      "https://images.unsplash.com/photo-1669884210251-8c0acfb4206b?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 20,
  },
  {
    id: "PROD-005",
    name: 'Monitor 4K 27"',
    description:
      "Monitor IPS 4K con 144Hz, HDR400 y tiempo de respuesta de 1ms.",
    price: 2100000,
    imageUrl:
      "https://images.unsplash.com/photo-1675151638911-b32b354c4e4a?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 3,
  },
  {
    id: "PROD-006",
    name: "Silla Gamer Ergonómica",
    description:
      "Silla con soporte lumbar ajustable, reposabrazos 4D y reclinable 180°.",
    price: 980000,
    imageUrl:
      "https://images.unsplash.com/photo-1770194993269-2521ad916c23?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 7,
  },
  {
    id: "PROD-007",
    name: "Drone con Cámara HD",
    description:
      "Drone con cámara 1080p, estabilizador de 3 ejes y 25 min de vuelo.",
    price: 1750000,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1714618849685-89cad85746b1?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 4,
  },
  {
    id: "PROD-008",
    name: 'Tablet Pro 11"',
    description:
      "Tablet con chip M2, pantalla Liquid Retina y compatible con stylus.",
    price: 4500000,
    imageUrl:
      "https://images.unsplash.com/photo-1628866971124-5d506bf12915?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 0,
  },
  {
    id: "PROD-009",
    name: "Micrófono Condensador",
    description:
      "Micrófono de estudio cardioide con soporte antivibraciones y filtro pop.",
    price: 320000,
    imageUrl:
      "https://images.unsplash.com/photo-1652071148620-99be24e731a8?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 15,
  },
  {
    id: "PROD-010",
    name: "Mousepad XL Gaming",
    description:
      "Mousepad extra grande 90x40cm con base antideslizante y bordes cosidos.",
    price: 85000,
    imageUrl:
      "https://images.unsplash.com/photo-1671068514669-8134a08ca1a2?w=400&auto=format&fit=crop&q=40&fm=webp",
    stock: 30,
  },
];

interface MultiProductState {
  products: (Product & { stock: number })[];
  loading: boolean;
  error: string | null;
}

const initialState: MultiProductState = {
  products: initialProducts,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    decrementStock: (state, action: PayloadAction<string>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        product.stock = Math.max(0, product.stock - 1);
      }
    },
  },
});

export const { decrementStock } = productSlice.actions;
export default productSlice.reducer;
