import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { getServiceMeta } from "@/lib/serviceMeta";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const meta = getServiceMeta(product.name || "");

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stockQuantity <= 0) {
      toast.error(">> OUT OF STOCK", { className: "pixel-toast" });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrls?.[0] || null,
      serviceColor: meta.color,
    });
    toast.success(`>> ${product.name.toUpperCase()} ADDED!`, {
      className: "pixel-toast",
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div
      className="pixel-card crt-overlay animate-pixel-in flex flex-col"
      style={{ borderColor: meta.color + "66", background: meta.bg }}
    >
      {/* Service Header */}
      <div
        className="p-5 flex flex-col items-center justify-center min-h-28 relative"
        style={{ borderBottom: `2px solid ${meta.color}33` }}
      >
        {/* Icon */}
        <div
          className="text-5xl mb-2 font-pixel"
          style={{ color: meta.color, textShadow: `0 0 20px ${meta.glow}` }}
        >
          {meta.icon}
        </div>
        {/* Service Label */}
        <div
          className="font-pixel text-[9px] tracking-widest"
          style={{ color: meta.color }}
        >
          {meta.label}
        </div>
        {/* Stock badge */}
        <div className="absolute top-2 right-2">
          {product.stockQuantity > 0 ? (
            <span className="status-badge text-[var(--pixel-green)] border-[var(--pixel-green)] text-[6px]">
              IN STOCK
            </span>
          ) : (
            <span className="status-badge text-[var(--pixel-red)] border-[var(--pixel-red)] text-[6px]">
              SOLD OUT
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-pixel text-[9px] text-[var(--pixel-white)] leading-relaxed line-clamp-2 min-h-[30px]">
          {product.name}
        </h3>
        {product.categoryName && (
          <span className="font-vt323 text-[var(--pixel-gray)] text-sm">
            [{product.categoryName}]
          </span>
        )}
        <div
          className="font-pixel text-base mt-auto"
          style={{ color: meta.color, textShadow: `0 0 8px ${meta.glow}` }}
        >
          {formatPrice(product.price)}
        </div>
      </div>

      {/* Actions */}
      <div
        className="p-3 flex gap-2 border-t-2"
        style={{ borderColor: meta.color + "33" }}
      >
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity <= 0}
          className="pixel-btn flex-1 flex items-center justify-center gap-1 text-[7px] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ color: meta.color, borderColor: meta.color }}
        >
          <ShoppingCart size={11} />
          BUY
        </button>
        <Link to={`/products/${product.id}`} className="no-underline">
          <button
            className="pixel-btn flex items-center justify-center gap-1 text-[7px] px-3"
            style={{
              color: "var(--pixel-white)",
              borderColor: "var(--pixel-border)",
            }}
          >
            <Eye size={11} />
          </button>
        </Link>
      </div>
    </div>
  );
}
