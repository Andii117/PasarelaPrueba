import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { expect, it, describe, vi } from "vitest";
import axios from "axios";
import SummaryPage from "./SummaryPage";
import checkoutReducer from "../../store/slices/checkoutSlice";
import transactionReducer from "../../store/slices/transactionSlice";
import productReducer from "../../store/slices/productSlice";

// Mock de Axios y Navigate
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockedNavigate };
});

describe("SummaryPage Component", () => {
  const setup = (initialCheckoutState: any) => {
    const store = configureStore({
      reducer: {
        checkout: checkoutReducer,
        transaction: transactionReducer,
        product: productReducer,
      },
      preloadedState: {
        checkout: initialCheckoutState,
      },
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <SummaryPage />
        </BrowserRouter>
      </Provider>,
    );
  };

  const mockData = {
    productName: "Cámara Sony",
    productPrice: 10000,
    productId: "123",
    // ... otros campos necesarios
  };

  it("debe mostrar el nombre del producto y el cálculo total correcto", () => {
    setup(mockData);

    // 10,000 (precio) + 3,000 (base) + 8,000 (envío) = 21,000
    expect(screen.getByText("Cámara Sony")).toBeInTheDocument();
    expect(screen.getByText("$21,000 COP")).toBeInTheDocument();
  });

  it("debe cambiar el texto del botón a 'Procesando' al hacer clic", async () => {
    setup(mockData);
    mockedAxios.post.mockResolvedValueOnce({ data: "TX_123" });

    const payButton = screen.getByText(/Confirmar pago/i);
    fireEvent.click(payButton);

    expect(screen.getByText(/Procesando.../i)).toBeInTheDocument();
    expect(payButton).toBeDisabled();
  });

  it("debe navegar a /status cuando el pago es exitoso", async () => {
    setup(mockData);
    mockedAxios.post.mockResolvedValueOnce({ data: "TX_123" });

    fireEvent.click(screen.getByText(/Confirmar pago/i));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/status",
        expect.any(Object),
      );
    });
  });

  it("debe mostrar un mensaje de error si la API falla", async () => {
    setup(mockData);
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: "Fondos insuficientes" } },
    });

    fireEvent.click(screen.getByText(/Confirmar pago/i));

    // Esperamos a que aparezca el mensaje de error que definiste en el componente
    const errorMessage = await screen.findByText(/Fondos insuficientes/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
