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
  const [countdown, setCountdown] = useState(15);

  const rawStatus = state?.status;
  const statusString =
    typeof rawStatus === "object" ? rawStatus.status : rawStatus || "ERROR";

  const rawId = state?.transactionId;
  const idString = typeof rawId === "object" ? rawId.id : rawId || "N/A";

  const isApproved = statusString === "APPROVED";
  const isPending = statusString === "PENDING";

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

  const getStatusText = () => {
    if (isApproved) return "¡Pago aprobado!";
    if (isPending) return "Pago pendiente";
    return "Pago rechazado o fallido";
  };

  return (
    <div className={styles.page}>
      <div
        className={`${styles.header} ${
          isApproved
            ? styles.headerApproved
            : isPending
              ? styles.headerPending
              : styles.headerRejected
        }`}
      >
        <div className={styles.iconCircle}>
          <span className={styles.icon}>
            {isApproved ? "✓" : isPending ? "⏳" : "✕"}
          </span>
        </div>
        <h1 className={styles.headerTitle}>{getStatusText()}</h1>
        <p className={styles.headerSubtitle}>
          {isApproved
            ? "Tu compra fue procesada exitosamente"
            : isPending
              ? "Tu banco está procesando la solicitud"
              : "No pudimos completar la transacción"}
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
                  : isPending
                    ? styles.statusBadgePending
                    : styles.statusBadgeRejected
              }`}
            >
              ● {String(statusString)}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>ID Transacción</span>
            <span className={styles.detailValue}>{String(idString)}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Fecha</span>
            <span className={styles.detailValue}>
              {new Date().toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "2-digit",
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
          <p className={styles.messageText}>
            {isApproved
              ? "📦 Tu pedido está confirmado. El stock ha sido actualizado y recibirás un correo con los detalles."
              : isPending
                ? "🕒 Estamos esperando la confirmación final de Wompi. Esto puede tardar unos minutos."
                : "⚠️ Hubo un problema con el pago. Verifica los datos e intenta de nuevo o usa otro medio."}
          </p>
        </div>

        <p className={styles.countdown}>
          Volviendo al inicio en <strong>{countdown}</strong> segundos...
        </p>

        <div className={styles.actions}>
          <button className={styles.button} onClick={goHome}>
            Finalizar y volver
          </button>

          {!isApproved && !isPending && (
            <button className={styles.retryButton} onClick={() => navigate(-1)}>
              ← Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
