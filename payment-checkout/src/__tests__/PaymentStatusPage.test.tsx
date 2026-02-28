import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PaymentStatusPage from "../pages/PaymentStatusPage/PaymentStatusPage";
import checkoutReducer from "../store/slices/checkoutSlice";
import transactionReducer from "../store/slices/transactionSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      checkout: checkoutReducer,
      transaction: transactionReducer,
    },
  });

const renderPage = (locationState = {}) => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/status", state: locationState }]}
      >
        <Routes>
          <Route path="/status" element={<PaymentStatusPage />} />
          <Route path="/" element={<div>HomePage</div>} />
          <Route path="/checkout" element={<div>CheckoutPage</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return { store };
};

describe("PaymentStatusPage — Estado APPROVED", () => {
  it("muestra título de pago aprobado", () => {
    renderPage({ status: "APPROVED", transactionId: "txn_123" });
    expect(screen.getByText("¡Pago aprobado!")).toBeInTheDocument();
  });

  it("muestra subtítulo correcto para aprobado", () => {
    renderPage({ status: "APPROVED" });
    expect(
      screen.getByText("Tu compra fue procesada exitosamente"),
    ).toBeInTheDocument();
  });

  it("muestra badge Aprobado", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.getByText("● Aprobado")).toBeInTheDocument();
  });

  it("muestra ícono ✓", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("muestra mensaje de pedido confirmado", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.getByText(/Tu pedido está confirmado/)).toBeInTheDocument();
  });

  it("no muestra botón de reintentar pago", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.queryByText("← Reintentar pago")).not.toBeInTheDocument();
  });
});

describe("PaymentStatusPage — Estado FAILED/Rechazado", () => {
  it("muestra título de pago rechazado", () => {
    renderPage({ status: "FAILED" });
    expect(screen.getByText("Pago rechazado")).toBeInTheDocument();
  });

  it("muestra subtítulo correcto para rechazado", () => {
    renderPage({ status: "FAILED" });
    expect(screen.getByText("No pudimos procesar tu pago")).toBeInTheDocument();
  });

  it("muestra badge Rechazado", () => {
    renderPage({ status: "FAILED" });
    expect(screen.getByText("● Rechazado")).toBeInTheDocument();
  });

  it("muestra ícono ✕", () => {
    renderPage({ status: "FAILED" });
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  it("muestra mensaje de verificar datos", () => {
    renderPage({ status: "FAILED" });
    expect(screen.getByText(/Verifica que los datos/)).toBeInTheDocument();
  });

  it("muestra botón de reintentar pago", () => {
    renderPage({ status: "FAILED" });
    expect(screen.getByText("← Reintentar pago")).toBeInTheDocument();
  });
});

describe("PaymentStatusPage — Detalle transacción", () => {
  it("muestra el ID de transacción cuando existe", () => {
    renderPage({ status: "APPROVED", transactionId: "txn_abc123" });
    expect(screen.getByText("txn_abc123")).toBeInTheDocument();
  });

  it("no muestra fila de ID si no viene transactionId", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.queryByText("ID Transacción")).not.toBeInTheDocument();
  });

  it("muestra la fecha actual", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.getByText("Fecha")).toBeInTheDocument();
  });

  it("muestra el método de pago", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.getByText("💳 Tarjeta de crédito")).toBeInTheDocument();
  });
});

describe("PaymentStatusPage — Countdown", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("muestra countdown inicial en 10", () => {
    renderPage({ status: "APPROVED" });
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("decrementa el countdown después de 1 segundo", () => {
    renderPage({ status: "APPROVED" });
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("decrementa el countdown después de 5 segundos", () => {
    renderPage({ status: "APPROVED" });
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("navega a home al llegar a 0", () => {
    renderPage({ status: "APPROVED" });
    act(() => jest.advanceTimersByTime(10000));
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });
});

describe("PaymentStatusPage — Navegación manual", () => {
  it("navega a home al hacer click en Volver al inicio", () => {
    renderPage({ status: "APPROVED" });
    act(() => {
      screen.getByText("Volver al inicio").click();
    });
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("navega a /checkout al hacer click en Reintentar pago", () => {
    renderPage({ status: "FAILED" });
    act(() => {
      screen.getByText("← Reintentar pago").click();
    });
    expect(screen.getByText("CheckoutPage")).toBeInTheDocument();
  });
});
