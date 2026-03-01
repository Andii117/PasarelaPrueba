import { describe, it, expect } from "vitest";
import { store } from "./store";

describe("Redux Store Configuration", () => {
  it("debe iniciar con el estado inicial correcto para todos los slices", () => {
    const state = store.getState();

    // 1. Verificar que existan las llaves principales del store
    expect(state).toHaveProperty("product");
    expect(state).toHaveProperty("checkout");
    expect(state).toHaveProperty("transaction");

    // 2. Verificar valores iniciales específicos de cada slice
    // Slice de Productos
    expect(state.product.products).toEqual([]);
    expect(state.product.loading).toBe(false);

    // Slice de Checkout
    expect(state.checkout.currentStep).toBe(1);
    expect(state.checkout.productName).toBe("");

    // Slice de Transacción
    expect(state.transaction.status).toBe("IDLE");
    expect(state.transaction.transactionId).toBeNull();
  });

  it("debe tener los reducers vinculados correctamente (prueba de despacho)", () => {
    // Probamos despachando una acción simple para ver si el store reacciona
    // Usamos una acción de uno de los slices, por ejemplo setStep de checkout
    store.dispatch({ type: "checkout/setStep", payload: 2 });

    const state = store.getState();
    expect(state.checkout.currentStep).toBe(2);
  });
});
