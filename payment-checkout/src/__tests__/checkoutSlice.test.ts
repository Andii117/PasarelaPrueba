import checkoutReducer, {
  setStep,
  setFormData,
  setClientIp,
  resetCheckout,
} from "../store/slices/checkoutSlice";

const initialState = {
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
  clientIp: "",
};

beforeEach(() => {
  localStorage.clear();
});

describe("checkoutSlice — estado inicial", () => {
  it("retorna el estado inicial por defecto", () => {
    const state = checkoutReducer(undefined, { type: "@@INIT" });
    expect(state.currentStep).toBe(1);
    expect(state.productId).toBe("");
    expect(state.clientIp).toBe("");
  });

  it("carga el estado desde localStorage si existe", () => {
    const saved = { ...initialState, productName: "Guardado", currentStep: 2 };
    localStorage.setItem("checkoutState", JSON.stringify(saved));
    // Reimportar el módulo para que lea localStorage al inicializar
    jest.resetModules();
    const { default: freshReducer } = require("../store/slices/checkoutSlice");
    const state = freshReducer(undefined, { type: "@@INIT" });
    expect(state.productName).toBe("Guardado");
    expect(state.currentStep).toBe(2);
  });
});

describe("checkoutSlice — setStep", () => {
  it("actualiza currentStep correctamente", () => {
    const state = checkoutReducer(initialState, setStep(2));
    expect(state.currentStep).toBe(2);
  });

  it("guarda el estado en localStorage", () => {
    checkoutReducer(initialState, setStep(3));
    const saved = JSON.parse(localStorage.getItem("checkoutState")!);
    expect(saved.currentStep).toBe(3);
  });

  it("no modifica otros campos al cambiar el step", () => {
    const prev = { ...initialState, productName: "Producto Test" };
    const state = checkoutReducer(prev, setStep(2));
    expect(state.productName).toBe("Producto Test");
  });
});

describe("checkoutSlice — setFormData", () => {
  it("actualiza campos parciales correctamente", () => {
    const state = checkoutReducer(
      initialState,
      setFormData({ productName: "Nuevo Producto", productPrice: 90000 }),
    );
    expect(state.productName).toBe("Nuevo Producto");
    expect(state.productPrice).toBe(90000);
  });

  it("no sobreescribe campos no incluidos en el payload", () => {
    const prev = { ...initialState, cardHolder: "Juan" };
    const state = checkoutReducer(prev, setFormData({ productName: "Test" }));
    expect(state.cardHolder).toBe("Juan");
  });

  it("guarda el estado actualizado en localStorage", () => {
    checkoutReducer(initialState, setFormData({ deliveryCity: "Medellín" }));
    const saved = JSON.parse(localStorage.getItem("checkoutState")!);
    expect(saved.deliveryCity).toBe("Medellín");
  });

  it("actualiza todos los campos de tarjeta correctamente", () => {
    const state = checkoutReducer(
      initialState,
      setFormData({
        cardNumber: "4111111111111111",
        cardHolder: "JUAN PEREZ",
        cardExpiry: "12/26",
        cardCvv: "123",
      }),
    );
    expect(state.cardNumber).toBe("4111111111111111");
    expect(state.cardHolder).toBe("JUAN PEREZ");
    expect(state.cardExpiry).toBe("12/26");
    expect(state.cardCvv).toBe("123");
  });
});

describe("checkoutSlice — setClientIp", () => {
  it("actualiza el clientIp correctamente", () => {
    const state = checkoutReducer(initialState, setClientIp("192.168.1.1"));
    expect(state.clientIp).toBe("192.168.1.1");
  });

  it("guarda el clientIp en localStorage", () => {
    checkoutReducer(initialState, setClientIp("10.0.0.1"));
    const saved = JSON.parse(localStorage.getItem("checkoutState")!);
    expect(saved.clientIp).toBe("10.0.0.1");
  });

  it("no modifica otros campos al actualizar el IP", () => {
    const prev = { ...initialState, productName: "Producto Test" };
    const state = checkoutReducer(prev, setClientIp("8.8.8.8"));
    expect(state.productName).toBe("Producto Test");
  });
});

describe("checkoutSlice — resetCheckout", () => {
  it("resetea el estado al inicial", () => {
    const prev = {
      ...initialState,
      productName: "Producto",
      cardNumber: "4111111111111111",
      currentStep: 3,
      clientIp: "192.168.1.1",
    };
    const state = checkoutReducer(prev, resetCheckout());
    expect(state).toEqual(initialState);
  });

  it("elimina checkoutState de localStorage", () => {
    localStorage.setItem("checkoutState", JSON.stringify(initialState));
    checkoutReducer(initialState, resetCheckout());
    expect(localStorage.getItem("checkoutState")).toBeNull();
  });

  it("retorna currentStep en 1 después del reset", () => {
    const prev = { ...initialState, currentStep: 3 };
    const state = checkoutReducer(prev, resetCheckout());
    expect(state.currentStep).toBe(1);
  });

  it("retorna clientIp vacío después del reset", () => {
    const prev = { ...initialState, clientIp: "192.168.1.1" };
    const state = checkoutReducer(prev, resetCheckout());
    expect(state.clientIp).toBe("");
  });
});
