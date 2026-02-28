import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import ProductPage from "../pages/ProductPage/ProductPage";
import checkoutReducer from "../store/slices/checkoutSlice";
import transactionReducer from "../store/slices/transactionSlice";
import productReducer from "../store/slices/productSlice";

// Mocks
jest.mock("../components/CheckoutModal/CheckoutModal", () => ({
  __esModule: true,
  default: ({
    onClose,
    onConfirm,
  }: {
    onClose: () => void;
    onConfirm: () => void;
  }) => (
    <div data-testid="checkout-modal">
      <button onClick={onClose}>Cerrar modal</button>
      <button onClick={onConfirm}>Confirmar modal</button>
    </div>
  ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockProducts = [
  {
    id: "1",
    name: "Producto A",
    description: "Descripción A",
    price: 90000,
    imageUrl: "https://example.com/a.jpg",
    stock: 10,
  },
  {
    id: "2",
    name: "Producto B",
    description: "Descripción B",
    price: 50000,
    imageUrl: "https://example.com/b.jpg",
    stock: 3,
  },
  {
    id: "3",
    name: "Producto C",
    description: "Descripción C",
    price: 30000,
    imageUrl: "https://example.com/c.jpg",
    stock: 0,
  },
];

const makeStore = (products = mockProducts) =>
  configureStore({
    reducer: {
      checkout: checkoutReducer,
      transaction: transactionReducer,
      product: productReducer,
    },
    preloadedState: {
      product: { products, loading: false, error: null },
    },
  });

const renderPage = (products = mockProducts) => {
  const store = makeStore(products);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    </Provider>,
  );
  return { store };
};

describe("ProductPage — Renderizado", () => {
  it("muestra el título Mi Tienda", () => {
    renderPage();
    expect(screen.getByText("🛒 Mi Tienda")).toBeInTheDocument();
  });

  it("muestra la cantidad de productos disponibles", () => {
    renderPage();
    expect(screen.getByText("3 productos disponibles")).toBeInTheDocument();
  });

  it("renderiza todos los productos", () => {
    renderPage();
    expect(screen.getByText("Producto A")).toBeInTheDocument();
    expect(screen.getByText("Producto B")).toBeInTheDocument();
    expect(screen.getByText("Producto C")).toBeInTheDocument();
  });

  it("muestra precio formateado en COP", () => {
    renderPage();
    expect(screen.getByText(/90\.000/)).toBeInTheDocument();
  });

  it("muestra cuotas calculadas correctamente", () => {
    renderPage();
    expect(screen.getByText(/30\.000 COP sin interés/)).toBeInTheDocument();
  });

  it("muestra envío gratis en cada producto", () => {
    renderPage();
    expect(screen.getAllByText("Envío gratis")).toHaveLength(3);
  });
});

describe("ProductPage — Stock", () => {
  it("muestra badge de bajo stock cuando stock <= 5", () => {
    renderPage();
    expect(screen.getByText("¡Solo quedan 3!")).toBeInTheDocument();
  });

  it("muestra badge Agotado cuando stock = 0", () => {
    renderPage();
    expect(screen.getByText("Agotado")).toBeInTheDocument();
  });

  it("muestra texto de unidades disponibles con stock normal", () => {
    renderPage();
    expect(screen.getByText("10 unidades disponibles")).toBeInTheDocument();
  });

  it("muestra texto de bajo stock en card con stock <= 5", () => {
    renderPage();
    expect(screen.getByText("¡Solo 3 disponibles!")).toBeInTheDocument();
  });

  it("muestra texto Sin stock disponible cuando stock = 0", () => {
    renderPage();
    expect(screen.getByText("Sin stock disponible")).toBeInTheDocument();
  });
});

describe("ProductPage — Botón de compra", () => {
  it("muestra botón de pagar con tarjeta en producto disponible", () => {
    renderPage();
    expect(screen.getAllByText("💳 Pagar con tarjeta de crédito")).toHaveLength(
      2,
    );
  });

  it("muestra botón deshabilitado en producto agotado", () => {
    renderPage();
    expect(screen.getByText("Sin stock")).toBeDisabled();
  });

  it("abre el modal al hacer click en comprar", () => {
    renderPage();
    fireEvent.click(screen.getAllByText("💳 Pagar con tarjeta de crédito")[0]);
    expect(screen.getByTestId("checkout-modal")).toBeInTheDocument();
  });

  it("no abre modal al hacer click en producto agotado", () => {
    renderPage();
    fireEvent.click(screen.getByText("Sin stock"));
    expect(screen.queryByTestId("checkout-modal")).not.toBeInTheDocument();
  });
});

describe("ProductPage — Modal", () => {
  it("cierra el modal al hacer click en Cerrar modal", () => {
    renderPage();
    fireEvent.click(screen.getAllByText("💳 Pagar con tarjeta de crédito")[0]);
    expect(screen.getByTestId("checkout-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cerrar modal"));
    expect(screen.queryByTestId("checkout-modal")).not.toBeInTheDocument();
  });

  it("navega a /summary al confirmar el modal", () => {
    renderPage();
    fireEvent.click(screen.getAllByText("💳 Pagar con tarjeta de crédito")[0]);
    fireEvent.click(screen.getByText("Confirmar modal"));
    expect(mockNavigate).toHaveBeenCalledWith("/summary");
  });

  it("cierra el modal al confirmar", () => {
    renderPage();
    fireEvent.click(screen.getAllByText("💳 Pagar con tarjeta de crédito")[0]);
    fireEvent.click(screen.getByText("Confirmar modal"));
    expect(screen.queryByTestId("checkout-modal")).not.toBeInTheDocument();
  });
});

describe("ProductPage — Sin productos", () => {
  it("muestra 0 productos disponibles con lista vacía", () => {
    renderPage([]);
    expect(screen.getByText("0 productos disponibles")).toBeInTheDocument();
  });
});
