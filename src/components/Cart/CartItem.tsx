import React from "react";
import { CartItem as CartItemType } from "../../types";
import { useShop } from "../../context/ShopContext";

interface Props {
  items: CartItemType[];
}

// BUG SHF-06: List items rendered with key={index} instead of a stable identifier.
// When an item is removed from the middle of the cart, React uses index-based keys
// and reconciles incorrectly — the wrong item's input state (quantity field, checkbox)
// may be preserved on the wrong row, leading to silent UI corruption.
export function CartItemList({ items }: Props) {
  const { removeFromCart, updateQuantity } = useShop();

  return (
    <ul className="cart-item-list">
      {items.map((item, index) => (
        // BUG SHF-06: Should be key={`${item.productId}-${item.variantId}`}
        <li key={index} className="cart-item">
          <div className="cart-item__info">
            <span className="cart-item__name">{item.name}</span>
            {item.variantId && (
              <span className="cart-item__variant">Variant: {item.variantId}</span>
            )}
          </div>
          <div className="cart-item__controls">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, item.variantId, Number(e.target.value))
              }
              className="cart-item__qty"
            />
            <span className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
            <button
              onClick={() => removeFromCart(item.productId, item.variantId)}
              className="cart-item__remove"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
