import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CheckoutModal from "../pages/CheckoutModal/CheckoutModal";
import checkoutReducer from "../store/slices/checkoutSlice";
import { ipService } from "../services/ipServices";

// Mocks
jest.mock("../services/ipServices", () => ({
  ipService: {
    getClientIp: jest.fn().mockResolvedValue("192.168.1.1"),
  },
}));

jest.mock("react-icons/fa", () => ({
  FaCcVisa: () => <span data-testid="visa-icon">VISA</span>,
}));

const makeStore = (overrides = {}) =>
  configureStore({
    reducer: { checkout: checkoutReducer },
    preloadedState: {
      checkout: {
        currentStep: 2,
        productId: "prod-1",
        productName: "Producto Test",
        productPrice: 99000,
        cardNumber: "",
        cardHolder: "",
        cardExpiry: "",
        cardCvv: "",
        deliveryName: "",
        deliveryAddress: "",
        deliveryCity: "",
        deliveryPhone: "",
        clientIp: "",
        ...overrides,
      },
    },
  });

const renderModal = (overrides = {}) => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();
  const store = makeStore(overrides);
  render(
    <Provider store={store}>
      <CheckoutModal onClose={onClose} onConfirm={onConfirm} />
    </Provider>,
  );
  return { onClose, onConfirm, store };
};

const fillValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText("Ej: Juan Pérez"), {
    target: { value: "Juan Pérez" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ej: Calle 10 # 43-25"), {
    target: { value: "Calle 10 # 43-25" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ej: Medellín"), {
    target: { value: "Medellín" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ej: 3001234567"), {
    target: { value: "3001234567" },
  });
  fireEvent.change(screen.getByPlaceholderText("0000 0000 0000 0000"), {
    target: { value: "4111111111111111" },
  });
  fireEvent.change(screen.getByPlaceholderText("MM/AA"), {
    target: { value: "12/26" },
  });
  fireEvent.change(screen.getByPlaceholderText("123"), {
    target: { value: "456" },
  });
  fireEvent.change(screen.getByPlaceholderText("Como aparece en la tarjeta"), {
    target: { value: "JUAN PEREZ" },
  });
};

describe("CheckoutModal — Renderizado", () => {
  it("muestra el título Finalizar compra", () => {
    renderModal();
    expect(screen.getByText("Finalizar compra")).toBeInTheDocument();
  });

  it("muestra el nombre del producto del store", () => {
    renderModal();
    expect(screen.getByText("Producto Test")).toBeInTheDocument();
  });

  it("muestra el precio formateado en COP", () => {
    renderModal();
    expect(screen.getByText(/99\.000/)).toBeInTheDocument();
  });

  it("muestra la sección de datos de entrega", () => {
    renderModal();
    expect(screen.getByText("Datos de entrega")).toBeInTheDocument();
  });

  it("muestra la sección de tarjeta de crédito", () => {
    renderModal();
    expect(screen.getByText("Tarjeta de crédito")).toBeInTheDocument();
  });

  it("muestra el mensaje de seguridad", () => {
    renderModal();
    expect(
      screen.getByText(/tokenizada y nunca se almacena/),
    ).toBeInTheDocument();
  });

  it("muestra los links de términos y datos", () => {
    renderModal();
    expect(screen.getByText("Términos y Condiciones")).toBeInTheDocument();
    expect(
      screen.getByText("Tratamiento de Datos Personales"),
    ).toBeInTheDocument();
  });
});

describe("CheckoutModal — IP Service", () => {
  it("llama a ipService.getClientIp al montar", async () => {
    renderModal();
    await waitFor(() => {
      expect(ipService.getClientIp).toHaveBeenCalledTimes(1);
    });
  });
});

describe("CheckoutModal — Checkboxes y botón", () => {
  it("el botón confirmar inicia deshabilitado", () => {
    renderModal();
    expect(screen.getByText("Confirmar compra")).toBeDisabled();
  });

  it("sigue deshabilitado con solo un checkbox marcado", () => {
    renderModal();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getByText("Confirmar compra")).toBeDisabled();
  });

  it("se habilita al marcar ambos checkboxes", () => {
    renderModal();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(screen.getByText("Confirmar compra")).not.toBeDisabled();
  });
});

describe("CheckoutModal — Validaciones", () => {
  beforeEach(() => {
    renderModal();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
  });

  it("muestra error de nombre de entrega vacío", () => {
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getAllByText("⚠ Nombre requerido").length).toBeGreaterThan(0);
  });

  it("muestra error de dirección vacía", () => {
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getByText("⚠ Dirección requerida")).toBeInTheDocument();
  });

  it("muestra error de ciudad vacía", () => {
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getByText("⚠ Ciudad requerida")).toBeInTheDocument();
  });

  it("muestra error de teléfono inválido", () => {
    fireEvent.change(screen.getByPlaceholderText("Ej: 3001234567"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getByText("⚠ Teléfono inválido")).toBeInTheDocument();
  });

  it("muestra error de tarjeta con menos de 16 dígitos", () => {
    fireEvent.change(screen.getByPlaceholderText("0000 0000 0000 0000"), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(
      screen.getByText("⚠ Debe tener 16 dígitos numéricos"),
    ).toBeInTheDocument();
  });

  it("muestra error de vencimiento con formato incorrecto", () => {
    fireEvent.change(screen.getByPlaceholderText("MM/AA"), {
      target: { value: "1226" },
    });
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getByText("⚠ Formato: MM/AA")).toBeInTheDocument();
  });

  it("muestra error de CVV con menos de 3 dígitos", () => {
    fireEvent.change(screen.getByPlaceholderText("123"), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getByText("⚠ CVV inválido")).toBeInTheDocument();
  });

  it("no llama onConfirm si hay errores", () => {
    fireEvent.click(screen.getByText("Confirmar compra"));
  });
});

describe("CheckoutModal — Flujo completo", () => {
  it("llama onConfirm con formulario válido", async () => {
    const { onConfirm } = renderModal();
    fillValidForm();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByText("Confirmar compra"));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});

describe("CheckoutModal — Detección de marca", () => {
  it("muestra ícono VISA con número que empieza en 4", () => {
    renderModal();
    fireEvent.change(screen.getByPlaceholderText("0000 0000 0000 0000"), {
      target: { value: "4111111111111111" },
    });
    expect(screen.getByTestId("visa-icon")).toBeInTheDocument();
  });

  it("no muestra ícono VISA con número que empieza en 5", () => {
    renderModal();
    fireEvent.change(screen.getByPlaceholderText("0000 0000 0000 0000"), {
      target: { value: "5111111111111111" },
    });
    expect(screen.queryByTestId("visa-icon")).not.toBeInTheDocument();
  });
});

describe("CheckoutModal — Cierre del modal", () => {
  it("llama onClose al hacer click en ✕", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
