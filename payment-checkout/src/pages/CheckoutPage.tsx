import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setFormData, setStep } from "../store/slices/checkoutSlice";

const detectBrand = (number: string): "VISA" | "MASTERCARD" | "" => {
  if (/^4/.test(number)) return "VISA";
  if (/^5[1-5]/.test(number)) return "MASTERCARD";
  return "";
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector((state: RootState) => state.checkout);

  const [form, setForm] = useState({
    cardNumber: saved.cardNumber,
    cardHolder: saved.cardHolder,
    cardExpiry: saved.cardExpiry,
    cardCvv: saved.cardCvv,
    deliveryName: saved.deliveryName,
    deliveryAddress: saved.deliveryAddress,
    deliveryCity: saved.deliveryCity,
    deliveryPhone: saved.deliveryPhone,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const brand = detectBrand(form.cardNumber.replace(/\s/g, ""));

  // ── CAMBIO 1: handleChange guarda en Redux + localStorage en cada keystroke ──
  const handleChange = (key: keyof typeof form, value: string) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    dispatch(setFormData(updated)); // escribe en Redux Y localStorage
  };
  // ────────────────────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const clean = form.cardNumber.replace(/\s/g, "");
    if (clean.length !== 16 || !/^\d+$/.test(clean))
      e.cardNumber = "Debe tener 16 dígitos numéricos";
    if (!form.cardHolder.trim()) e.cardHolder = "Nombre requerido";
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry))
      e.cardExpiry = "Formato: MM/AA";
    if (form.cardCvv.length < 3) e.cardCvv = "CVV inválido";
    if (!form.deliveryName.trim()) e.deliveryName = "Nombre requerido";
    if (!form.deliveryAddress.trim()) e.deliveryAddress = "Dirección requerida";
    if (!form.deliveryCity.trim()) e.deliveryCity = "Ciudad requerida";
    if (!/^\d{7,10}$/.test(form.deliveryPhone))
      e.deliveryPhone = "Teléfono inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    dispatch(setFormData(form)); // garantiza consistencia final
    dispatch(setStep(3));
    navigate("/summary");
  };

  // ── CAMBIO 2: onChange ahora llama handleChange en lugar de setForm directo ──
  const field = (
    label: string,
    key: keyof typeof form,
    type = "text",
    placeholder = "",
  ) => (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        style={{
          ...styles.input,
          borderColor: errors[key] ? "#f44336" : "#e0e0e0",
        }}
        onChange={(e) => handleChange(key, e.target.value)} // ← CAMBIO 2
      />
      {errors[key] && <span style={styles.errorText}>⚠ {errors[key]}</span>}
    </div>
  );
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ←
        </button>
        <h1 style={styles.headerTitle}>Finalizar compra</h1>
        <div style={{ width: 32 }} />
      </div>

      <div style={styles.container}>
        <div style={styles.productSummary}>
          <div style={styles.productSummaryLeft}>
            <span style={styles.productSummaryIcon}>🛍️</span>
            <div>
              <p style={styles.productSummaryName}>{saved.productName}</p>
              <p style={styles.productSummaryPrice}>
                ${saved.productPrice.toLocaleString("es-CO")} COP
              </p>
            </div>
          </div>
          <span style={styles.productSummaryBadge}>x1</span>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📦</span>
            <h2 style={styles.sectionTitle}>Datos de entrega</h2>
          </div>
          {field("Nombre completo", "deliveryName", "text", "Ej: Juan Pérez")}
          {field(
            "Dirección",
            "deliveryAddress",
            "text",
            "Ej: Calle 10 # 43-25",
          )}
          {field("Ciudad", "deliveryCity", "text", "Ej: Medellín")}
          {field("Teléfono", "deliveryPhone", "tel", "Ej: 3001234567")}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>💳</span>
            <h2 style={styles.sectionTitle}>Tarjeta de crédito</h2>
            {brand && (
              <div
                style={{
                  ...styles.brandBadge,
                  background: brand === "VISA" ? "#1a1f71" : "#FF5F00",
                }}
              >
                {brand}
              </div>
            )}
          </div>
          {field(
            "Número de tarjeta",
            "cardNumber",
            "tel",
            "0000 0000 0000 0000",
          )}
          <div style={styles.row}>
            <div style={{ flex: 1, marginRight: 8 }}>
              {field("Vencimiento", "cardExpiry", "text", "MM/AA")}
            </div>
            <div style={{ flex: 1 }}>
              {field("CVV", "cardCvv", "password", "123")}
            </div>
          </div>
          {field(
            "Nombre del titular",
            "cardHolder",
            "text",
            "Como aparece en la tarjeta",
          )}
        </div>

        <div style={styles.securityInfo}>
          <span>🔒</span>
          <p style={styles.securityText}>
            Tus datos están protegidos. La información de tu tarjeta es
            tokenizada y nunca se almacena.
          </p>
        </div>

        <button style={styles.continueBtn} onClick={handleContinue}>
          Confirmar compra
        </button>
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
    background: "#3D5AFE",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    width: 32,
    padding: 0,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    margin: 0,
    fontWeight: "600",
  },
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  productSummary: {
    background: "#fff",
    borderRadius: 8,
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  productSummaryLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  productSummaryIcon: {
    fontSize: 28,
  },
  productSummaryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  productSummaryPrice: {
    fontSize: 15,
    color: "#3D5AFE",
    fontWeight: "600",
    margin: "2px 0 0",
  },
  productSummaryBadge: {
    background: "#f0f0f0",
    borderRadius: 4,
    padding: "2px 8px",
    fontSize: 13,
    color: "#666",
  },
  section: {
    background: "#fff",
    borderRadius: 8,
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    margin: 0,
    flex: 1,
  },
  brandBadge: {
    color: "#fff",
    padding: "3px 10px",
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 12,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    fontSize: 15,
    borderRadius: 6,
    border: "1.5px solid #e0e0e0",
    boxSizing: "border-box",
    outline: "none",
    background: "#fafafa",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    display: "block",
  },
  row: {
    display: "flex",
  },
  securityInfo: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "#E8F5E9",
    borderRadius: 8,
    padding: "12px 14px",
  },
  securityText: {
    fontSize: 12,
    color: "#2E7D32",
    margin: 0,
    lineHeight: 1.5,
  },
  continueBtn: {
    width: "100%",
    padding: "15px 0",
    fontSize: 16,
    fontWeight: "600",
    background: "#3D5AFE",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    minHeight: 44,
  },
};

export default CheckoutPage;
