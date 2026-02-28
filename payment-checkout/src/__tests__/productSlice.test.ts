import productReducer, { decrementStock } from "../store/slices/productSlice";

const initialState = {
  products: [
    {
      id: "PROD-001",
      name: "Cámara Mirrorless Sony",
      description: "Cámara profesional 24MP",
      price: 3200000,
      imageUrl: "https://example.com/camera.jpg",
      stock: 5,
    },
    {
      id: "PROD-008",
      name: 'Tablet Pro 11"',
      description: "Tablet con chip M2",
      price: 4500000,
      imageUrl: "https://example.com/tablet.jpg",
      stock: 0,
    },
    {
      id: "PROD-010",
      name: "Mousepad XL Gaming",
      description: "Mousepad extra grande",
      price: 85000,
      imageUrl: "https://example.com/mousepad.jpg",
      stock: 1,
    },
  ],
  loading: false,
  error: null,
};

describe("productSlice — estado inicial", () => {
  it("carga los productos iniciales correctamente", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    expect(state.products.length).toBe(10);
  });

  it("inicia con loading en false", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    expect(state.loading).toBe(false);
  });

  it("inicia con error en null", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    expect(state.error).toBeNull();
  });

  it("contiene el producto PROD-001", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    const product = state.products.find((p) => p.id === "PROD-001");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Cámara Mirrorless Sony");
  });

  it("contiene el producto PROD-008 con stock 0", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    const product = state.products.find((p) => p.id === "PROD-008");
    expect(product?.stock).toBe(0);
  });
});

describe("productSlice — decrementStock", () => {
  it("decrementa el stock del producto en 1", () => {
    const state = productReducer(initialState, decrementStock("PROD-001"));
    const product = state.products.find((p) => p.id === "PROD-001");
    expect(product?.stock).toBe(4);
  });

  it("no decrementa por debajo de 0", () => {
    const state = productReducer(initialState, decrementStock("PROD-008"));
    const product = state.products.find((p) => p.id === "PROD-008");
    expect(product?.stock).toBe(0);
  });

  it("decrementa stock de 1 a 0 correctamente", () => {
    const state = productReducer(initialState, decrementStock("PROD-010"));
    const product = state.products.find((p) => p.id === "PROD-010");
    expect(product?.stock).toBe(0);
  });

  it("no modifica otros productos al decrementar uno", () => {
    const state = productReducer(initialState, decrementStock("PROD-001"));
    const other = state.products.find((p) => p.id === "PROD-010");
    expect(other?.stock).toBe(1);
  });

  it("no modifica el estado si el id no existe", () => {
    const state = productReducer(initialState, decrementStock("PROD-999"));
    expect(state.products).toEqual(initialState.products);
  });

  it("decrementa múltiples veces correctamente", () => {
    let state = productReducer(initialState, decrementStock("PROD-001"));
    state = productReducer(state, decrementStock("PROD-001"));
    state = productReducer(state, decrementStock("PROD-001"));
    const product = state.products.find((p) => p.id === "PROD-001");
    expect(product?.stock).toBe(2);
  });

  it("usa Math.max para no permitir stock negativo", () => {
    let state = productReducer(initialState, decrementStock("PROD-010"));
    state = productReducer(state, decrementStock("PROD-010"));
    state = productReducer(state, decrementStock("PROD-010"));
    const product = state.products.find((p) => p.id === "PROD-010");
    expect(product?.stock).toBe(0);
  });
});
