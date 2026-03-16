import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import api from "@/lib/api";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders/my-orders", {
        params: { page: 0, size: 1 },
      });
      const orders = data.data?.content || [];
      if (orders.length > 0) {
        setOrder(orders[0]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearCart();
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      fetchOrder();
    }
  }, [clearCart, searchParams, fetchOrder]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center animate-pixel-in">
      <div className="pixel-card p-8 border-[var(--pixel-green)] pixel-border-green crt-overlay">
        <div className="font-pixel text-[var(--pixel-green)] text-[30px] mb-4 animate-glow">
          ✓
        </div>
        <div className="font-pixel text-[10px] text-[var(--pixel-green)] mb-2">
          PAYMENT SUCCESSFUL!
        </div>
        <div className="font-vt323 text-xl text-[var(--pixel-gray)] mb-1">
          Your order has been placed and payment confirmed via Stripe.
        </div>

        {!loading && order && (
          <div className="mt-4 mb-4">
            <div className="font-vt323 text-xl text-[var(--pixel-cyan)] mb-1">
              Order #: {order.orderNumber}
            </div>
            <div className="font-vt323 text-xl text-[var(--pixel-white)]">
              Total: {formatPrice(order.totalAmount)}
            </div>
          </div>
        )}

        {loading && (
          <div className="font-vt323 text-lg text-[var(--pixel-gray)] my-4 animate-pulse">
            Loading order details...
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
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
