// @ts-ignore - Jest globals
import productReducer, { decrementStock } from "./productSlice";
import type { Product } from "../../types";

interface ProductState {
  products: (Product & { stock: number })[];
  loading: boolean;
  error: string | null;
}

describe("productSlice", () => {
  let initialState: ProductState;

  beforeEach(() => {
    // Obtenemos el estado inicial del reducer
    initialState = productReducer(undefined, { type: "unknown" });
  });

  describe("initial state", () => {
    it("debería tener un estado inicial con 10 productos", () => {
      expect(initialState.products).toHaveLength(10);
    });

    it("debería tener loading en false", () => {
      expect(initialState.loading).toBe(false);
    });

    it("debería tener error en null", () => {
      expect(initialState.error).toBeNull();
    });

    it("debería contener productos con propiedades requeridas", () => {
      const product = initialState.products[0];
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("imageUrl");
      expect(product).toHaveProperty("stock");
    });

    it("debería contener productos con stock válido", () => {
      initialState.products.forEach((product) => {
        expect(product.stock).toBeGreaterThanOrEqual(0);
        expect(typeof product.stock).toBe("number");
      });
    });

    it("debería contener el producto Sony Mirrorless", () => {
      const sony = initialState.products.find((p) => p.id === "PROD-001");
      expect(sony).toBeDefined();
      expect(sony?.name).toContain("Cámara Mirrorless Sony");
      expect(sony?.price).toBe(3200000);
    });

    it("todos los productos deben tener IDs únicos", () => {
      const ids = initialState.products.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("decrementStock action", () => {
    it("debería decrementar el stock de un producto en 1", () => {
      const productId = "PROD-001";
      const initialStock = initialState.products.find(
        (p) => p.id === productId,
      )?.stock;

      const newState = productReducer(initialState, decrementStock(productId));
      const newStock = newState.products.find((p) => p.id === productId)?.stock;

      expect(newStock).toBe((initialStock || 1) - 1);
    });

    it("debería no permitir stock menor a 0", () => {
      const productId = "PROD-008"; // Tablet Pro con stock 0
      const state1 = productReducer(initialState, decrementStock(productId));
      expect(state1.products.find((p) => p.id === productId)?.stock).toBe(0);

      // Intentar decrementar de nuevo
      const state2 = productReducer(state1, decrementStock(productId));
      expect(state2.products.find((p) => p.id === productId)?.stock).toBe(0);
    });

    it("debería funcionar con múltiples decrementos", () => {
      const productId = "PROD-002"; // Audífonos con stock 12
      let state = initialState;

      // Decrementar 5 veces
      for (let i = 0; i < 5; i++) {
        state = productReducer(state, decrementStock(productId));
      }

      const product = state.products.find((p) => p.id === productId);
      expect(product?.stock).toBe(7); // 12 - 5 = 7
    });

    it("debería decrementar stock hasta 0", () => {
      const productId = "PROD-008"; // Tablet Pro con stock 0
      let state = initialState;

      // Intentar múltiples decrementos
      for (let i = 0; i < 10; i++) {
        state = productReducer(state, decrementStock(productId));
      }

      const product = state.products.find((p) => p.id === productId);
      expect(product?.stock).toBe(0);
    });

    it("debería no afectar otros productos al decrementar uno", () => {
      const productId = "PROD-003"; // Smartwatch
      const otherProductId = "PROD-004"; // Teclado

      const initialOtherStock = initialState.products.find(
        (p) => p.id === otherProductId,
      )?.stock;

      const newState = productReducer(initialState, decrementStock(productId));
      const newOtherStock = newState.products.find(
        (p) => p.id === otherProductId,
      )?.stock;

      expect(newOtherStock).toBe(initialOtherStock);
    });

    it("debería manejar IDs de productos que no existen", () => {
      const invalidProductId = "PROD-999";
      const newState = productReducer(
        initialState,
        decrementStock(invalidProductId),
      );

      // El estado no debería cambiar
      expect(newState).toEqual(initialState);
    });

    it("debería manejar múltiples acciones decrementStock en secuencia", () => {
      const productId1 = "PROD-001";
      const productId2 = "PROD-002";

      let state = initialState;
      const initial1 = state.products.find((p) => p.id === productId1)?.stock;
      const initial2 = state.products.find((p) => p.id === productId2)?.stock;

      state = productReducer(state, decrementStock(productId1));
      state = productReducer(state, decrementStock(productId2));
      state = productReducer(state, decrementStock(productId1));

      const final1 = state.products.find((p) => p.id === productId1)?.stock;
      const final2 = state.products.find((p) => p.id === productId2)?.stock;

      expect(final1).toBe((initial1 || 0) - 2);
      expect(final2).toBe((initial2 || 0) - 1);
    });
  });

  describe("product data validation", () => {
    it("todos los productos deben tener nombres no vacíos", () => {
      initialState.products.forEach((product) => {
        expect(product.name).toBeTruthy();
        expect(product.name.length).toBeGreaterThan(0);
      });
    });

    it("todos los productos deben tener descripciones", () => {
      initialState.products.forEach((product) => {
        expect(product.description).toBeTruthy();
        expect(product.description.length).toBeGreaterThan(0);
      });
    });

    it("todos los productos deben tener precios válidos", () => {
      initialState.products.forEach((product) => {
        expect(product.price).toBeGreaterThan(0);
        expect(typeof product.price).toBe("number");
      });
    });

    it("todos los productos deben tener URLs de imagen", () => {
      initialState.products.forEach((product) => {
        expect(product.imageUrl).toBeTruthy();
        expect(product.imageUrl).toMatch(/^https?:\/\/.+/);
      });
    });

    it("los IDs de productos deben seguir el formato PROD-XXX", () => {
      initialState.products.forEach((product) => {
        expect(product.id).toMatch(/^PROD-\d{3}$/);
      });
    });
  });

  describe("reducer immutability", () => {
    it("no debería mutar el estado original al decrementar stock", () => {
      const originalState = JSON.parse(JSON.stringify(initialState));
      const productId = "PROD-001";

      productReducer(initialState, decrementStock(productId));

      expect(initialState).toEqual(originalState);
    });

    it("debería crear un nuevo objeto de estado", () => {
      const originalState = initialState;
      const newState = productReducer(initialState, decrementStock("PROD-001"));

      expect(newState).not.toBe(originalState);
    });
  });
});
