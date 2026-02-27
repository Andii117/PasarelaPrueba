import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { resetCheckout, setFormData } from "../../store/slices/checkoutSlice";
import { resetTransaction } from "../../store/slices/transactionSlice";
import type { Product } from "../../types";
import styles from "./ProductPage.module.css";

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
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>🛒 Mi Tienda</h1>
        <span className={styles.headerSub}>
          {products.length} productos disponibles
        </span>
      </div>
      <div className={styles.container}>
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
    <div className={styles.card}>
      {isLowStock && (
        <div className={styles.badgeLowStock}>
          ¡Solo quedan {product.stock}!
        </div>
      )}
      {isOutOfStock && <div className={styles.badgeOutOfStock}>Agotado</div>}

      <div className={styles.imageWrapper}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`${styles.image} ${isOutOfStock ? styles.imageOutOfStock : ""}`}
        />
      </div>

      <div className={styles.cardBody}>
        <h2 className={styles.productName}>{product.name}</h2>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.shipping}>
          🚚 <span className={styles.shippingText}>Envío gratis</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            ${product.price.toLocaleString("es-CO")}
          </span>
          <span className={styles.currency}>COP</span>
        </div>

        <p className={styles.installments}>
          en 3 cuotas de $
          {Math.round(product.price / 3).toLocaleString("es-CO")} COP sin
          interés
        </p>

        <div className={styles.stockRow}>
          <div
            className={`${styles.stockDot} ${
              isOutOfStock
                ? styles.stockDotOut
                : isLowStock
                  ? styles.stockDotLow
                  : styles.stockDotAvailable
            }`}
          />
          <span
            className={`${styles.stockText} ${
              isOutOfStock
                ? styles.stockTextOut
                : isLowStock
                  ? styles.stockTextLow
                  : styles.stockTextAvailable
            }`}
          >
            {isOutOfStock
              ? "Sin stock disponible"
              : isLowStock
                ? `¡Solo ${product.stock} disponibles!`
                : `${product.stock} unidades disponibles`}
          </span>
        </div>

        <button
          className={`${styles.button} ${
            isOutOfStock ? styles.buttonDisabled : styles.buttonAvailable
          }`}
          onClick={() => !isOutOfStock && onBuy(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Sin stock" : "💳 Pagar con tarjeta de crédito"}
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
