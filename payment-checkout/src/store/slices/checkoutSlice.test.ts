// @ts-ignore - Jest globals
import checkoutReducer, {
  setStep,
  setFormData,
  resetCheckout,
} from "./checkoutSlice";
import type { CheckoutState } from "../../types";

describe("checkoutSlice", () => {
  const mockInitialState: CheckoutState = {
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
  };

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("initial state", () => {
    it("debería devolver el estado inicial por defecto cuando localStorage está vacío", () => {
      const state = checkoutReducer(undefined, { type: "unknown" });
      expect(state).toEqual(mockInitialState);
    });
  });

  describe("setStep action", () => {
    it("debería actualizar el paso actual", () => {
      const state = checkoutReducer(mockInitialState, setStep(2));
      expect(state.currentStep).toBe(2);
    });

    it("debería guardar el estado en localStorage cuando se actualiza el paso", () => {
      const state = checkoutReducer(mockInitialState, setStep(3));
      const savedState = JSON.parse(
        localStorage.getItem("checkoutState") || "{}",
      );
      expect(savedState.currentStep).toBe(3);
      expect(savedState).toEqual(state);
    });

    it("debería permitir pasos válidos (1-4)", () => {
      let state = mockInitialState;
      state = checkoutReducer(state, setStep(1));
      expect(state.currentStep).toBe(1);

      state = checkoutReducer(state, setStep(2));
      expect(state.currentStep).toBe(2);

      state = checkoutReducer(state, setStep(3));
      expect(state.currentStep).toBe(3);

      state = checkoutReducer(state, setStep(4));
      expect(state.currentStep).toBe(4);
    });
  });

  describe("setFormData action", () => {
    it("debería actualizar datos del producto", () => {
      const formData = {
        productId: "prod-123",
        productName: "Laptop",
        productPrice: 999.99,
      };
      const state = checkoutReducer(mockInitialState, setFormData(formData));
      expect(state.productId).toBe("prod-123");
      expect(state.productName).toBe("Laptop");
      expect(state.productPrice).toBe(999.99);
    });

    it("debería actualizar datos de tarjeta", () => {
      const formData = {
        cardNumber: "4111111111111111",
        cardHolder: "Juan Pérez",
        cardExpiry: "12/25",
        cardCvv: "123",
      };
      const state = checkoutReducer(mockInitialState, setFormData(formData));
      expect(state.cardNumber).toBe("4111111111111111");
      expect(state.cardHolder).toBe("Juan Pérez");
      expect(state.cardExpiry).toBe("12/25");
      expect(state.cardCvv).toBe("123");
    });

    it("debería actualizar datos de entrega", () => {
      const formData = {
        deliveryName: "Carlos García",
        deliveryAddress: "Calle Principal 123",
        deliveryCity: "Madrid",
        deliveryPhone: "+34 912 345 678",
      };
      const state = checkoutReducer(mockInitialState, setFormData(formData));
      expect(state.deliveryName).toBe("Carlos García");
      expect(state.deliveryAddress).toBe("Calle Principal 123");
      expect(state.deliveryCity).toBe("Madrid");
      expect(state.deliveryPhone).toBe("+34 912 345 678");
    });

    it("debería guardar el estado actualizado en localStorage", () => {
      const formData = {
        productName: "Monitor",
        productPrice: 299.99,
      };
      const state = checkoutReducer(mockInitialState, setFormData(formData));
      const savedState = JSON.parse(
        localStorage.getItem("checkoutState") || "{}",
      );
      expect(savedState).toEqual(state);
    });

    it("debería realizar un merge parcial de datos", () => {
      let state = mockInitialState;
      state = checkoutReducer(
        state,
        setFormData({
          productName: "Tablet",
          productPrice: 500,
        }),
      );
      expect(state.productName).toBe("Tablet");
      expect(state.productPrice).toBe(500);
      expect(state.cardNumber).toBe(""); // No debería cambiar
      expect(state.currentStep).toBe(1); // No debería cambiar
    });
  });

  describe("resetCheckout action", () => {
    it("debería retornar al estado inicial", () => {
      const stateWithData: CheckoutState = {
        currentStep: 3,
        productId: "prod-123",
        productName: "Laptop",
        productPrice: 999.99,
        cardNumber: "4111111111111111",
        cardHolder: "Juan Pérez",
        cardExpiry: "12/25",
        cardCvv: "123",
        deliveryName: "Carlos García",
        deliveryAddress: "Calle Principal 123",
        deliveryCity: "Madrid",
        deliveryPhone: "+34 912 345 678",
      };

      const state = checkoutReducer(stateWithData, resetCheckout());
      expect(state).toEqual(mockInitialState);
    });

    it("debería eliminar el estado de localStorage", () => {
      const formData = {
        productName: "Keyboard",
        productPrice: 150,
      };
      checkoutReducer(mockInitialState, setFormData(formData));
      expect(localStorage.getItem("checkoutState")).not.toBeNull();

      checkoutReducer(mockInitialState, resetCheckout());
      expect(localStorage.getItem("checkoutState")).toBeNull();
    });

    it("debería limpiar todos los campos del formulario", () => {
      const stateWithData: CheckoutState = {
        currentStep: 4,
        productId: "prod-456",
        productName: "Mouse",
        productPrice: 50,
        cardNumber: "5105105105105100",
        cardHolder: "María López",
        cardExpiry: "06/26",
        cardCvv: "456",
        deliveryName: "Ana Martínez",
        deliveryAddress: "Avenida Secundaria 456",
        deliveryCity: "Barcelona",
        deliveryPhone: "+34 933 456 789",
      };

      const state = checkoutReducer(stateWithData, resetCheckout());

      expect(state.currentStep).toBe(1);
      expect(state.productId).toBe("");
      expect(state.productName).toBe("");
      expect(state.productPrice).toBe(0);
      expect(state.cardNumber).toBe("");
      expect(state.cardHolder).toBe("");
      expect(state.cardExpiry).toBe("");
      expect(state.cardCvv).toBe("");
      expect(state.deliveryName).toBe("");
      expect(state.deliveryAddress).toBe("");
      expect(state.deliveryCity).toBe("");
      expect(state.deliveryPhone).toBe("");
    });
  });

  describe("localStorage integration", () => {
    it("debería persistir cambios múltiples en localStorage", () => {
      let state = mockInitialState;

      // Paso 1: Actualizar producto
      state = checkoutReducer(state, setFormData({ productName: "Laptop" }));
      let saved = JSON.parse(localStorage.getItem("checkoutState") || "{}");
      expect(saved.productName).toBe("Laptop");

      // Paso 2: Actualizar paso
      state = checkoutReducer(state, setStep(2));
      saved = JSON.parse(localStorage.getItem("checkoutState") || "{}");
      expect(saved.currentStep).toBe(2);

      // Paso 3: Actualizar datos de entrega
      state = checkoutReducer(state, setFormData({ deliveryName: "Juan" }));
      saved = JSON.parse(localStorage.getItem("checkoutState") || "{}");
      expect(saved.deliveryName).toBe("Juan");
    });
  });
});
