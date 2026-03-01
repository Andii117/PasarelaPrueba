import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "../../types";

interface MultiProductState {
  products: (Product & { stock: number })[];
  loading: boolean;
  error: string | null;
}

const initialState: MultiProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("product/fetchAll", async () => {
  const response = await axios.get(
    "http://localhost:3000/products/getAllProducts",
  );
  return response.data.map((p: any) => ({
    ...p,
    imageUrl: p.imageURL,
  }));
});

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error al cargar productos";
      });
  },
});

export const { decrementStock } = productSlice.actions;
export default productSlice.reducer;
