// Shared pixel loading skeleton
export function PixelSkeleton({ rows = 1, className = "" }) {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-[var(--pixel-border)] opacity-40"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="pixel-card animate-pulse">
      <div className="h-28 bg-[var(--pixel-border)] opacity-20" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-[var(--pixel-border)] opacity-30 w-3/4" />
        <div className="h-3 bg-[var(--pixel-border)] opacity-20 w-1/2" />
        <div className="h-5 bg-[var(--pixel-border)] opacity-30 w-1/3 mt-4" />
      </div>
      <div className="p-3 border-t-2 border-[var(--pixel-border)] flex gap-2">
        <div className="h-8 flex-1 bg-[var(--pixel-border)] opacity-20" />
        <div className="h-8 w-10 bg-[var(--pixel-border)] opacity-20" />
      </div>
    </div>
  );
}

// Status badge for orders
const STATUS_COLORS = {
  PENDING: { color: "var(--pixel-amber)", label: "⏳ PENDING" },
  CONFIRMED: { color: "var(--pixel-cyan)", label: "✓ CONFIRMED" },
  PROCESSING: { color: "var(--pixel-cyan)", label: "⚙ PROCESSING" },
  SHIPPED: { color: "#00e5ff", label: "📦 SHIPPED" },
  DELIVERED: { color: "var(--pixel-green)", label: "✓ DELIVERED" },
  CANCELLED: { color: "var(--pixel-red)", label: "✗ CANCELLED" },
  REFUNDED: { color: "var(--pixel-magenta)", label: "↩ REFUNDED" },
};

export function OrderStatusBadge({ status }) {
  const s = STATUS_COLORS[status] || {
    color: "var(--pixel-gray)",
    label: status,
  };
  return (
    <span
      className="status-badge text-[8px]"
      style={{ color: s.color, borderColor: s.color }}
    >
      {s.label}
    </span>
  );
}
