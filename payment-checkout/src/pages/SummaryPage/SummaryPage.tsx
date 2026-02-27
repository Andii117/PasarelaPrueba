import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { setTransaction } from "../../store/slices/transactionSlice";
import { decrementStock } from "../../store/slices/productSlice";
import styles from "./SummaryPage.module.css";

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
    <div className={styles.backdrop}>
      <div className={styles.panel}>
        <h2 className={styles.title}>Resumen de pago</h2>

        <p className={styles.productLabel}>{checkout.productName}</p>

        <div className={styles.row}>
          <span>Producto</span>
          <span>${checkout.productPrice.toLocaleString()} COP</span>
        </div>
        <div className={styles.row}>
          <span>Tarifa base</span>
          <span>${BASE_FEE.toLocaleString()} COP</span>
        </div>
        <div className={styles.row}>
          <span>Tarifa de envío</span>
          <span>${DELIVERY_FEE.toLocaleString()} COP</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.rowTotal}>
          <span>Total</span>
          <span>${total.toLocaleString()} COP</span>
        </div>

        <button
          className={styles.payButton}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "⏳ Procesando..." : "✅ Confirmar pago"}
        </button>

        <button
          className={styles.backBtn}
          onClick={() => navigate("/checkout")}
          disabled={loading}
        >
          Modificar datos
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;
