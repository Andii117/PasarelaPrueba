import { store } from "../store/store";
import type { RootState, AppDispatch } from "../store/store";
import { setStep, resetCheckout } from "../store/slices/checkoutSlice";
import {
  setTransaction,
  resetTransaction,
} from "../store/slices/transactionSlice";
import { decrementStock } from "../store/slices/productSlice";

describe("store — configuración", () => {
  it("tiene el slice product en el estado", () => {
    const state = store.getState();
    expect(state.product).toBeDefined();
  });

  it("tiene el slice checkout en el estado", () => {
    const state = store.getState();
    expect(state.checkout).toBeDefined();
  });

  it("tiene el slice transaction en el estado", () => {
    const state = store.getState();
    expect(state.transaction).toBeDefined();
  });

  it("el estado inicial de transaction es IDLE", () => {
    const state = store.getState();
    expect(state.transaction.status).toBe("IDLE");
    expect(state.transaction.transactionId).toBeNull();
  });

  it("el estado inicial de checkout tiene currentStep en 1", () => {
    const state = store.getState();
    expect(state.checkout.currentStep).toBe(1);
  });

  it("el estado inicial de product tiene productos cargados", () => {
    const state = store.getState();
    expect(state.product.products.length).toBeGreaterThan(0);
  });
});

describe("store — dispatch de acciones", () => {
  it("despacha setStep y actualiza checkout.currentStep", () => {
    store.dispatch(setStep(2));
    expect(store.getState().checkout.currentStep).toBe(2);
  });

  it("despacha setTransaction y actualiza transaction", () => {
    store.dispatch(
      setTransaction({ transactionId: "TXN-001", status: "APPROVED" }),
    );
    const state = store.getState();
    expect(state.transaction.transactionId).toBe("TXN-001");
    expect(state.transaction.status).toBe("APPROVED");
  });

  it("despacha resetTransaction y vuelve a IDLE", () => {
    store.dispatch(
      setTransaction({ transactionId: "TXN-001", status: "APPROVED" }),
    );
    store.dispatch(resetTransaction());
    const state = store.getState();
    expect(state.transaction.status).toBe("IDLE");
    expect(state.transaction.transactionId).toBeNull();
  });

  it("despacha resetCheckout y limpia el checkout", () => {
    store.dispatch(setStep(3));
    store.dispatch(resetCheckout());
    expect(store.getState().checkout.currentStep).toBe(1);
  });

  it("despacha decrementStock y reduce el stock del producto", () => {
    const before = store
      .getState()
      .product.products.find((p) => p.id === "PROD-001");
    store.dispatch(decrementStock("PROD-001"));
    const after = store
      .getState()
      .product.products.find((p) => p.id === "PROD-001");
    expect(after!.stock).toBe(before!.stock - 1);
  });
});

describe("store — tipos", () => {
  it("RootState contiene las claves correctas", () => {
    const state: RootState = store.getState();
    expect(Object.keys(state)).toEqual(
      expect.arrayContaining(["product", "checkout", "transaction"]),
    );
  });

  it("AppDispatch es una función", () => {
    const dispatch: AppDispatch = store.dispatch;
    expect(typeof dispatch).toBe("function");
  });
});
