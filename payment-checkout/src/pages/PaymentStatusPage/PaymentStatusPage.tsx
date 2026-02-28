import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCheckout } from "../../store/slices/checkoutSlice";
import { resetTransaction } from "../../store/slices/transactionSlice";
import styles from "./PaymentStatusPage.module.css";

const PaymentStatusPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(10);

  const isApproved = state?.status === "APPROVED";

  const goHome = () => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
    navigate("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          goHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <div
        className={`${styles.header} ${
          isApproved ? styles.headerApproved : styles.headerRejected
        }`}
      >
        <div className={styles.iconCircle}>
          <span className={styles.icon}>{isApproved ? "✓" : "✕"}</span>
        </div>
        <h1 className={styles.headerTitle}>
          {isApproved ? "¡Pago aprobado!" : "Pago rechazado"}
        </h1>
        <p className={styles.headerSubtitle}>
          {isApproved
            ? "Tu compra fue procesada exitosamente"
            : "No pudimos procesar tu pago"}
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Detalle de la transacción</h2>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estado</span>
            <span
              className={`${styles.statusBadge} ${
                isApproved
                  ? styles.statusBadgeApproved
                  : styles.statusBadgeRejected
              }`}
            >
              {isApproved ? "● Aprobado" : "● Rechazado"}
            </span>
          </div>

          <div className={styles.divider} />

          {state?.transactionId && (
            <>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>ID Transacción</span>
                <span className={styles.detailValue}>
                  {state.transactionId}
                </span>
              </div>
              <div className={styles.divider} />
            </>
          )}

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Fecha</span>
            <span className={styles.detailValue}>
              {new Date().toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Método de pago</span>
            <span className={styles.detailValue}>💳 Tarjeta de crédito</span>
          </div>
        </div>

        <div
          className={`${styles.messageCard} ${
            isApproved ? styles.messageCardApproved : styles.messageCardRejected
          }`}
        >
          <p
            className={`${styles.messageText} ${
              isApproved
                ? styles.messageTextApproved
                : styles.messageTextRejected
            }`}
          >
            {isApproved
              ? "📦 Tu pedido está confirmado. Recibirás tu producto en la dirección indicada en los próximos días hábiles."
              : "⚠️ Verifica que los datos de tu tarjeta sean correctos e intenta nuevamente. Si el problema persiste contacta a tu banco."}
          </p>
        </div>

        <p className={styles.countdown}>
          Volviendo al inicio en <strong>{countdown}</strong> segundos...
        </p>

        <button
          className={`${styles.button} ${
            isApproved ? styles.buttonApproved : styles.buttonRejected
          }`}
          onClick={goHome}
        >
          Volver al inicio
        </button>

        {!isApproved && (
          <button
            className={styles.retryButton}
            onClick={() => navigate("/checkout")}
          >
            ← Reintentar pago
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusPage;
