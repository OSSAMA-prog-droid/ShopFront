import React, { useState } from "react";
import { Product, ProductVariant } from "../../types";
import { useCartSync } from "../../hooks/useCart";
import { usePriceUpdates } from "../../hooks/usePriceUpdates";

interface Props {
  product: Product;
  userId: string | null;
}

// BUG SHF-08: Product description is rendered with dangerouslySetInnerHTML.
// If the description contains a script tag or an onerror attribute injected by a
// compromised seller account or a stored-XSS vulnerability in the admin panel,
// it executes in every buyer's browser. The attack surface is the product
// description field which is often editable by third-party merchants.
export function ProductDetail({ product, userId }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  );
  const { addToCartWithSync } = useCartSync(userId);
  const { livePrice, priceChange } = usePriceUpdates(product.id);

  const displayPrice = livePrice ?? (selectedVariant?.price ?? product.price);

  function handleAdd() {
    addToCartWithSync({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      imageUrl: product.imageUrl ?? null,
    });
  }

  return (
    <div className="product-detail">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="product-detail__image" />
      )}
      <div className="product-detail__info">
        <h1 className="product-detail__name">{product.name}</h1>

        <div className="product-detail__price">
          <span>${displayPrice.toFixed(2)}</span>
          {priceChange && (
            <span className={`price-change price-change--${priceChange}`}>
              {priceChange === "up" ? "▲" : "▼"}
            </span>
          )}
        </div>

        {/* BUG SHF-08: description comes from the server and may contain malicious HTML */}
        <div
          className="product-detail__description"
          dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
        />

        {product.variants && product.variants.length > 0 && (
          <div className="product-detail__variants">
            <label htmlFor="variant-select">Variant:</label>
            <select
              id="variant-select"
              value={selectedVariant?.id ?? ""}
              onChange={(e) =>
                setSelectedVariant(
                  product.variants!.find((v) => v.id === e.target.value) ?? null
                )
              }
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.stock === 0 ? "(Out of stock)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={(selectedVariant?.stock ?? product.stock) === 0}
          className="product-detail__add-btn"
        >
          {(selectedVariant?.stock ?? product.stock) === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
