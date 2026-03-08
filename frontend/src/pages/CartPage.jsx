import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { getServiceMeta } from "@/lib/serviceMeta";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const total = useCartStore((s) => s.total());
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="font-pixel text-[var(--pixel-gray)] text-[10px] mb-4">
          ◈ CART IS EMPTY
        </div>
        <div className="font-vt323 text-xl text-[var(--pixel-gray)] mb-6">
          {">"} INSERT COIN TO START SHOPPING
        </div>
        <Link to="/">
          <button className="pixel-btn pixel-btn-cyan font-pixel text-[8px]">
            [BROWSE SHOP]
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pixel-in">
      <div className="font-pixel text-[10px] text-[var(--pixel-cyan)] mb-6">
        ▸ SHOPPING CART ({items.length} ITEMS)
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item) => {
          const meta = getServiceMeta(item.name);
          return (
            <div
              key={item.id}
              className="pixel-card p-4 flex items-center gap-4"
              style={{ borderColor: meta.color + "55" }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center font-pixel text-2xl flex-shrink-0"
                style={{ color: meta.color, background: meta.bg }}
              >
                {meta.icon}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-pixel text-[8px] text-[var(--pixel-white)] truncate">
                  {item.name}
                </div>
                <div
                  className="font-vt323 text-base mt-1"
                  style={{ color: meta.color }}
                >
                  {formatPrice(item.price)} × {item.quantity} ={" "}
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
              {/* Qty controls */}
              <div className="flex items-center border-2 border-[var(--pixel-border)] flex-shrink-0">
                <button
                  className="px-2 py-1 font-pixel text-[10px] text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)]"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="px-3 font-pixel text-[9px] text-[var(--pixel-white)]">
                  {item.quantity}
                </span>
                <button
                  className="px-2 py-1 font-pixel text-[10px] text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)]"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-[var(--pixel-red)] hover:bg-[var(--pixel-red)] hover:text-[var(--pixel-black)] transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pixel-card p-5 border-[var(--pixel-cyan)] pixel-border-cyan">
        <div className="flex justify-between items-center mb-4">
          <span className="font-pixel text-[8px] text-[var(--pixel-gray)]">
            TOTAL:
          </span>
          <span className="font-pixel text-[14px] text-[var(--pixel-cyan)]">
            {formatPrice(total)}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="pixel-btn pixel-btn-red font-pixel text-[7px] flex items-center gap-1"
          >
            <Trash2 size={10} /> CLEAR
          </button>
          <button
            onClick={handleCheckout}
            className="pixel-btn pixel-btn-solid-green flex-1 font-pixel text-[8px] flex items-center justify-center gap-2"
          >
            CHECKOUT <ArrowRight size={12} />
          </button>
        </div>
        {!isAuthenticated && (
          <p className="font-pixel text-[7px] text-[var(--pixel-amber)] mt-3 text-center">
            {">"} YOU MUST LOGIN TO CHECKOUT
          </p>
        )}
      </div>
    </div>
  );
}
