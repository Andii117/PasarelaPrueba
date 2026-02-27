import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProductPage from "./pages/ProductPage/ProductPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import SummaryPage from "./pages/SummaryPage/SummaryPage";
import PaymentStatusPage from "./pages/PaymentStatusPage/PaymentStatusPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            background: "#f8f8f8",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/status" element={<PaymentStatusPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
