import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentStatusPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const isApproved = state?.status === "APPROVED";

  const goHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const timer = setTimeout(goHome, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.icon}>{isApproved ? "✅" : "❌"}</div>

      <h2
        style={{ ...styles.title, color: isApproved ? "#00C853" : "#F44336" }}
      >
        {isApproved ? "¡Pago exitoso!" : "Pago rechazado"}
      </h2>

      <p style={styles.message}>
        {isApproved
          ? "Tu pedido fue confirmado. Recibirás tu producto en la dirección indicada."
          : "No se pudo procesar el pago. Verifica los datos e intenta nuevamente."}
      </p>

      {state?.transactionId && (
        <div style={styles.txBox}>
          <span style={styles.txLabel}>ID de transacción</span>
          <span style={styles.txId}>{state.transactionId}</span>
        </div>
      )}

      <p style={styles.redirect}>Redirigiendo al inicio en 6 segundos...</p>

      <button
        style={{
          ...styles.button,
          background: isApproved ? "#3D5AFE" : "#F44336",
        }}
        onClick={goHome}
      >
        Volver al inicio
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    padding: 32,
    textAlign: "center",
    boxSizing: "border-box",
  },
  icon: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 24, marginBottom: 12 },
  message: { color: "#555", fontSize: 15, lineHeight: 1.6, marginBottom: 20 },
  txBox: {
    background: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  txLabel: { display: "block", fontSize: 12, color: "#999", marginBottom: 4 },
  txId: { fontSize: 14, fontWeight: "bold", color: "#333" },
  redirect: { color: "#aaa", fontSize: 13, marginBottom: 20 },
  button: {
    padding: "12px 32px",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    minHeight: 44,
  },
};

export default PaymentStatusPage;
