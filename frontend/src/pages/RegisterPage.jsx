import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("PASSWORDS DO NOT MATCH");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success(">> REGISTERED! PLEASE LOGIN.", {
        className: "pixel-toast",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "REGISTRATION FAILED");
    } finally {
      setLoading(false);
    }
  };

  const f = (k) => ({
    value: form[k],
    onChange: (e) => setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="pixel-card crt-overlay border-[var(--pixel-magenta)] pixel-border-magenta">
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b-2 border-[var(--pixel-magenta)]"
            style={{ background: "var(--pixel-magenta)" }}
          >
            <div className="w-3 h-3 bg-[var(--pixel-black)]" />
            <span className="font-pixel text-[8px] text-[var(--pixel-black)]">
              NEW_PLAYER.EXE
            </span>
          </div>

          <div className="p-6">
            <div className="font-pixel text-[7px] text-[var(--pixel-magenta)] mb-6 space-y-1">
              <div>{">"} CREATE NEW PLAYER PROFILE</div>
              <div>
                {">"} FILL ALL FIELDS<span className="animate-blink">_</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                {
                  label: "USERNAME",
                  key: "username",
                  type: "text",
                  ph: "player_one",
                },
                {
                  label: "EMAIL",
                  key: "email",
                  type: "email",
                  ph: "player@domain.com",
                },
                {
                  label: "PASSWORD",
                  key: "password",
                  type: "password",
                  ph: "••••••••",
                },
                {
                  label: "CONFIRM PASSWORD",
                  key: "confirmPassword",
                  type: "password",
                  ph: "••••••••",
                },
              ].map(({ label, key, type, ph }) => (
                <div key={key}>
                  <label className="font-pixel text-[7px] text-[var(--pixel-gray)] block mb-1">
                    {label}:
                  </label>
                  <input
                    type={type}
                    className="pixel-input"
                    placeholder={ph}
                    required
                    {...f(key)}
                  />
                </div>
              ))}

              {error && (
                <div className="font-pixel text-[7px] text-[var(--pixel-red)] p-2 border border-[var(--pixel-red)]">
                  ✗ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn pixel-btn-solid-magenta w-full font-pixel text-[8px] py-3 disabled:opacity-50"
              >
                {loading ? ">> PROCESSING..." : ">> CREATE ACCOUNT"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="font-pixel text-[7px] text-[var(--pixel-gray)]">
                HAVE ACCOUNT?{" "}
              </span>
              <Link
                to="/login"
                className="font-pixel text-[7px] text-[var(--pixel-cyan)] no-underline"
              >
                [LOGIN]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
