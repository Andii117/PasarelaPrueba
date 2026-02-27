import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { resetCheckout, setFormData } from "../store/slices/checkoutSlice";
import { resetTransaction } from "../store/slices/transactionSlice";
import type { Product } from "../types";

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
  }, [dispatch]);

  const handleBuy = (product: Product) => {
    dispatch(
      setFormData({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
      }),
    );
    navigate("/checkout");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🛒 Mi Tienda</h1>
        <span style={styles.headerSub}>
          {products.length} productos disponibles
        </span>
      </div>

      {/* Lista de productos */}
      <div style={styles.container}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  onBuy,
}: {
  product: Product;
  onBuy: (p: Product) => void;
}) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div style={styles.card}>
      {/* Badge de stock bajo */}
      {isLowStock && (
        <div style={styles.badgeLowStock}>¡Solo quedan {product.stock}!</div>
      )}
      {isOutOfStock && <div style={styles.badgeOutOfStock}>Agotado</div>}

      {/* Imagen */}
      <div style={styles.imageWrapper}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            ...styles.image,
            filter: isOutOfStock ? "grayscale(100%)" : "none",
          }}
        />
      </div>

      {/* Contenido */}
      <div style={styles.cardBody}>
        {/* Nombre */}
        <h2 style={styles.productName}>{product.name}</h2>

        {/* Descripción */}
        <p style={styles.description}>{product.description}</p>

        {/* Envío gratis */}
        <div style={styles.shipping}>
          🚚 <span style={styles.shippingText}>Envío gratis</span>
        </div>

        {/* Precio */}
        <div style={styles.priceRow}>
          <span style={styles.price}>
            ${product.price.toLocaleString("es-CO")}
          </span>
          <span style={styles.currency}>COP</span>
        </div>

        {/* Cuotas */}
        <p style={styles.installments}>
          en 3 cuotas de $
          {Math.round(product.price / 3).toLocaleString("es-CO")} COP sin
          interés
        </p>

        {/* Stock */}
        <div style={styles.stockRow}>
          <div
            style={{
              ...styles.stockDot,
              background: isOutOfStock
                ? "#ccc"
                : isLowStock
                  ? "#FF6F00"
                  : "#00C853",
            }}
          />
          <span
            style={{
              ...styles.stockText,
              color: isOutOfStock ? "#999" : isLowStock ? "#FF6F00" : "#00C853",
            }}
          >
            {isOutOfStock
              ? "Sin stock disponible"
              : isLowStock
                ? `¡Solo ${product.stock} disponibles!`
                : `${product.stock} unidades disponibles`}
          </span>
        </div>

        {/* Botón */}
        <button
          style={{
            ...styles.button,
            background: isOutOfStock ? "#e0e0e0" : "#3D5AFE",
            color: isOutOfStock ? "#999" : "#fff",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
          }}
          onClick={() => !isOutOfStock && onBuy(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Sin stock" : "💳 Pagar con tarjeta de crédito"}
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
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    margin: 0,
  },
  headerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    background: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  cardBody: {
    padding: "14px 16px 16px",
  },
  badgeLowStock: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#FF6F00",
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: 4,
    zIndex: 1,
  },
  badgeOutOfStock: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#999",
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: 4,
    zIndex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    margin: "0 0 6px",
    lineHeight: 1.3,
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.5,
    margin: "0 0 10px",
  },
  shipping: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  shippingText: {
    color: "#00A650",
    fontSize: 13,
    fontWeight: "500",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 2,
  },
  price: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
  },
  currency: {
    fontSize: 14,
    color: "#666",
  },
  installments: {
    fontSize: 12,
    color: "#00A650",
    margin: "0 0 10px",
  },
  stockRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: "13px 0",
    fontSize: 15,
    fontWeight: "600",
    border: "none",
    borderRadius: 6,
    marginBottom: 8,
    minHeight: 44,
    transition: "opacity 0.2s",
  },
  buttonSecondary: {
    width: "100%",
    padding: "12px 0",
    fontSize: 14,
    fontWeight: "500",
    border: "1.5px solid #3D5AFE",
    borderRadius: 6,
    background: "transparent",
    color: "#3D5AFE",
    cursor: "pointer",
    minHeight: 44,
  },
};

export default ProductPage;
