import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/PixelUI";
import api from "@/lib/api";

const HERO_LINES = [
  "> WELCOME TO PIXEL STORE",
  "> PREMIUM ACCOUNTS. PIXEL PRICES.",
  "> ALL YOUR FAVORITE SERVICES.",
  "> INSERT COIN TO BROWSE...",
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [heroLine, setHeroLine] = useState(0);

  // Typing hero effect
  useEffect(() => {
    const t = setInterval(
      () => setHeroLine((l) => (l + 1) % HERO_LINES.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  // Load categories
  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => {
        setCategories(data.data?.content || data.data || []);
      })
      .catch(() => {});
  }, []);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (search) {
        res = await api.get("/products/search", {
          params: { name: search, page, size: 12 },
        });
      } else if (activeCategory) {
        res = await api.get(`/products/category/${activeCategory}`, {
          params: { page, size: 12 },
        });
      } else {
        res = await api.get("/products", { params: { page, size: 12 } });
      }
      const d = res.data.data;
      setProducts(d.content || []);
      setTotalPages(d.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
    setActiveCategory(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pixel-in">
      {/* ── Hero ── */}
      <section className="pixel-card crt-overlay mb-10 p-8 text-center border-[var(--pixel-cyan)] pixel-border-cyan">
        {/* ASCII banner */}
        <pre className="font-pixel text-[var(--pixel-cyan)] text-[7px] sm:text-[10px] leading-loose mb-4 overflow-hidden">
          {`██████╗ ██╗██╗  ██╗███████╗██╗     
██╔══██╗██║╚██╗██╔╝██╔════╝██║     
██████╔╝██║ ╚███╔╝ █████╗  ██║     
██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║     
██║     ██║██╔╝ ██╗███████╗███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝`}
        </pre>
        <div className="font-pixel text-[8px] sm:text-[10px] text-[var(--pixel-amber)] min-h-[18px] mb-6">
          {HERO_LINES[heroLine]}
          <span className="animate-blink">_</span>
        </div>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="SEARCH PRODUCTS..."
            className="pixel-input flex-1"
          />
          <button
            type="submit"
            className="pixel-btn pixel-btn-solid-cyan flex items-center gap-1"
          >
            <Search size={14} />
          </button>
        </form>
      </section>

      {/* ── Category Filter ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => {
            setActiveCategory(null);
            setSearch("");
            setSearchInput("");
            setPage(0);
          }}
          className={`pixel-btn text-[7px] ${!activeCategory && !search ? "pixel-btn-solid-cyan" : "pixel-btn-white"}`}
        >
          ALL
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSearch("");
              setSearchInput("");
              setPage(0);
            }}
            className={`pixel-btn text-[7px] ${activeCategory === cat.id ? "pixel-btn-solid-amber" : "pixel-btn-white"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {search && (
        <div className="font-pixel text-[8px] text-[var(--pixel-gray)] mb-4">
          {">"} RESULTS FOR:{" "}
          <span className="text-[var(--pixel-cyan)]">"{search}"</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-pixel text-[var(--pixel-gray)] text-[10px] mb-2">
            ◈ NO RESULTS FOUND
          </div>
          <p className="font-vt323 text-[var(--pixel-gray)] text-lg">
            Try searching for something else.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="pixel-btn pixel-btn-white text-[7px] flex items-center gap-1 disabled:opacity-30"
          >
            <ChevronLeft size={12} /> PREV
          </button>
          <span className="font-pixel text-[8px] text-[var(--pixel-cyan)]">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="pixel-btn pixel-btn-white text-[7px] flex items-center gap-1 disabled:opacity-30"
          >
            NEXT <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
