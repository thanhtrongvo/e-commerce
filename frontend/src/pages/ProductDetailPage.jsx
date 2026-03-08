import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { getServiceMeta } from "@/lib/serviceMeta";
import { PixelSkeleton } from "@/components/ui/PixelUI";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <PixelSkeleton rows={6} />
      </div>
    );
  }

  if (!product) return null;

  const meta = getServiceMeta(product.name);
  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) {
      toast.error(">> OUT OF STOCK", { className: "pixel-toast" });
      return;
    }
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls?.[0] || null,
        serviceColor: meta.color,
      },
      qty,
    );
    toast.success(`>> ADDED ${qty}x ${product.name.toUpperCase()}!`, {
      className: "pixel-toast",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pixel-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-pixel text-[8px] text-[var(--pixel-gray)] hover:text-[var(--pixel-cyan)] mb-6 transition-colors"
      >
        <ArrowLeft size={12} /> BACK
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Service Visual */}
        <div
          className="pixel-card p-8 flex flex-col items-center justify-center min-h-64 crt-overlay"
          style={{ borderColor: meta.color + "88", background: meta.bg }}
        >
          <div
            className="text-8xl font-pixel mb-4"
            style={{
              color: meta.color,
              textShadow: `0 0 30px ${meta.glow}, 0 0 60px ${meta.glow}40`,
            }}
          >
            {meta.icon}
          </div>
          <div className="font-pixel text-xl" style={{ color: meta.color }}>
            {meta.label}
          </div>
          {product.imageUrls?.length > 0 && (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="mt-4 max-h-24 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-4">
          <h1 className="font-pixel text-[12px] text-[var(--pixel-white)] leading-loose">
            {product.name}
          </h1>

          {product.categoryName && (
            <span className="font-vt323 text-[var(--pixel-gray)] text-lg">
              [{product.categoryName}]
            </span>
          )}

          <div
            className="font-pixel text-2xl"
            style={{ color: meta.color, textShadow: `0 0 10px ${meta.glow}` }}
          >
            {formatPrice(product.price)}
          </div>

          {/* Stock */}
          <div
            className="flex items-center gap-2 pixel-card p-3"
            style={{ borderColor: meta.color + "44" }}
          >
            <Package size={14} style={{ color: meta.color }} />
            <span
              className="font-pixel text-[8px]"
              style={{
                color:
                  product.stockQuantity > 0
                    ? "var(--pixel-green)"
                    : "var(--pixel-red)",
              }}
            >
              {product.stockQuantity > 0
                ? `IN STOCK (${product.stockQuantity})`
                : "OUT OF STOCK"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pixel-card p-4 border-[var(--pixel-border)]">
              <div className="font-pixel text-[7px] text-[var(--pixel-gray)] mb-2">
                // DESCRIPTION
              </div>
              <p className="font-vt323 text-lg text-[var(--pixel-white)] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Qty + Add */}
          <div className="flex gap-3 mt-2">
            <div className="flex items-center border-2 border-[var(--pixel-border)]">
              <button
                className="px-3 py-2 font-pixel text-[10px] text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)]"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-4 font-pixel text-[10px] text-[var(--pixel-white)]">
                {qty}
              </span>
              <button
                className="px-3 py-2 font-pixel text-[10px] text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)]"
                onClick={() =>
                  setQty((q) => Math.min(product.stockQuantity, q + 1))
                }
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="pixel-btn flex-1 flex items-center justify-center gap-2 text-[8px] disabled:opacity-40"
              style={{ color: meta.color, borderColor: meta.color }}
            >
              <ShoppingCart size={13} /> ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
