import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { useShop } from "../../context/ShopContext";
import { useCartSync } from "../../hooks/useCart";

interface Props {
  product: Product;
  userId: string | null;
}

export function ProductCard({ product, userId }: Props) {
  const { addToCartWithSync } = useCartSync(userId);

  function handleAdd() {
    addToCartWithSync({
      productId: product.id,
      variantId: null,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl ?? null,
    });
  }

  return (
    <div className="product-card">
      {product.imageUrl && (
        <Link to={`/products/${product.id}`}>
          <img src={product.imageUrl} alt={product.name} className="product-card__image" />
        </Link>
      )}
      <div className="product-card__body">
        <Link to={`/products/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
        {product.stock === 0 ? (
          <span className="product-card__oos">Out of stock</span>
        ) : (
          <button onClick={handleAdd} className="product-card__add-btn">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
