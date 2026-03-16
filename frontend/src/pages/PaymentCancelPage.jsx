import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center animate-pixel-in">
      <div className="pixel-card p-8 border-[var(--pixel-amber)] crt-overlay">
        <div className="font-pixel text-[var(--pixel-amber)] text-[30px] mb-4">
          ✕
        </div>
        <div className="font-pixel text-[10px] text-[var(--pixel-amber)] mb-2">
          PAYMENT CANCELLED
        </div>
        <div className="font-vt323 text-xl text-[var(--pixel-gray)] mb-6">
          Your payment was cancelled. Your cart items are still saved.
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/checkout")}
            className="pixel-btn pixel-btn-amber font-pixel text-[7px]"
          >
            TRY AGAIN
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="pixel-btn pixel-btn-white font-pixel text-[7px]"
          >
            BACK TO CART
          </button>
          <button
            onClick={() => navigate("/")}
            className="pixel-btn pixel-btn-cyan font-pixel text-[7px]"
          >
            SHOP MORE
          </button>
        </div>
      </div>
    </div>
  );
}
