import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const detectBrand = (number: string): "VISA" | "MASTERCARD" | "" => {
  if (/^4/.test(number)) return "VISA";
  if (/^5[1-5]/.test(number)) return "MASTERCARD";
  return "";
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
    deliveryName: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const brand = detectBrand(form.cardNumber.replace(/\s/g, ""));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const clean = form.cardNumber.replace(/\s/g, "");
    if (clean.length !== 16 || !/^\d+$/.test(clean))
      e.cardNumber = "Debe tener 16 dígitos numéricos";
    if (!form.cardHolder.trim()) e.cardHolder = "Nombre requerido";
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry))
      e.cardExpiry = "Formato: MM/AA";
    if (form.cardCvv.length < 3)
      e.cardCvv = "CVV debe tener al menos 3 dígitos";
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
    navigate("/summary");
  };

  const field = (
    placeholder: string,
    key: keyof typeof form,
    type = "text",
  ) => (
    <div style={styles.fieldGroup}>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        style={{ ...styles.input, borderColor: errors[key] ? "red" : "#ddd" }}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {errors[key] && <span style={styles.error}>{errors[key]}</span>}
    </div>
  );

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.back}>
        ← Volver
      </button>

      <h2>Datos de pago</h2>

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

      <h3 style={styles.sectionTitle}>Tarjeta de crédito</h3>
      {field("Número de tarjeta (16 dígitos)", "cardNumber", "tel")}
      {field("Nombre del titular", "cardHolder")}
      {field("Vencimiento MM/AA", "cardExpiry")}
      {field("CVV", "cardCvv", "password")}

      <h3 style={styles.sectionTitle}>Datos de entrega</h3>
      {field("Nombre completo", "deliveryName")}
      {field("Dirección", "deliveryAddress")}
      {field("Ciudad", "deliveryCity")}
      {field("Teléfono", "deliveryPhone", "tel")}

      <button style={styles.button} onClick={handleContinue}>
        Continuar →
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 390,
    margin: "0 auto",
    padding: 16,
    boxSizing: "border-box",
  },
  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#3D5AFE",
    marginBottom: 8,
    padding: 0,
  },
  sectionTitle: { fontSize: 16, marginTop: 20, marginBottom: 8, color: "#333" },
  fieldGroup: { marginBottom: 12 },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  error: { color: "red", fontSize: 12, marginTop: 4, display: "block" },
  brandBadge: {
    display: "inline-block",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: 6,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    background: "#3D5AFE",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
    minHeight: 44,
  },
};

export default CheckoutPage;
