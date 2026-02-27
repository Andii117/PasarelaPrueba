import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCheckout } from "../store/slices/checkoutSlice";
import { resetTransaction } from "../store/slices/transactionSlice";

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
    <div style={styles.page}>
      {/* Header */}
      <div
        style={{
          ...styles.header,
          background: isApproved ? "#00A650" : "#F44336",
        }}
      >
        <div style={styles.iconCircle}>
          <span style={styles.icon}>{isApproved ? "✓" : "✕"}</span>
        </div>
        <h1 style={styles.headerTitle}>
          {isApproved ? "¡Pago aprobado!" : "Pago rechazado"}
        </h1>
        <p style={styles.headerSubtitle}>
          {isApproved
            ? "Tu compra fue procesada exitosamente"
            : "No pudimos procesar tu pago"}
        </p>
      </div>

      <div style={styles.container}>
        {/* Card de detalle */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Detalle de la transacción</h2>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Estado</span>
            <span
              style={{
                ...styles.statusBadge,
                background: isApproved ? "#E8F5E9" : "#FFEBEE",
                color: isApproved ? "#00A650" : "#F44336",
              }}
            >
              {isApproved ? "● Aprobado" : "● Rechazado"}
            </span>
          </div>

          <div style={styles.divider} />

          {state?.transactionId && (
            <>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>ID Transacción</span>
                <span style={styles.detailValue}>{state.transactionId}</span>
              </div>
              <div style={styles.divider} />
            </>
          )}

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Fecha</span>
            <span style={styles.detailValue}>
              {new Date().toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Método de pago</span>
            <span style={styles.detailValue}>💳 Tarjeta de crédito</span>
          </div>
        </div>

        {/* Mensaje según estado */}
        <div
          style={{
            ...styles.messageCard,
            background: isApproved ? "#E8F5E9" : "#FFEBEE",
            borderLeft: `4px solid ${isApproved ? "#00A650" : "#F44336"}`,
          }}
        >
          <p
            style={{
              ...styles.messageText,
              color: isApproved ? "#2E7D32" : "#C62828",
            }}
          >
            {isApproved
              ? "📦 Tu pedido está confirmado. Recibirás tu producto en la dirección indicada en los próximos días hábiles."
              : "⚠️ Verifica que los datos de tu tarjeta sean correctos e intenta nuevamente. Si el problema persiste contacta a tu banco."}
          </p>
        </div>

        {/* Countdown */}
        <p style={styles.countdown}>
          Volviendo al inicio en <strong>{countdown}</strong> segundos...
        </p>

        {/* Botón principal */}
        <button
          style={{
            ...styles.button,
            background: isApproved ? "#3D5AFE" : "#F44336",
          }}
          onClick={goHome}
        >
          Volver al inicio
        </button>

        {/* Botón reintentar si falló */}
        {!isApproved && (
          <button
            style={styles.retryButton}
            onClick={() => navigate("/checkout")}
          >
            ← Reintentar pago
          </button>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#ebebeb",
    minHeight: "100vh",
    paddingBottom: 32,
  },
  header: {
    padding: "32px 20px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 38,
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    margin: "0 0 8px",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    margin: 0,
  },
  container: {
    maxWidth: 480,
    margin: "-20px auto 0",
    padding: "0 12px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    background: "#fff",
    borderRadius: 8,
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    margin: "0 0 14px",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: 20,
  },
  divider: {
    borderTop: "1px solid #f0f0f0",
  },
  messageCard: {
    borderRadius: 8,
    padding: "14px 16px",
  },
  messageText: {
    fontSize: 13,
    margin: 0,
    lineHeight: 1.6,
  },
  countdown: {
    textAlign: "center",
    fontSize: 13,
    color: "#999",
    margin: "4px 0",
  },
  button: {
    width: "100%",
    padding: "15px 0",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    minHeight: 44,
  },
  retryButton: {
    width: "100%",
    padding: "13px 0",
    fontSize: 14,
    fontWeight: "500",
    background: "transparent",
    border: "1.5px solid #F44336",
    borderRadius: 8,
    color: "#F44336",
    cursor: "pointer",
    minHeight: 44,
  },
};

export default PaymentStatusPage;
