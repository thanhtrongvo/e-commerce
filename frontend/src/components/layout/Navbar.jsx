import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Settings, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="border-b-4 border-[var(--pixel-border)] bg-[var(--pixel-dark)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group no-underline">
          <div className="w-10 h-10 border-2 border-[var(--pixel-cyan)] flex items-center justify-center bg-[var(--pixel-black)]">
            <Zap size={18} className="text-[var(--pixel-cyan)]" />
          </div>
          <div>
            <div className="font-pixel text-[10px] text-[var(--pixel-cyan)] animate-glow tracking-widest">
              PIXEL
            </div>
            <div className="font-pixel text-[8px] text-[var(--pixel-amber)]">
              STORE
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="font-vt323 text-xl text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)] transition-colors no-underline"
          >
            [HOME]
          </Link>
          <Link
            to="/products"
            className="font-vt323 text-xl text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)] transition-colors no-underline"
          >
            [SHOP]
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-orders"
              className="font-vt323 text-xl text-[var(--pixel-white)] hover:text-[var(--pixel-cyan)] transition-colors no-underline"
            >
              [MY ORDERS]
            </Link>
          )}
          {isAuthenticated && isAdmin() && (
            <Link
              to="/admin"
              className="font-vt323 text-xl text-[var(--pixel-green)] hover:text-[var(--pixel-amber)] transition-colors no-underline"
            >
              [ADMIN]
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 border-2 border-[var(--pixel-border)] hover:border-[var(--pixel-amber)] transition-colors group no-underline"
          >
            <ShoppingCart
              size={20}
              className="text-[var(--pixel-white)] group-hover:text-[var(--pixel-amber)]"
            />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--pixel-amber)] text-[var(--pixel-black)] font-pixel text-[7px] flex items-center justify-center border border-[var(--pixel-black)]">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-2 border-2 border-[var(--pixel-border)] hover:border-[var(--pixel-cyan)] transition-colors"
              >
                <User size={18} className="text-[var(--pixel-cyan)]" />
                <span className="font-pixel text-[8px] text-[var(--pixel-cyan)] hidden sm:block">
                  {user?.username?.substring(0, 8)}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--pixel-dark)] border-2 border-[var(--pixel-cyan)] z-50">
                  <div className="px-3 py-2 border-b border-[var(--pixel-border)]">
                    <p className="font-pixel text-[8px] text-[var(--pixel-cyan)]">
                      {user?.username}
                    </p>
                    <p className="font-vt323 text-sm text-[var(--pixel-gray)] mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/my-orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 font-pixel text-[8px] text-[var(--pixel-white)] hover:bg-[var(--pixel-border)] no-underline"
                  >
                    <ShoppingCart size={12} /> MY ORDERS
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 font-pixel text-[8px] text-[var(--pixel-green)] hover:bg-[var(--pixel-border)] no-underline"
                    >
                      <Settings size={12} /> ADMIN
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 font-pixel text-[8px] text-[var(--pixel-red)] hover:bg-[var(--pixel-border)] w-full text-left"
                  >
                    <LogOut size={12} /> LOGOUT
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="pixel-btn pixel-btn-cyan font-pixel text-[8px]">
                LOGIN
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
