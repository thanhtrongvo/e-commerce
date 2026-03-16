import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { OrderStatusBadge, PixelSkeleton } from "@/components/ui/PixelUI";
import { getServiceMeta } from "@/lib/serviceMeta";
import api from "@/lib/api";

export default function MyOrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    api
      .get("/orders/my-orders", { params: { page, size: 10 } })
      .then(({ data }) => {
        setOrders(data.data?.content || []);
        setTotalPages(data.data?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, page, navigate]);

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PixelSkeleton rows={8} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pixel-in">
      <div className="font-pixel text-[10px] text-[var(--pixel-amber)] mb-6">
        ▸ MY ORDERS
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="font-pixel text-[var(--pixel-gray)] text-[10px] mb-2">
            ◈ NO ORDERS YET
          </div>
          <button
            onClick={() => navigate("/")}
            className="pixel-btn pixel-btn-cyan font-pixel text-[7px] mt-4"
          >
            [START SHOPPING]
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="pixel-card border-[var(--pixel-border)]"
            >
              {/* Header row */}
              <div
                className="p-4 flex flex-wrap items-center gap-3 cursor-pointer hover:bg-[var(--pixel-border)] transition-colors"
                onClick={() =>
                  setExpanded(expanded === order.id ? null : order.id)
                }
              >
                <div className="font-pixel text-[8px] text-[var(--pixel-cyan)]">
                  {order.orderNumber}
                </div>
                <OrderStatusBadge status={order.status} />
                <div className="font-vt323 text-lg text-[var(--pixel-green)] ml-auto">
                  {formatPrice(order.totalAmount)}
                </div>
                <div className="font-pixel text-[7px] text-[var(--pixel-gray)]">
                  {formatDate(order.createdAt)}
                </div>
                <span className="font-pixel text-[8px] text-[var(--pixel-gray)]">
                  {expanded === order.id ? "▲" : "▼"}
                </span>
              </div>

              {/* Expanded items */}
              {expanded === order.id && (
                <div className="border-t-2 border-[var(--pixel-border)] p-4 space-y-2">
                  <div className="font-pixel text-[7px] text-[var(--pixel-gray)] mb-2">
                    📍 {order.shippingAddress}
                  </div>
                  {order.items?.map((item) => {
                    const meta = getServiceMeta(item.productName);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-1 border-b border-[var(--pixel-border)]"
                      >
                        <span
                          className="font-pixel text-lg"
                          style={{ color: meta.color }}
                        >
                          {meta.icon}
                        </span>
                        <span className="font-vt323 text-lg text-[var(--pixel-white)] flex-1">
                          {item.productName}
                        </span>
                        <span className="font-vt323 text-base text-[var(--pixel-gray)]">
                          ×{item.quantity}
                        </span>
                        <span
                          className="font-vt323 text-base"
                          style={{ color: meta.color }}
                        >
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="pixel-btn pixel-btn-white font-pixel text-[7px] disabled:opacity-30"
          >
            ◀ PREV
          </button>
          <span className="font-pixel text-[8px] text-[var(--pixel-cyan)] self-center">
            {page + 1}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="pixel-btn pixel-btn-white font-pixel text-[7px] disabled:opacity-30"
          >
            NEXT ▶
          </button>
        </div>
      )}
    </div>
  );
}
