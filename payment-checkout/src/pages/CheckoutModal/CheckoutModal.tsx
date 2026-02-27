import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setFormData, setStep } from "../../store/slices/checkoutSlice";
import { FaCcVisa } from "react-icons/fa";
import styles from "./CheckoutModal.module.css";

const detectBrand = (number: string): "VISA" | "MASTERCARD" | "" => {
  if (/^4/.test(number)) return "VISA";
  if (/^5[1-5]/.test(number)) return "MASTERCARD";
  return "";
};

interface CheckoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const CheckoutModal = ({ onClose, onConfirm }: CheckoutModalProps) => {
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

  const handleChange = (key: keyof typeof form, value: string) => {
    let finalValue = value;
    if (key === "cardExpiry") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 2) {
        finalValue = digits;
      } else {
        finalValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      }
    }
    const updated = { ...form, [key]: finalValue };
    setForm(updated);
    dispatch(setFormData(updated));
  };

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
    dispatch(setFormData(form));
    dispatch(setStep(3));
    onConfirm();
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type = "text",
    placeholder = "",
  ) => (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        className={`${styles.input} ${errors[key] ? styles.inputError : ""}`}
        onChange={(e) => handleChange(key, e.target.value)}
      />
      {errors[key] && <span className={styles.errorText}>⚠ {errors[key]}</span>}
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Finalizar compra</h1>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.container}>
          <div className={styles.productSummary}>
            <div className={styles.productSummaryLeft}>
              <span className={styles.productSummaryIcon}>🛍️</span>
              <div>
                <p className={styles.productSummaryName}>{saved.productName}</p>
                <p className={styles.productSummaryPrice}>
                  ${saved.productPrice.toLocaleString("es-CO")} COP
                </p>
              </div>
            </div>
            <span className={styles.productSummaryBadge}>x1</span>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📦</span>
              <h2 className={styles.sectionTitle}>Datos de entrega</h2>
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

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>💳</span>
              <h2 className={styles.sectionTitle}>Tarjeta de crédito</h2>
              {brand === "VISA" && (
                <FaCcVisa
                  className={`${styles.brandIcon} ${styles.brandIconVisa}`}
                />
              )}
              {brand === "MASTERCARD" && (
                <svg
                  className={styles.brandIconMastercard}
                  viewBox="0 0 38 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="38" height="24" rx="4" fill="white" />
                  <circle cx="15" cy="12" r="7" fill="#EB001B" />
                  <circle cx="23" cy="12" r="7" fill="#F79E1B" />
                  <path
                    d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z"
                    fill="#FF5F00"
                  />
                </svg>
              )}
            </div>
            {field(
              "Número de tarjeta",
              "cardNumber",
              "tel",
              "0000 0000 0000 0000",
            )}
            <div className={styles.row}>
              <div className={styles.rowItem}>
                {field("Vencimiento", "cardExpiry", "text", "MM/AA")}
              </div>
              <div className={styles.rowItem}>
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

          <div className={styles.securityInfo}>
            <span>🔒</span>
            <p className={styles.securityText}>
              Tus datos están protegidos. La información de tu tarjeta es
              tokenizada y nunca se almacena.
            </p>
          </div>

          <button className={styles.continueBtn} onClick={handleContinue}>
            Confirmar compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
