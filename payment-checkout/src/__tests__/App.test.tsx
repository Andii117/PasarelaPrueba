import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// Mock de las páginas para aislar el test de App
jest.mock("../pages/ProductPage/ProductPage", () => () => (
  <div>ProductPage</div>
));
jest.mock("../pages/SummaryPage/SummaryPage", () => () => (
  <div>SummaryPage</div>
));
jest.mock("../pages/PaymentStatusPage/PaymentStatusPage", () => () => (
  <div>PaymentStatusPage</div>
));

describe("App", () => {
  it("renderiza sin errores", () => {
    render(<App />);
    expect(screen.getByText("ProductPage")).toBeInTheDocument();
  });

  it("muestra ProductPage en la ruta /", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByText("ProductPage")).toBeInTheDocument();
  });

  it("muestra SummaryPage en la ruta /summary", () => {
    window.history.pushState({}, "", "/summary");
    render(<App />);
    expect(screen.getByText("SummaryPage")).toBeInTheDocument();
  });

  it("muestra PaymentStatusPage en la ruta /status", () => {
    window.history.pushState({}, "", "/status");
    render(<App />);
    expect(screen.getByText("PaymentStatusPage")).toBeInTheDocument();
  });

  it("redirige a / en rutas desconocidas", () => {
    window.history.pushState({}, "", "/ruta-inexistente");
    render(<App />);
    expect(screen.getByText("ProductPage")).toBeInTheDocument();
  });

  it("aplica los estilos base al contenedor principal", () => {
    const { container } = render(<App />);
    const div = container.querySelector("div");
    expect(div).toHaveStyle({
      fontFamily: "Inter, sans-serif",
      background: "#f8f8f8",
      minHeight: "100vh",
    });
  });
});
