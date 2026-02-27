import React from "react";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const navigate = useNavigate();

  const product = {
    name: "Producto de prueba",
    description: "Esta es una descripción del producto de prueba.",
    price: 50000,
    imageUrl: "https://via.placeholder.com/390x220",
  };
  const stock = 5;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nuestra Tienda</h1>
      <img src={product.imageUrl} alt={product.name} style={styles.image} />
      <div style={styles.card}>
        <h2 style={styles.productName}>{product.name}</h2>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.row}>
          <span style={styles.price}>
            ${product.price.toLocaleString()} COP
          </span>
          <span style={styles.stock}>Stock: {stock} unidades</span>
        </div>
        {stock > 0 ? (
          <button style={styles.button} onClick={() => navigate("/checkout")}>
            💳 Pagar con tarjeta de crédito
          </button>
        ) : (
          <div style={styles.outOfStock}>Producto agotado</div>
        )}
      </div>
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
  title: { textAlign: "center", fontSize: 22, marginBottom: 16 },
  image: { width: "100%", borderRadius: 12, objectFit: "cover", height: 220 },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  productName: { fontSize: 20, margin: "0 0 8px" },
  description: { color: "#666", fontSize: 14, lineHeight: 1.5 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "12px 0",
  },
  price: { fontSize: 20, fontWeight: "bold", color: "#1a1a1a" },
  stock: { fontSize: 13, color: "#888" },
  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    background: "#3D5AFE",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    minHeight: 44,
  },
  outOfStock: {
    textAlign: "center",
    color: "red",
    padding: 12,
    fontWeight: "bold",
  },
};

export default ProductPage;
