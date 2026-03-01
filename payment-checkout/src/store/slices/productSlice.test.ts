import { describe, it, expect, vi } from "vitest";
import productReducer, { decrementStock, fetchProducts } from "./productSlice";

describe("productSlice", () => {
  const initialState = {
    products: [
      {
        id: "prod-1",
        name: "Producto Test",
        price: 100,
        imageUrl: "test.jpg",
        stock: 5,
        description: "Test",
      },
    ],
    loading: false,
    error: null,
  };

  it("debe disminuir el stock de un producto con decrementStock", () => {
    const action = decrementStock("prod-1");
    const state = productReducer(initialState, action);

    expect(state.products[0].stock).toBe(4);
  });

  it("no debe disminuir el stock por debajo de 0", () => {
    const zeroStockState = {
      ...initialState,
      products: [{ ...initialState.products[0], stock: 0 }],
    };

    const action = decrementStock("prod-1");
    const state = productReducer(zeroStockState, action);

    expect(state.products[0].stock).toBe(0);
  });

  // TESTS PARA ACCIONES ASÍNCRONAS (ExtraReducers)

  it("debe poner loading en true cuando fetchProducts está pendiente", () => {
    const action = { type: fetchProducts.pending.type };
    const state = productReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("debe cargar los productos y poner loading en false cuando fetchProducts se cumple", () => {
    const mockProducts = [
      { id: "1", name: "Nuevo", price: 10, imageUrl: "img.jpg", stock: 10 },
    ];

    const action = {
      type: fetchProducts.fulfilled.type,
      payload: mockProducts,
    };

    const state = productReducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.products).toEqual(mockProducts);
  });

  it("debe capturar el mensaje de error cuando fetchProducts es rechazado", () => {
    const errorMessage = "Error de red";
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: errorMessage },
    };

    const state = productReducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
