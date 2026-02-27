import { createSlice } from "@reduxjs/toolkit";
import type { ProductState } from "../../types";

const initialState: ProductState = {
  product: {
    id: "PROD-001",
    name: "Producto de prueba",
    description: "Esta es una descripción del producto de prueba.",
    price: 50000,
    imageUrl: "https://via.placeholder.com/390x220",
  },
  stock: 5,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    decrementStock: (state) => {
      state.stock = Math.max(0, state.stock - 1);
    },
  },
});

export const { decrementStock } = productSlice.actions;
export default productSlice.reducer;
