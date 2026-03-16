import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { OrderStatusBadge, PixelSkeleton } from "@/components/ui/PixelUI";
import { getServiceMeta } from "@/lib/serviceMeta";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Layers,
  Plus,
  Trash2,
  Edit2,
  X,
  UserCheck,
  UserX,
  TrendingUp,
  DollarSign,
  Box,
  RefreshCw,
} from "lucide-react";

const TABS = [
  { key: "OVERVIEW", label: "OVERVIEW", icon: BarChart3 },
  { key: "PRODUCTS", label: "PRODUCTS", icon: Package },
  { key: "CATEGORIES", label: "CATEGORIES", icon: Layers },
  { key: "ORDERS", label: "ORDERS", icon: ShoppingCart },
  { key: "USERS", label: "USERS", icon: Users },
];

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState("OVERVIEW");

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) navigate("/");
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-screen">
      {/* ── Sidebar + Content Layout ── */}
      <div className="flex">
        {/* ─ Sidebar ─ */}
        <aside className="w-56 min-h-[calc(100vh-52px)] border-r-4 border-[var(--pixel-border)] bg-[var(--pixel-dark)] hidden md:block sticky top-[52px] self-start">
          <div className="p-4 border-b-2 border-[var(--pixel-border)]">
            <div className="font-pixel text-[8px] text-[var(--pixel-green)] animate-glow">
              ★ ADMIN
            </div>
            <div className="font-pixel text-[7px] text-[var(--pixel-gray)] mt-1">
              CONTROL PANEL
            </div>
          </div>
          <nav className="py-2">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-pixel text-[7px] transition-all text-left
                  ${
                    tab === key
                      ? "bg-[var(--pixel-cyan)] text-[var(--pixel-black)] border-l-4 border-[var(--pixel-black)]"
                      : "text-[var(--pixel-gray)] hover:bg-[var(--pixel-border)] hover:text-[var(--pixel-white)]"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ─ Mobile Tabs ─ */}
        <div className="md:hidden w-full border-b-2 border-[var(--pixel-border)] bg-[var(--pixel-dark)] flex overflow-x-auto sticky top-[52px] z-40">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1 px-3 py-2 font-pixel text-[6px] whitespace-nowrap
                ${tab === key ? "text-[var(--pixel-cyan)] border-b-2 border-[var(--pixel-cyan)]" : "text-[var(--pixel-gray)]"}`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* ─ Content ─ */}
        <main className="flex-1 p-6 animate-pixel-in max-w-full overflow-x-hidden">
          {tab === "OVERVIEW" && <OverviewTab />}
          {tab === "PRODUCTS" && <ProductsTab />}
          {tab === "CATEGORIES" && <CategoriesTab />}
          {tab === "ORDERS" && <OrdersTab />}
          {tab === "USERS" && <UsersTab />}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   OVERVIEW TAB — Stats + recent orders
   ═══════════════════════════════════════════ */
function OverviewTab() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, ordRes, userRes] = await Promise.all([
          api.get("/products", { params: { size: 1 } }),
          api.get("/orders"),
          api.get("/users", { params: { size: 1 } }),
        ]);
        const orders = ordRes.data.data || [];
        const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        setStats({
          products: prodRes.data.data?.totalElements || 0,
          orders: orders.length,
          users: userRes.data.data?.totalElements || 0,
          revenue,
        });
        setRecentOrders(orders.slice(0, 8));
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  if (loading) return <PixelSkeleton rows={8} />;

  const cards = [
    {
      label: "TOTAL PRODUCTS",
      value: stats.products,
      icon: Box,
      color: "var(--pixel-cyan)",
      glow: "rgba(0,229,255,0.3)",
    },
    {
      label: "TOTAL ORDERS",
      value: stats.orders,
      icon: ShoppingCart,
      color: "var(--pixel-amber)",
      glow: "rgba(255,184,0,0.3)",
    },
    {
      label: "TOTAL USERS",
      value: stats.users,
      icon: Users,
      color: "var(--pixel-magenta)",
      glow: "rgba(255,0,255,0.3)",
    },
    {
      label: "REVENUE",
      value: fmt(stats.revenue),
      icon: DollarSign,
      color: "var(--pixel-green)",
      glow: "rgba(57,255,20,0.3)",
    },
  ];

  return (
    <>
      <div className="font-pixel text-[10px] text-[var(--pixel-cyan)] mb-6">
        ▸ DASHBOARD OVERVIEW
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, glow }) => (
          <div
            key={label}
            className="pixel-card p-5 border-2 crt-overlay"
            style={{
              borderColor: color,
              boxShadow: `0 0 15px ${glow}, inset 0 0 10px ${glow}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Icon size={20} style={{ color }} />
              <TrendingUp size={12} style={{ color }} />
            </div>
            <div
              className="font-pixel text-[16px] mb-1"
              style={{ color, textShadow: `0 0 8px ${glow}` }}
            >
              {value}
            </div>
            <div className="font-pixel text-[6px] text-[var(--pixel-gray)]">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="pixel-card border-[var(--pixel-border)]">
        <div className="px-4 py-3 border-b-2 border-[var(--pixel-border)] flex items-center justify-between">
          <span className="font-pixel text-[8px] text-[var(--pixel-gray)]">
            // RECENT ORDERS
          </span>
          <span className="font-pixel text-[7px] text-[var(--pixel-cyan)]">
            {recentOrders.length} SHOWN
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--pixel-border)]">
                {["ORDER #", "USER", "STATUS", "TOTAL", "DATE"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left font-pixel text-[6px] text-[var(--pixel-gray)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-[var(--pixel-border)] hover:bg-[var(--pixel-border)] transition-colors"
                >
                  <td className="px-4 py-2 font-pixel text-[7px] text-[var(--pixel-cyan)]">
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-2 font-vt323 text-[var(--pixel-white)]">
                    {o.username || "—"}
                  </td>
                  <td className="px-4 py-2">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-2 font-vt323 text-[var(--pixel-green)]">
                    {fmt(o.totalAmount)}
                  </td>
                  <td className="px-4 py-2 font-vt323 text-[var(--pixel-gray)] text-sm">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center font-pixel text-[8px] text-[var(--pixel-gray)]"
                  >
                    NO ORDERS YET
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   PRODUCTS TAB
   ═══════════════════════════════════════════ */
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        api.get("/products", { params: { size: 100 } }),
        api.get("/categories"),
      ]);
      setProducts(p.data.data?.content || []);
      setCategories(c.data.data?.content || c.data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fmt = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: +form.price,
      stockQuantity: +form.stockQuantity,
      categoryId: form.categoryId || null,
    };
    try {
      if (editId) await api.put(`/products/${editId}`, payload);
      else await api.post("/products", payload);
      toast.success(editId ? ">> PRODUCT UPDATED" : ">> PRODUCT CREATED", {
        className: "pixel-toast",
      });
      resetForm();
      load();
    } catch (err) {
      toast.error(">> " + (err.response?.data?.message || "ERROR"), {
        className: "pixel-toast",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("DELETE THIS PRODUCT?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success(">> DELETED", { className: "pixel-toast" });
      load();
    } catch {
      toast.error(">> FAILED", { className: "pixel-toast" });
    }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stockQuantity: p.stockQuantity,
      categoryId: p.categoryId || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <PixelSkeleton rows={6} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="font-pixel text-[10px] text-[var(--pixel-cyan)]">
          ▸ PRODUCTS ({products.length})
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={`pixel-btn font-pixel text-[7px] flex items-center gap-1 ${showForm ? "pixel-btn-red" : "pixel-btn-solid-green"}`}
        >
          {showForm ? (
            <>
              <X size={10} /> CANCEL
            </>
          ) : (
            <>
              <Plus size={10} /> NEW PRODUCT
            </>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="pixel-card p-5 border-[var(--pixel-green)] pixel-border-green mb-6 animate-pixel-in">
          <div className="font-pixel text-[7px] text-[var(--pixel-gray)] mb-4">
            {editId ? `// EDITING PRODUCT #${editId}` : "// CREATE NEW PRODUCT"}
          </div>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-3">
            {[
              ["NAME", "name", "text"],
              ["PRICE (VND)", "price", "number"],
              ["STOCK QTY", "stockQuantity", "number"],
            ].map(([lbl, key, type]) => (
              <div key={key}>
                <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                  {lbl}:
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="pixel-input"
                  required
                />
              </div>
            ))}
            <div>
              <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                CATEGORY:
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoryId: e.target.value }))
                }
                className="pixel-input"
              >
                <option value="">-- NONE --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                DESCRIPTION:
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="pixel-input resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="pixel-btn pixel-btn-solid-green font-pixel text-[7px]"
              >
                {editId ? ">> UPDATE" : ">> CREATE"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="pixel-btn pixel-btn-white font-pixel text-[7px]"
                >
                  [CANCEL]
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="pixel-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[var(--pixel-border)]">
              {["", "ID", "NAME", "PRICE", "STOCK", "CATEGORY", "ACTIONS"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-pixel text-[6px] text-[var(--pixel-gray)]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const meta = getServiceMeta(p.name);
              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--pixel-border)] hover:bg-[var(--pixel-border)] transition-colors"
                >
                  <td className="px-3 py-2">
                    <span className="text-lg" style={{ color: meta.color }}>
                      {meta.icon}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-vt323 text-[var(--pixel-gray)]">
                    #{p.id}
                  </td>
                  <td className="px-3 py-2 font-vt323 text-[var(--pixel-white)] max-w-48 truncate">
                    {p.name}
                  </td>
                  <td className="px-3 py-2 font-vt323 text-[var(--pixel-green)]">
                    {fmt(p.price)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`font-pixel text-[8px] ${p.stockQuantity > 0 ? "text-[var(--pixel-green)]" : "text-[var(--pixel-red)]"}`}
                    >
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-vt323 text-[var(--pixel-gray)]">
                    {p.categoryName || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 text-[var(--pixel-amber)] hover:bg-[var(--pixel-amber)] hover:text-[var(--pixel-black)] transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-[var(--pixel-red)] hover:bg-[var(--pixel-red)] hover:text-[var(--pixel-black)] transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-6 text-center font-pixel text-[8px] text-[var(--pixel-gray)]">
            NO PRODUCTS
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   CATEGORIES TAB
   ═══════════════════════════════════════════ */
function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data?.content || data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/categories/${editId}`, form);
      else await api.post("/categories", form);
      toast.success(editId ? ">> CATEGORY UPDATED" : ">> CATEGORY CREATED", {
        className: "pixel-toast",
      });
      resetForm();
      load();
    } catch (err) {
      toast.error(">> " + (err.response?.data?.message || "ERROR"), {
        className: "pixel-toast",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("DELETE THIS CATEGORY?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success(">> DELETED", { className: "pixel-toast" });
      load();
    } catch {
      toast.error(">> FAILED", { className: "pixel-toast" });
    }
  };

  if (loading) return <PixelSkeleton rows={4} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="font-pixel text-[10px] text-[var(--pixel-cyan)]">
          ▸ CATEGORIES ({categories.length})
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={`pixel-btn font-pixel text-[7px] flex items-center gap-1 ${showForm ? "pixel-btn-red" : "pixel-btn-solid-amber"}`}
        >
          {showForm ? (
            <>
              <X size={10} /> CANCEL
            </>
          ) : (
            <>
              <Plus size={10} /> NEW CATEGORY
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="pixel-card p-5 border-[var(--pixel-amber)] pixel-border-amber mb-6 animate-pixel-in">
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                NAME:
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="pixel-input"
                required
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                DESCRIPTION:
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                className="pixel-input resize-none"
              />
            </div>
            <button
              type="submit"
              className="pixel-btn pixel-btn-solid-amber font-pixel text-[7px]"
            >
              {editId ? ">> UPDATE" : ">> CREATE"}
            </button>
          </form>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="pixel-card p-4 border-[var(--pixel-amber)] flex items-start justify-between group"
          >
            <div>
              <div className="font-pixel text-[9px] text-[var(--pixel-amber)] mb-1">
                {c.name}
              </div>
              <div className="font-vt323 text-[var(--pixel-gray)] text-base">
                /{c.slug || "—"}
              </div>
              {c.description && (
                <div className="font-vt323 text-[var(--pixel-white)] text-sm mt-1">
                  {c.description}
                </div>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditId(c.id);
                  setForm({ name: c.name, description: c.description || "" });
                  setShowForm(true);
                }}
                className="p-1 text-[var(--pixel-amber)] hover:bg-[var(--pixel-amber)] hover:text-[var(--pixel-black)] transition-colors"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1 text-[var(--pixel-red)] hover:bg-[var(--pixel-red)] hover:text-[var(--pixel-black)] transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-10 font-pixel text-[8px] text-[var(--pixel-gray)]">
            NO CATEGORIES
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   ORDERS TAB
   ═══════════════════════════════════════════ */
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fmt = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success(`>> STATUS → ${status}`, { className: "pixel-toast" });
      load();
    } catch {
      toast.error(">> FAILED", { className: "pixel-toast" });
    }
  };

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <PixelSkeleton rows={6} />;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="font-pixel text-[10px] text-[var(--pixel-cyan)]">
          ▸ ORDERS ({orders.length})
        </div>
        <button
          onClick={load}
          className="pixel-btn pixel-btn-white font-pixel text-[6px] flex items-center gap-1"
        >
          <RefreshCw size={10} /> REFRESH
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        {["ALL", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-pixel text-[6px] px-2 py-1 border transition-colors
              ${filter === s ? "bg-[var(--pixel-cyan)] text-[var(--pixel-black)] border-[var(--pixel-cyan)]" : "text-[var(--pixel-gray)] border-[var(--pixel-border)] hover:text-[var(--pixel-white)]"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="pixel-card border-[var(--pixel-border)]"
          >
            <div
              className="p-4 flex flex-wrap items-center gap-3 cursor-pointer hover:bg-[var(--pixel-border)] transition-colors"
              onClick={() =>
                setExpanded(expanded === order.id ? null : order.id)
              }
            >
              <span className="font-pixel text-[8px] text-[var(--pixel-cyan)]">
                {order.orderNumber}
              </span>
              <span className="font-vt323 text-[var(--pixel-gray)]">
                {order.username || "—"}
              </span>
              <OrderStatusBadge status={order.status} />
              <span className="font-pixel text-[9px] text-[var(--pixel-green)] ml-auto">
                {fmt(order.totalAmount)}
              </span>
              <span className="font-pixel text-[7px] text-[var(--pixel-gray)]">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                  : "—"}
              </span>
              <span className="font-pixel text-[8px] text-[var(--pixel-gray)]">
                {expanded === order.id ? "▲" : "▼"}
              </span>
            </div>

            {expanded === order.id && (
              <div className="border-t-2 border-[var(--pixel-border)] p-4 animate-pixel-in">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-pixel text-[7px] text-[var(--pixel-gray)]">
                    📍 {order.shippingAddress || "N/A"}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="font-pixel text-[6px] text-[var(--pixel-gray)]">
                      SET STATUS:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="pixel-input w-auto text-[14px] py-1"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {order.items?.map((item) => {
                  const meta = getServiceMeta(item.productName);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-1.5 border-b border-[var(--pixel-border)]"
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
                      <span className="font-vt323 text-[var(--pixel-gray)]">
                        ×{item.quantity}
                      </span>
                      <span
                        className="font-vt323"
                        style={{ color: meta.color }}
                      >
                        {fmt(item.subtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 font-pixel text-[8px] text-[var(--pixel-gray)]">
            NO ORDERS
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   USERS TAB
   ═══════════════════════════════════════════ */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", { params: { page, size: 20 } });
      setUsers(data.data?.content || []);
      setTotalPages(data.data?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      toast.success(">> STATUS TOGGLED", { className: "pixel-toast" });
      load();
    } catch {
      toast.error(">> FAILED", { className: "pixel-toast" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("DELETE USER?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success(">> DELETED", { className: "pixel-toast" });
      load();
    } catch {
      toast.error(">> FAILED", { className: "pixel-toast" });
    }
  };

  if (loading) return <PixelSkeleton rows={6} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="font-pixel text-[10px] text-[var(--pixel-cyan)]">
          ▸ USERS
        </div>
        <button
          onClick={load}
          className="pixel-btn pixel-btn-white font-pixel text-[6px] flex items-center gap-1"
        >
          <RefreshCw size={10} /> REFRESH
        </button>
      </div>

      <div className="pixel-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[var(--pixel-border)]">
              {[
                "ID",
                "USERNAME",
                "EMAIL",
                "ROLES",
                "STATUS",
                "JOINED",
                "ACTIONS",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-pixel text-[6px] text-[var(--pixel-gray)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[var(--pixel-border)] hover:bg-[var(--pixel-border)] transition-colors"
              >
                <td className="px-3 py-2 font-vt323 text-[var(--pixel-gray)]">
                  #{u.id}
                </td>
                <td className="px-3 py-2 font-pixel text-[8px] text-[var(--pixel-cyan)]">
                  {u.username}
                </td>
                <td className="px-3 py-2 font-vt323 text-[var(--pixel-white)]">
                  {u.email || "—"}
                </td>
                <td className="px-3 py-2">
                  {(u.roles || []).map((r) => (
                    <span
                      key={r.name || r}
                      className={`status-badge text-[6px] mr-1 ${
                        (r.name || r) === "ROLE_ADMIN"
                          ? "text-[var(--pixel-green)] border-[var(--pixel-green)]"
                          : "text-[var(--pixel-gray)] border-[var(--pixel-gray)]"
                      }`}
                    >
                      {(r.name || r).replace("ROLE_", "")}
                    </span>
                  ))}
                </td>
                <td className="px-3 py-2">
                  {u.active !== undefined && (
                    <span
                      className={`status-badge text-[6px] ${u.active ? "text-[var(--pixel-green)] border-[var(--pixel-green)]" : "text-[var(--pixel-red)] border-[var(--pixel-red)]"}`}
                    >
                      {u.active ? "● ACTIVE" : "○ INACTIVE"}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 font-vt323 text-[var(--pixel-gray)] text-sm">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleActive(u.id)}
                      className="p-1.5 text-[var(--pixel-amber)] hover:bg-[var(--pixel-amber)] hover:text-[var(--pixel-black)] transition-colors"
                      title={u.active ? "Deactivate" : "Activate"}
                    >
                      {u.active ? <UserX size={12} /> : <UserCheck size={12} />}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-[var(--pixel-red)] hover:bg-[var(--pixel-red)] hover:text-[var(--pixel-black)] transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-6 text-center font-pixel text-[8px] text-[var(--pixel-gray)]">
            NO USERS
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
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
    </>
  );
}
