import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { expect, it, describe, vi, beforeEach } from "vitest";
import PaymentStatusPage from "./PaymentStatusPage";
import checkoutReducer from "../../store/slices/checkoutSlice";
import transactionReducer from "../../store/slices/transactionSlice";

// Mock de useNavigate y useLocation
const mockedNavigate = vi.fn();
let mockedLocationState: any = { status: "APPROVED", transactionId: "TX-123" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ state: mockedLocationState }),
  };
});

describe("PaymentStatusPage Component", () => {
  const setup = () => {
    const store = configureStore({
      reducer: {
        checkout: checkoutReducer,
        transaction: transactionReducer,
      },
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentStatusPage />
        </BrowserRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it("debe mostrar '¡Pago aprobado!' cuando el estado es APPROVED", () => {
    mockedLocationState = { status: "APPROVED", transactionId: "TX-123" };
    setup();
    expect(screen.getByText(/¡Pago aprobado!/i)).toBeInTheDocument();
    expect(screen.getByText("TX-123")).toBeInTheDocument();
  });

  it("debe mostrar 'Pago rechazado' cuando el estado es ERROR", () => {
    mockedLocationState = { status: "ERROR", transactionId: "N/A" };
    setup();
    expect(screen.getByText(/Pago rechazado o fallido/i)).toBeInTheDocument();
  });

  it("debe mostrar 'Pago pendiente' cuando el estado es PENDING", () => {
    mockedLocationState = { status: "PENDING", transactionId: "TX-PEND" };
    setup();
    expect(screen.getByText(/Pago pendiente/i)).toBeInTheDocument();
  });

  it("debe navegar al inicio manualmente al hacer clic en el botón", () => {
    setup();
    const backButton = screen.getByText(/Finalizar y volver/i);
    fireEvent.click(backButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  it("debe redirigir automáticamente después de que el contador llegue a cero", () => {
    setup();

    // Avanzamos el tiempo 15 segundos
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
