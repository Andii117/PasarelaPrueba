import { describe, it, expect, beforeEach, vi } from "vitest";
import checkoutReducer, {
  setStep,
  setFormData,
  setClientIp,
  resetCheckout,
} from "./checkoutSlice";

describe("checkoutSlice", () => {
  const emptyState = {
    currentStep: 1,
    productId: "",
    productName: "",
    productPrice: 0,
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
    deliveryName: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPhone: "",
    deliveryEmail: "",
    clientIp: "",
  };

  // Antes de cada test, limpiamos el localStorage para que no afecte a las pruebas
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("debe actualizar el paso actual con setStep y guardarlo en localStorage", () => {
    const state = checkoutReducer(emptyState, setStep(2));

    expect(state.currentStep).toBe(2);

    // Verificar que se guardó en localStorage
    const saved = JSON.parse(localStorage.getItem("checkoutState") || "{}");
    expect(saved.currentStep).toBe(2);
  });

  it("debe actualizar los datos del formulario con setFormData", () => {
    const payload = {
      productName: "Cámara Sony",
      deliveryEmail: "test@correo.com",
    };

    const state = checkoutReducer(emptyState, setFormData(payload));

    expect(state.productName).toBe("Cámara Sony");
    expect(state.deliveryEmail).toBe("test@correo.com");

    // Verificar que también se guardó el email por separado (como indica tu código)
    expect(localStorage.getItem("customer_email")).toBe("test@correo.com");
  });

  it("debe actualizar la IP del cliente con setClientIp", () => {
    const testIp = "192.168.1.1";
    const state = checkoutReducer(emptyState, setClientIp(testIp));

    expect(state.clientIp).toBe(testIp);

    const saved = JSON.parse(localStorage.getItem("checkoutState") || "{}");
    expect(saved.clientIp).toBe(testIp);
  });

  it("debe resetear todo el estado y limpiar localStorage con resetCheckout", () => {
    const dirtyState = {
      ...emptyState,
      currentStep: 3,
      productName: "Producto sucio",
    };

    // Simulamos que hay datos viejos en localStorage
    localStorage.setItem("checkoutState", JSON.stringify(dirtyState));
    localStorage.setItem("customer_email", "viejo@correo.com");

    const state = checkoutReducer(dirtyState, resetCheckout());

    // El estado debe volver al inicial
    expect(state).toEqual(emptyState);

    // LocalStorage debe estar vacío
    expect(localStorage.getItem("checkoutState")).toBeNull();
    expect(localStorage.getItem("customer_email")).toBeNull();
  });
});
