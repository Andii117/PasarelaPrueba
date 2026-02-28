import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import SummaryPage from "../pages/SummaryPage/SummaryPage";
import checkoutReducer from "../store/slices/checkoutSlice";
import transactionReducer from "../store/slices/transactionSlice";
import productReducer from "../store/slices/productSlice";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const makeStore = (checkoutOverrides = {}) =>
  configureStore({
    reducer: {
      checkout: checkoutReducer,
      transaction: transactionReducer,
      product: productReducer,
    },
    preloadedState: {
      checkout: {
        currentStep: 3,
        productId: "prod-1",
        productName: "Producto Test",
        productPrice: 90000,
        cardNumber: "4111111111111111",
        cardHolder: "Juan Pérez",
        cardExpiry: "12/26",
        cardCvv: "123",
        deliveryName: "Juan Pérez",
        deliveryAddress: "Calle 10",
        deliveryCity: "Medellín",
        deliveryPhone: "3001234567",
        clientIp: "192.168.1.1",
        ...checkoutOverrides,
      },
      product: {
        products: [
          {
            id: "prod-1",
            name: "Producto Test",
            description: "",
            price: 90000,
            imageUrl: "",
            stock: 5,
          },
        ],
        loading: false,
        error: null,
      },
    },
  });

const renderPage = (checkoutOverrides = {}) => {
  const store = makeStore(checkoutOverrides);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SummaryPage />
      </MemoryRouter>
    </Provider>,
  );
  return { store };
};

describe("SummaryPage — Renderizado", () => {
  it("muestra el título Resumen de pago", () => {
    renderPage();
    expect(screen.getByText("Resumen de pago")).toBeInTheDocument();
  });

  it("muestra el nombre del producto", () => {
    renderPage();
    expect(screen.getByText("Producto Test")).toBeInTheDocument();
  });

  it("muestra el precio del producto formateado", () => {
    renderPage();
    expect(screen.getByText("$90,000 COP")).toBeInTheDocument();
  });

  it("muestra la tarifa base", () => {
    renderPage();
    expect(screen.getByText("$3,000 COP")).toBeInTheDocument();
  });

  it("muestra la tarifa de envío", () => {
    renderPage();
    expect(screen.getByText("$8,000 COP")).toBeInTheDocument();
  });

  it("muestra el total correcto (producto + base + envío)", () => {
    renderPage();
    // 90000 + 3000 + 8000 = 101000
    expect(screen.getByText("$101,000 COP")).toBeInTheDocument();
  });

  it("muestra el botón Confirmar pago habilitado", () => {
    renderPage();
    expect(screen.getByText("✅ Confirmar pago")).toBeInTheDocument();
    expect(screen.getByText("✅ Confirmar pago")).not.toBeDisabled();
  });

  it("muestra el botón Modificar datos", () => {
    renderPage();
    expect(screen.getByText("Modificar datos")).toBeInTheDocument();
  });
});

describe("SummaryPage — Cálculo de totales", () => {
  it("calcula correctamente el total con precio diferente", () => {
    renderPage({ productPrice: 50000 });
    // 50000 + 3000 + 8000 = 61000
    expect(screen.getByText("$61,000 COP")).toBeInTheDocument();
  });

  it("calcula correctamente el total con precio 0", () => {
    renderPage({ productPrice: 0 });
    // 0 + 3000 + 8000 = 11000
    expect(screen.getByText("$11,000 COP")).toBeInTheDocument();
  });
});

describe("SummaryPage — Flujo de pago", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("muestra Procesando al hacer click en confirmar", () => {
    renderPage();
    fireEvent.click(screen.getByText("✅ Confirmar pago"));
    expect(screen.getByText("⏳ Procesando...")).toBeInTheDocument();
  });

  it("deshabilita el botón confirmar mientras procesa", () => {
    renderPage();
    fireEvent.click(screen.getByText("✅ Confirmar pago"));
    expect(screen.getByText("⏳ Procesando...")).toBeDisabled();
  });

  it("deshabilita el botón Modificar datos mientras procesa", () => {
    renderPage();
    fireEvent.click(screen.getByText("✅ Confirmar pago"));
    expect(screen.getByText("Modificar datos")).toBeDisabled();
  });

  it("navega a /status con estado APPROVED después de 2 segundos", () => {
    renderPage();
    fireEvent.click(screen.getByText("✅ Confirmar pago"));
    act(() => jest.advanceTimersByTime(2000));
    expect(mockNavigate).toHaveBeenCalledWith("/status", {
      state: { status: "APPROVED", transactionId: "TXN-FAKE-001" },
    });
  });

  it("despacha setTransaction con APPROVED después de 2 segundos", () => {
    const { store } = renderPage();
    fireEvent.click(screen.getByText("✅ Confirmar pago"));
    act(() => jest.advanceTimersByTime(2000));
    const state = store.getState();
    expect(state.transaction.status).toBe("APPROVED");
    expect(state.transaction.transactionId).toBe("TXN-FAKE-001");
  });

  it("decrementa el stock del producto después de 2 segundos", () => {
    const { store } = renderPage();
    fireEvent.click(screen.getByText("✅ Confirmar pago"));
    act(() => jest.advanceTimersByTime(2000));
    const product = store
      .getState()
      .product.products.find((p: { id: string }) => p.id === "prod-1");
    expect(product?.stock).toBe(4);
  });
});

describe("SummaryPage — Navegación", () => {
  it("navega hacia atrás al hacer click en Modificar datos", () => {
    renderPage();
    fireEvent.click(screen.getByText("Modificar datos"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
