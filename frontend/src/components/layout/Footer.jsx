export default function Footer() {
  return (
    <footer className="border-t-4 border-[var(--pixel-border)] bg-[var(--pixel-dark)] mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="font-pixel text-[10px] text-[var(--pixel-cyan)] mb-3 animate-glow">
          ★ PIXEL STORE ★
        </div>
        <p className="font-vt323 text-lg text-[var(--pixel-gray)]">
          // DIGITAL ACCOUNTS MARKETPLACE // POWERED BY JAVA &amp; REACT //
        </p>
        <div className="flex justify-center gap-6 mt-4">
          {["NETFLIX", "SPOTIFY", "YOUTUBE", "GOOGLE"].map((s) => (
            <span
              key={s}
              className="font-pixel text-[7px] text-[var(--pixel-border)] hover:text-[var(--pixel-amber)] cursor-pointer transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 font-pixel text-[7px] text-[var(--pixel-border)]">
          © 2026 PIXEL STORE. INSERT COIN TO CONTINUE.
        </div>
      </div>
    </footer>
  );
}
