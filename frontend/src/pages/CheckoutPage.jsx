import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { getServiceMeta } from "@/lib/serviceMeta";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  if (items.length === 0 && !done) {
    navigate("/cart");
    return null;
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        shippingAddress: address,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      setDone(data.data);
      toast.success(">> ORDER PLACED!", { className: "pixel-toast" });
    } catch (err) {
      toast.error(">> " + (err.response?.data?.message || "ORDER FAILED"), {
        className: "pixel-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-pixel-in">
        <div className="pixel-card p-8 border-[var(--pixel-green)] pixel-border-green crt-overlay">
          <div className="font-pixel text-[var(--pixel-green)] text-[30px] mb-4 animate-glow">
            ✓
          </div>
          <div className="font-pixel text-[10px] text-[var(--pixel-green)] mb-2">
            ORDER CONFIRMED!
          </div>
          <div className="font-vt323 text-xl text-[var(--pixel-gray)] mb-1">
            Order #: {done.orderNumber}
          </div>
          <div className="font-vt323 text-xl text-[var(--pixel-white)] mb-6">
            Total: {formatPrice(done.totalAmount)}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/my-orders")}
              className="pixel-btn pixel-btn-green font-pixel text-[7px]"
            >
              MY ORDERS
            </button>
            <button
              onClick={() => navigate("/")}
              className="pixel-btn pixel-btn-white font-pixel text-[7px]"
            >
              SHOP MORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pixel-in">
      <div className="font-pixel text-[10px] text-[var(--pixel-amber)] mb-6">
        ▸ CHECKOUT
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Order items summary */}
        <div className="pixel-card p-4 space-y-2">
          <div className="font-pixel text-[7px] text-[var(--pixel-gray)] mb-3">
            // ORDER SUMMARY
          </div>
          {items.map((item) => {
            const meta = getServiceMeta(item.name);
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 py-1 border-b border-[var(--pixel-border)]"
              >
                <span
                  className="font-pixel text-base"
                  style={{ color: meta.color }}
                >
                  {meta.icon}
                </span>
                <span className="font-vt323 text-lg text-[var(--pixel-white)] flex-1 truncate">
                  {item.name}
                </span>
                <span className="font-vt323 text-base text-[var(--pixel-gray)]">
                  ×{item.quantity}
                </span>
                <span
                  className="font-vt323 text-base"
                  style={{ color: meta.color }}
                >
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            );
          })}
          <div className="flex justify-between pt-2">
            <span className="font-pixel text-[8px] text-[var(--pixel-gray)]">
              TOTAL
            </span>
            <span className="font-pixel text-[10px] text-[var(--pixel-green)]">
              {formatPrice(total())}
            </span>
          </div>
        </div>

        {/* Shipping form */}
        <form
          onSubmit={handleOrder}
          className="pixel-card p-4 flex flex-col gap-4"
        >
          <div className="font-pixel text-[7px] text-[var(--pixel-gray)]">
            // DELIVERY INFO
          </div>
          <div>
            <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
              SHIPPING ADDRESS:
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              placeholder="Enter your full delivery address..."
              className="pixel-input resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="pixel-btn pixel-btn-solid-green font-pixel text-[8px] py-3 disabled:opacity-50"
          >
            {loading ? ">> PLACING ORDER..." : ">> CONFIRM ORDER"}
          </button>
        </form>
      </div>
    </div>
  );
}
