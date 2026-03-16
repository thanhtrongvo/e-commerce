import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      const d = data.data;
      login(
        { username: d.username, email: d.email, roles: d.roles },
        d.accessToken,
        d.refreshToken,
      );
      toast.success(">> LOGIN SUCCESS!", { className: "pixel-toast" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "INVALID CREDENTIALS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="pixel-card crt-overlay border-[var(--pixel-green)] pixel-border-green">
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b-2 border-[var(--pixel-green)]"
            style={{ background: "var(--pixel-green)" }}
          >
            <div className="w-3 h-3 bg-[var(--pixel-black)] border border-[var(--pixel-black)]" />
            <span className="font-pixel text-[8px] text-[var(--pixel-black)]">
              PIXEL_LOGIN.EXE
            </span>
          </div>

          <div className="p-6">
            {/* Boot text */}
            <div className="font-pixel text-[7px] text-[var(--pixel-green)] mb-6 space-y-1">
              <div>{">"} PIXEL STORE v1.0</div>
              <div>{">"} AUTHENTICATE USER...</div>
              <div>
                {">"} ENTER CREDENTIALS<span className="animate-blink">_</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                  USERNAME:
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="pixel-input"
                  placeholder="enter username..."
                  required
                />
              </div>
              <div>
                <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                  PASSWORD:
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="pixel-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="font-pixel text-[7px] text-[var(--pixel-red)] p-2 border border-[var(--pixel-red)]">
                  ✗ ERROR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn pixel-btn-solid-green w-full font-pixel text-[8px] py-3 disabled:opacity-50"
              >
                {loading ? ">> AUTHENTICATING..." : ">> LOGIN"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="font-pixel text-[7px] text-[var(--pixel-gray)]">
                NO ACCOUNT?{" "}
              </span>
              <Link
                to="/register"
                className="font-pixel text-[7px] text-[var(--pixel-cyan)] no-underline"
              >
                [REGISTER]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
