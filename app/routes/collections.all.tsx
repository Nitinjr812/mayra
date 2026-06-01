import { useLoaderData, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/collections.all";
import { Image, Money, getPaginationVariables } from "@shopify/hydrogen";
import { useState, useMemo } from "react";

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction = () => [
  { title: "All Jewellery | Mayra by Gungun" },
  {
    name: "description",
    content: "Shop all handcrafted fine jewellery — Ranihaar, Bangles, Earrings, Necklace & more. Since 2020, Jaipur.",
  },
];

// ─────────────────────────────────────────
// Loader
// ─────────────────────────────────────────
export async function loader({ request, context }: Route.LoaderArgs) {
  const { storefront } = context;

  const paginationVariables = getPaginationVariables(request, { pageBy: 24 });

  const [{ products }, { collections }] = await Promise.all([
    storefront.query(ALL_PRODUCTS_QUERY, { variables: { ...paginationVariables } }),
    storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  return {
    products: products ?? { nodes: [], pageInfo: {} },
    allCollections: collections?.nodes ?? [],
  };
}

// ─────────────────────────────────────────
// Shared: Jewellery Placeholder
// ─────────────────────────────────────────
function JewelleryPlaceholder({ label = "" }: { label?: string }) {
  return (
    <div className="w-full h-full img-placeholder flex flex-col items-center justify-center gap-3">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-40">
        <circle cx="24" cy="24" r="10" stroke="#b89a6a" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="5"  stroke="#b89a6a" strokeWidth="1" />
        <path d="M24 4 L24 14"  stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 34 L24 44" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 24 L14 24"  stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M34 24 L44 24" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="4"  r="2" fill="#b89a6a" opacity="0.6" />
        <circle cx="24" cy="44" r="2" fill="#b89a6a" opacity="0.6" />
        <circle cx="4"  cy="24" r="2" fill="#b89a6a" opacity="0.6" />
        <circle cx="44" cy="24" r="2" fill="#b89a6a" opacity="0.6" />
      </svg>
      {label && (
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#b89a6a]/60 font-jost">
          {label}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Sort + Price options
// ─────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Featured",          value: "featured"      },
  { label: "Price: Low to High", value: "price-asc"    },
  { label: "Price: High to Low", value: "price-desc"   },
  { label: "Newest First",       value: "newest"       },
  { label: "Best Selling",       value: "best-selling" },
];

const PRICE_RANGES = [
  { label: "All Prices",         min: 0,     max: 999999 },
  { label: "Under ₹5,000",       min: 0,     max: 5000   },
  { label: "₹5,000 – ₹15,000",  min: 5000,  max: 15000  },
  { label: "₹15,000 – ₹30,000", min: 15000, max: 30000  },
  { label: "₹30,000 – ₹60,000", min: 30000, max: 60000  },
  { label: "Above ₹60,000",     min: 60000, max: 999999 },
];

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function CollectionsAll() {
  const { products, allCollections } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen,    setSortOpen]    = useState(false);
  const [wishlist,    setWishlist]    = useState<Set<string>>(new Set());

  const activeSort = searchParams.get("sort")     ?? "featured";
  const minPrice   = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice   = Number(searchParams.get("maxPrice") ?? 999999);

  // Client-side sort & filter
  const displayProducts = useMemo(() => {
    let list = [...(products.nodes ?? [])];

    list = list.filter((p) => {
      const price = Number(p.priceRange.minVariantPrice.amount);
      return price >= minPrice && price <= (maxPrice === 999999 ? Infinity : maxPrice);
    });

    if (activeSort === "price-asc") {
      list.sort((a, b) =>
        Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount)
      );
    } else if (activeSort === "price-desc") {
      list.sort((a, b) =>
        Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount)
      );
    }

    return list;
  }, [products.nodes, activeSort, minPrice, maxPrice]);

  function setSort(val: string) {
    setSearchParams((p) => { p.set("sort", val); return p; });
    setSortOpen(false);
  }

  function setPriceRange(min: number, max: number) {
    setSearchParams((p) => {
      p.set("minPrice", String(min));
      max < 999999 ? p.set("maxPrice", String(max)) : p.delete("maxPrice");
      return p;
    });
  }

  function toggleWishlist(id: string) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === activeSort)?.label ?? "Featured";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }

        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }

        .fade-up  { animation: fadeUp  0.6s ease both; }
        .slide-in { animation: slideIn 0.45s ease both; }

        .img-placeholder {
          background: linear-gradient(135deg, #e8ddd2 0%, #f5efe8 40%, #e8ddd2 100%);
          position: relative; overflow: hidden;
        }
        .img-placeholder::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        .product-card:hover .card-img   { transform: scale(1.06); }
        .card-img                        { transition: transform 0.7s ease; }
        .product-card:hover .quick-view  { transform: translateY(0) !important; }
        .product-card:hover .card-title  { color: #b89a6a; }

        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(13,11,9,.5);
          z-index: 40;
          backdrop-filter: blur(2px);
        }
        .sidebar-drawer {
          position: fixed; left: 0; top: 0; bottom: 0;
          width: 300px; background: #faf6f0; z-index: 50;
          overflow-y: auto; box-shadow: 6px 0 40px rgba(0,0,0,.13);
        }
        .sort-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: #faf6f0; border: 1px solid #e8ddd2;
          z-index: 30; min-width: 210px;
          box-shadow: 0 8px 32px rgba(0,0,0,.08);
        }

        .product-card:nth-child(1)  { animation-delay: .00s }
        .product-card:nth-child(2)  { animation-delay: .05s }
        .product-card:nth-child(3)  { animation-delay: .10s }
        .product-card:nth-child(4)  { animation-delay: .15s }
        .product-card:nth-child(5)  { animation-delay: .20s }
        .product-card:nth-child(6)  { animation-delay: .25s }
        .product-card:nth-child(7)  { animation-delay: .30s }
        .product-card:nth-child(8)  { animation-delay: .35s }
        .product-card:nth-child(n+9){ animation-delay: .40s }

        .col-nav-active { color:#b89a6a!important; border-left-color:#b89a6a!important; }
      `}</style>

      <main className="min-h-screen bg-[#faf6f0] font-jost text-[#3d322a]">

        {/* ── Hero ── */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden bg-[#0d0b09]">
          {/* background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] via-[#2d2218] to-[#0d0b09]" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #b89a6a 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0b09]/80" />

          {/* Side decorations */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-[#b89a6a]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#b89a6a]/50" />
            <div className="w-px h-16 bg-[#b89a6a]/30" />
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-[#b89a6a]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#b89a6a]/50" />
            <div className="w-px h-16 bg-[#b89a6a]/30" />
          </div>

          <div className="relative z-10 text-center px-6 fade-up">
            <p className="text-[#d4b896] text-[10px] tracking-[0.55em] uppercase mb-4 font-jost">
              Mayra by Gungun
            </p>
            <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-none mb-4">
              All <em className="italic text-[#d4b896]">Jewellery</em>
            </h1>
            <p className="text-white/40 text-sm tracking-wide">
              Handcrafted in Jaipur · Since 2020
            </p>
          </div>
        </section>

        {/* ── Marquee ── */}
        <div className="bg-[#b89a6a] py-2.5 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap"
            style={{ animation: "marquee 30s linear infinite" }}>
            {[
              "Ranihaar","Kundan & Meena","Bangles","Bridal Collection",
              "Moissanite","Polki & Sapphire","Earrings","Heritage Designs",
              "Ranihaar","Kundan & Meena","Bangles","Bridal Collection",
              "Moissanite","Polki & Sapphire","Earrings","Heritage Designs",
            ].map((item, i) => (
              <span key={i}
                className="text-[#1a1410] text-[10px] tracking-[0.28em] uppercase flex items-center gap-4 flex-shrink-0 font-jost">
                {item}
                <span className="w-[3px] h-[3px] bg-[#1a1410]/50 rounded-full inline-block" />
              </span>
            ))}
          </div>
        </div>

        {/* ── Breadcrumb ── */}
        <div className="bg-[#f0ebe3] border-b border-[#e8ddd2] px-6 lg:px-10 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#8a7a6e]">
            <Link to="/" className="hover:text-[#b89a6a] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#3d322a]">All Jewellery</span>
          </div>
        </div>

        {/* ── Category Quick-links ── */}
        {allCollections.length > 0 && (
          <div className="bg-[#faf6f0] border-b border-[#e8ddd2] px-4 lg:px-10 py-4 overflow-x-auto">
            <div className="max-w-7xl mx-auto flex items-center gap-3 min-w-max">
              <Link
                to="/collections/all"
                className="flex-shrink-0 border border-[#b89a6a] bg-[#b89a6a] text-[#0d0b09] px-5 py-2 text-[10px] tracking-[0.22em] uppercase transition-all duration-200"
              >
                All
              </Link>
              {allCollections.map((col: any) => (
                <Link
                  key={col.id}
                  to={`/collections/${col.handle}`}
                  className="flex-shrink-0 border border-[#d4c4b0] text-[#8a7a6e] px-5 py-2 text-[10px] tracking-[0.22em] uppercase hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-200"
                >
                  {col.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="bg-[#faf6f0] border-b border-[#e8ddd2] px-4 lg:px-10 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 border border-[#d4c4b0] px-4 py-2 text-[10px] tracking-[0.25em] uppercase hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-200"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
                </svg>
                Filter
              </button>
              <span className="text-[11px] text-[#8a7a6e] tracking-wide hidden sm:block">
                {displayProducts.length} {displayProducts.length === 1 ? "piece" : "pieces"}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 border border-[#d4c4b0] px-4 py-2 text-[10px] tracking-[0.25em] uppercase hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all"
              >
                Sort: {activeSortLabel}
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sortOpen && (
                <div className="sort-dropdown">
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setSort(opt.value)}
                      className={`w-full text-left px-5 py-3 text-[11px] tracking-[0.15em] uppercase transition-colors hover:bg-[#e8ddd2] ${
                        activeSort === opt.value ? "text-[#b89a6a] font-medium" : "text-[#3d322a]"
                      }`}>
                      {activeSort === opt.value && (
                        <span className="inline-block w-1.5 h-1.5 bg-[#b89a6a] rounded-full mr-2 mb-0.5" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10">
          {displayProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-cormorant text-3xl font-light text-[#3d322a] mb-3">
                No pieces found
              </p>
              <p className="text-sm text-[#8a7a6e] mb-8">
                Try adjusting your filters.
              </p>
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlisted={wishlist.has(product.id)}
                  onWishlist={() => toggleWishlist(product.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {(products.pageInfo?.hasNextPage || products.pageInfo?.hasPreviousPage) && (
            <div className="flex justify-center items-center gap-4 mt-14">
              {products.pageInfo?.hasPreviousPage && (
                <Link
                  to={`?direction=previous&cursor=${products.pageInfo.startCursor}`}
                  className="border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
                >
                  ← Previous
                </Link>
              )}
              {products.pageInfo?.hasNextPage && (
                <Link
                  to={`?direction=next&cursor=${products.pageInfo.endCursor}`}
                  className="border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
                >
                  Load More →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <>
            <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            <aside className="sidebar-drawer slide-in">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ddd2]">
                  <h2 className="font-cormorant text-2xl font-light">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-[#8a7a6e] hover:text-[#b89a6a] transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                  {/* Collections */}
                  <div>
                    <p className="text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4">Categories</p>
                    <ul className="space-y-1">
                      <li>
                        <Link to="/collections/all" onClick={() => setSidebarOpen(false)}
                          className="col-nav-active block pl-3 py-2 text-sm border-l-2 border-[#b89a6a] text-[#b89a6a]">
                          All Jewellery
                        </Link>
                      </li>
                      {allCollections.map((col: any) => (
                        <li key={col.id}>
                          <Link to={`/collections/${col.handle}`} onClick={() => setSidebarOpen(false)}
                            className="block pl-3 py-2 text-sm border-l-2 border-transparent text-[#8a7a6e] hover:text-[#3d322a] hover:border-[#d4c4b0] transition-all">
                            {col.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="h-px bg-[#e8ddd2]" />

                  {/* Price */}
                  <div>
                    <p className="text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4">Price Range</p>
                    <ul className="space-y-2">
                      {PRICE_RANGES.map((range) => {
                        const isActive = minPrice === range.min &&
                          (range.max === 999999
                            ? maxPrice === 0 || maxPrice === 999999
                            : maxPrice === range.max);
                        return (
                          <li key={range.label}>
                            <button
                              onClick={() => setPriceRange(range.min, range.max)}
                              className={`w-full text-left flex items-center gap-3 py-1.5 text-sm transition-colors ${
                                isActive ? "text-[#b89a6a] font-medium" : "text-[#8a7a6e] hover:text-[#3d322a]"
                              }`}>
                              <span className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                                isActive ? "border-[#b89a6a] bg-[#b89a6a]" : "border-[#d4c4b0]"
                              }`}>
                                {isActive && (
                                  <svg width="8" height="8" fill="none" viewBox="0 0 10 10">
                                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </span>
                              {range.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="h-px bg-[#e8ddd2]" />

                  {/* Sort */}
                  <div>
                    <p className="text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4">Sort By</p>
                    <ul className="space-y-2">
                      {SORT_OPTIONS.map((opt) => (
                        <li key={opt.value}>
                          <button
                            onClick={() => { setSort(opt.value); setSidebarOpen(false); }}
                            className={`w-full text-left flex items-center gap-3 py-1.5 text-sm transition-colors ${
                              activeSort === opt.value ? "text-[#b89a6a] font-medium" : "text-[#8a7a6e] hover:text-[#3d322a]"
                            }`}>
                            <span className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                              activeSort === opt.value ? "border-[#b89a6a] bg-[#b89a6a]" : "border-[#d4c4b0]"
                            }`}>
                              {activeSort === opt.value && (
                                <svg width="8" height="8" fill="none" viewBox="0 0 10 10">
                                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                              )}
                            </span>
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-[#e8ddd2]">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-full bg-[#b89a6a] text-[#0d0b09] py-3.5 text-[10px] tracking-[0.3em] uppercase hover:bg-[#a08050] transition-colors duration-300"
                  >
                    View {displayProducts.length} Pieces
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* ── Bottom Banner ── */}
        <section className="bg-[#b89a6a] py-12 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <span className="font-cormorant text-[18vw] font-light text-[#a08050]/20 leading-none whitespace-nowrap">
              Mayra
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-cormorant text-2xl sm:text-3xl font-light text-[#1a1410] mb-4">
              Every Piece Tells a Story,<br />
              Let Yours <em className="italic">Shine Through</em>
            </p>
            <a
              href="https://wa.link/0cknis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#1a1410] text-[#1a1410] px-10 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#1a1410] hover:text-[#d4b896] transition-all duration-300"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

// ─────────────────────────────────────────
// Product Card Component
// ─────────────────────────────────────────
function ProductCard({
  product,
  wishlisted,
  onWishlist,
}: {
  product: any;
  wishlisted: boolean;
  onWishlist: () => void;
}) {
  return (
    <div className="product-card group fade-up">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="relative overflow-hidden mb-3 rounded-sm bg-[#f5efe8]"
          style={{ aspectRatio: "3/4" }}>
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              className="card-img w-full h-full object-cover"
              sizes="(min-width:1280px) 25vw,(min-width:768px) 33vw,50vw"
            />
          ) : (
            <JewelleryPlaceholder />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div
            className="quick-view absolute bottom-0 left-0 right-0 bg-[#0d0b09] text-[#d4b896] text-[9px] tracking-[0.25em] uppercase py-3 text-center"
            style={{ transform: "translateY(100%)", transition: "transform 0.3s ease" }}
          >
            View Details
          </div>

          {/* Sale badge */}
          {product.compareAtPriceRange?.minVariantPrice?.amount &&
            Number(product.compareAtPriceRange.minVariantPrice.amount) >
            Number(product.priceRange.minVariantPrice.amount) && (
              <div className="absolute top-3 left-3 bg-[#b89a6a] text-[#0d0b09] text-[9px] tracking-[0.2em] uppercase px-2.5 py-1">
                Sale
              </div>
            )}
        </div>

        <h3 className="card-title font-cormorant text-lg font-light leading-tight mb-1 text-[#3d322a] transition-colors duration-300">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          <Money
            data={product.priceRange.minVariantPrice}
            className="text-sm text-[#b89a6a] tracking-wide"
          />
          {product.compareAtPriceRange?.minVariantPrice?.amount &&
            Number(product.compareAtPriceRange.minVariantPrice.amount) >
            Number(product.priceRange.minVariantPrice.amount) && (
              <Money
                data={product.compareAtPriceRange.minVariantPrice}
                className="text-xs text-[#8a7a6e] line-through"
              />
            )}
        </div>
      </Link>

      <button
        onClick={onWishlist}
        className="mt-2 flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8a7a6e] hover:text-[#b89a6a] transition-colors"
        aria-label="Wishlist"
      >
        <svg width="13" height="13"
          fill={wishlisted ? "#b89a6a" : "none"}
          stroke={wishlisted ? "#b89a6a" : "currentColor"}
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlisted ? "Saved" : "Wishlist"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// GraphQL Queries
// ─────────────────────────────────────────
const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
      reverse: true
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        compareAtPriceRange {
          minVariantPrice { amount currencyCode }
        }
      }
    }
  }
` as const;

const ALL_COLLECTIONS_QUERY = `#graphql
  query AllCollections {
    collections(first: 20, sortKey: TITLE) {
      nodes {
        id
        title
        handle
      }
    }
  }
` as const;