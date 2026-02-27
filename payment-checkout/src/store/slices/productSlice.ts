import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductState } from "../../types";
import { apiService } from "../../services/apiService";

export const fetchProduct = createAsyncThunk("product/fetch", async () => {
  return await apiService.getProduct();
});

const initialState: ProductState = {
  product: null,
  stock: 0,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.stock = action.payload.stock;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar producto";
      });
  },
});

export const { decrementStock } = productSlice.actions;
export default productSlice.reducer;
