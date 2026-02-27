import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { setTransaction } from "../store/slices/transactionSlice";
import { decrementStock } from "../store/slices/productSlice";

const BASE_FEE = 3000;
const DELIVERY_FEE = 8000;

const SummaryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const checkout = useSelector((state: RootState) => state.checkout);
  const [loading, setLoading] = useState(false);

  const total = checkout.productPrice + BASE_FEE + DELIVERY_FEE;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(
        setTransaction({ transactionId: "TXN-FAKE-001", status: "APPROVED" }),
      );
      dispatch(decrementStock(checkout.productId));
      navigate("/status", {
        state: { status: "APPROVED", transactionId: "TXN-FAKE-001" },
      });
    }, 2000);
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.panel}>
        <h2 style={styles.title}>Resumen de pago</h2>

        <p style={styles.productLabel}>{checkout.productName}</p>

        <div style={styles.row}>
          <span>Producto</span>
          <span>${checkout.productPrice.toLocaleString()} COP</span>
        </div>
        <div style={styles.row}>
          <span>Tarifa base</span>
          <span>${BASE_FEE.toLocaleString()} COP</span>
        </div>
        <div style={styles.row}>
          <span>Tarifa de envío</span>
          <span>${DELIVERY_FEE.toLocaleString()} COP</span>
        </div>

        <div style={styles.divider} />

        <div style={{ ...styles.row, fontWeight: "bold", fontSize: 18 }}>
          <span>Total</span>
          <span>${total.toLocaleString()} COP</span>
        </div>

        <button
          style={{ ...styles.payButton, opacity: loading ? 0.7 : 1 }}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "⏳ Procesando..." : "✅ Confirmar pago"}
        </button>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/checkout")}
          disabled={loading}
        >
          ← Modificar datos
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "flex-end",
  },
  panel: {
    background: "#fff",
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
    borderRadius: "16px 16px 0 0",
    padding: 24,
    boxSizing: "border-box",
  },
  title: { fontSize: 20, marginBottom: 4 },
  productLabel: { fontSize: 13, color: "#888", marginBottom: 16 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: 15,
  },
  divider: { borderTop: "1px solid #eee", margin: "12px 0" },
  payButton: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    background: "#00C853",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 12,
    minHeight: 44,
  },
  backBtn: {
    width: "100%",
    padding: 12,
    fontSize: 14,
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
    color: "#555",
    minHeight: 44,
  },
};

export default SummaryPage;
