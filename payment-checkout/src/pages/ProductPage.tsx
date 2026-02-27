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
    <div style={styles.container}>
      <h1 style={styles.title}>Nuestra Tienda</h1>
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={styles.image}
            />
            <div style={styles.cardBody}>
              <h2 style={styles.productName}>{product.name}</h2>
              <p style={styles.description}>{product.description}</p>
              <div style={styles.row}>
                <span style={styles.price}>
                  ${product.price.toLocaleString()} COP
                </span>
                <span
                  style={{
                    ...styles.stock,
                    color:
                      product.stock === 0
                        ? "red"
                        : product.stock <= 5
                          ? "#FF6F00"
                          : "#888",
                  }}
                >
                  {product.stock === 0 ? "Agotado" : `Stock: ${product.stock}`}
                </span>
              </div>
              <button
                style={{
                  ...styles.button,
                  background: product.stock === 0 ? "#ccc" : "#3D5AFE",
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                }}
                onClick={() => product.stock > 0 && handleBuy(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Sin stock" : "💳 Comprar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 420,
    margin: "0 auto",
    padding: 16,
    boxSizing: "border-box",
  },
  title: { textAlign: "center", fontSize: 22, marginBottom: 16 },
  grid: { display: "flex", flexDirection: "column", gap: 16 },
  card: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  image: { width: "100%", height: 200, objectFit: "cover" },
  cardBody: { padding: 16 },
  productName: { fontSize: 17, margin: "0 0 6px", fontWeight: "bold" },
  description: {
    color: "#666",
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  price: { fontSize: 18, fontWeight: "bold", color: "#1a1a1a" },
  stock: { fontSize: 12 },
  button: {
    width: "100%",
    padding: 12,
    fontSize: 15,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    minHeight: 44,
  },
};

export default ProductPage;
