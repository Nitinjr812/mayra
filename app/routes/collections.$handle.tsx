import { useLoaderData, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/collections.$handle";
import { Image, Money, getPaginationVariables } from "@shopify/hydrogen";
import { useState, useMemo } from "react";

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${data?.collection?.title ?? "Collection"} | Mayra by Gungun`,
  },
  {
    name: "description",
    content:
      data?.collection?.description ??
      "Handcrafted fine jewellery from Jaipur.",
  },
];

// ─────────────────────────────────────────
// Loader
// ─────────────────────────────────────────
export async function loader({ params, request, context }: Route.LoaderArgs) {
  const { storefront } = context;
  const { handle } = params;

  if (!handle) throw new Response("Not found", { status: 404 });

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, ...paginationVariables },
  });

  if (!collection) throw new Response("Collection not found", { status: 404 });

  // Fetch all collections for the sidebar nav
  const { collections } = await storefront.query(ALL_COLLECTIONS_QUERY);

  return {
    collection,
    allCollections: collections?.nodes ?? [],
  };
}

// ─────────────────────────────────────────
// Jewellery Placeholder
// ─────────────────────────────────────────
function JewelleryPlaceholder({ label = "" }: { label?: string }) {
  return (
    <div className="w-full h-full img-placeholder flex flex-col items-center justify-center gap-3">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-40"
      >
        <circle cx="24" cy="24" r="10" stroke="#b89a6a" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="5" stroke="#b89a6a" strokeWidth="1" />
        <path d="M24 4 L24 14" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 34 L24 44" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 24 L14 24" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M34 24 L44 24" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="4" r="2" fill="#b89a6a" opacity="0.6" />
        <circle cx="24" cy="44" r="2" fill="#b89a6a" opacity="0.6" />
        <circle cx="4" cy="24" r="2" fill="#b89a6a" opacity="0.6" />
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
// Sort options
// ─────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
];

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function CollectionPage() {
  const { collection, allCollections } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const activeSort = searchParams.get("sort") ?? "featured";
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 999999);

  // Client-side sort & filter (works without re-fetching)
  const products = useMemo(() => {
    let list = [...(collection.products?.nodes ?? [])];

    // Filter by price
    list = list.filter((p) => {
      const price = Number(p.priceRange.minVariantPrice.amount);
      return price >= minPrice && price <= (maxPrice === 999999 ? Infinity : maxPrice);
    });

    // Sort
    if (activeSort === "price-asc") {
      list.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
      );
    } else if (activeSort === "price-desc") {
      list.sort(
        (a, b) =>
          Number(b.priceRange.minVariantPrice.amount) -
          Number(a.priceRange.minVariantPrice.amount)
      );
    }

    return list;
  }, [collection.products?.nodes, activeSort, minPrice, maxPrice]);

  function setSort(val: string) {
    setSearchParams((p) => { p.set("sort", val); return p; });
    setSortOpen(false);
  }

  function setPriceRange(min: number, max: number) {
    setSearchParams((p) => {
      p.set("minPrice", String(min));
      if (max < 999999) p.set("maxPrice", String(max));
      else p.delete("maxPrice");
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

        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }

        .fade-up  { animation: fadeUp  0.7s ease forwards; }
        .slide-in { animation: slideIn 0.5s ease forwards; }

        .img-placeholder {
          background: linear-gradient(135deg, #e8ddd2 0%, #f5efe8 40%, #e8ddd2 100%);
          position: relative; overflow: hidden;
        }
        .img-placeholder::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          animation: shimmer 2s ease-in-out infinite;
        }

        .product-card:hover .card-img  { transform: scale(1.06); }
        .card-img                       { transition: transform 0.7s ease; }
        .product-card:hover .quick-view { transform: translateY(0) !important; }

        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(13,11,9,0.45);
          z-index: 40;
          backdrop-filter: blur(2px);
        }
        .sidebar-drawer {
          position: fixed; left: 0; top: 0; bottom: 0;
          width: 300px;
          background: #faf6f0;
          z-index: 50;
          overflow-y: auto;
          box-shadow: 4px 0 32px rgba(0,0,0,0.12);
        }

        .filter-btn-active {
          background: #b89a6a !important;
          color: #0d0b09 !important;
          border-color: #b89a6a !important;
        }
        .collection-nav-active {
          color: #b89a6a !important;
          border-left-color: #b89a6a !important;
        }
        .sort-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: #faf6f0;
          border: 1px solid #e8ddd2;
          z-index: 30;
          min-width: 200px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }

        /* Staggered card animations */
        .product-card:nth-child(1)  { animation-delay: 0.00s; }
        .product-card:nth-child(2)  { animation-delay: 0.05s; }
        .product-card:nth-child(3)  { animation-delay: 0.10s; }
        .product-card:nth-child(4)  { animation-delay: 0.15s; }
        .product-card:nth-child(5)  { animation-delay: 0.20s; }
        .product-card:nth-child(6)  { animation-delay: 0.25s; }
        .product-card:nth-child(7)  { animation-delay: 0.30s; }
        .product-card:nth-child(8)  { animation-delay: 0.35s; }
      `}</style>

      <main className="min-h-screen bg-[#faf6f0] font-jost text-[#3d322a]">

        {/* ── Hero Banner ── */}
        <section className="relative h-56 md:h-72 flex items-center justify-center overflow-hidden bg-[#0d0b09]">
          {collection.image ? (
            <img
              src={collection.image.url}
              alt={collection.image.altText ?? collection.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] via-[#2d2218] to-[#3d322a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09]/30 via-transparent to-[#0d0b09]/70" />

          {/* Decorative lines */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-[#b89a6a]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#b89a6a]/50" />
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-[#b89a6a]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#b89a6a]/50" />
          </div>

          <div className="relative z-10 text-center px-6 fade-up">
            <p className="text-[#d4b896] text-[10px] tracking-[0.5em] uppercase mb-4">
              Mayra by Gungun
            </p>
            <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-white/50 text-sm mt-3 max-w-md mx-auto leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
        </section>

        {/* ── Marquee ── */}
        <div className="bg-[#b89a6a] py-2.5 overflow-hidden">
          <div
            className="flex gap-12 whitespace-nowrap"
            style={{ animation: "marquee 28s linear infinite" }}
          >
            {[
              "Handcrafted Jewellery", "Kundan & Meena", collection.title,
              "Free Shipping in India", "Heritage Designs", "Jaipur since 2020",
              "Handcrafted Jewellery", "Kundan & Meena", collection.title,
              "Free Shipping in India", "Heritage Designs", "Jaipur since 2020",
            ].map((item, i) => (
              <span
                key={i}
                className="text-[#1a1410] text-[10px] tracking-[0.28em] uppercase flex items-center gap-4 flex-shrink-0 font-jost"
              >
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
            <Link to="/collections/all" className="hover:text-[#b89a6a] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#3d322a]">{collection.title}</span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-[#faf6f0] border-b border-[#e8ddd2] px-4 lg:px-10 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left — filter toggle + count */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 border border-[#d4c4b0] px-4 py-2 text-[10px] tracking-[0.25em] uppercase hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-200"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 4h18M7 12h10M11 20h2" />
                </svg>
                Filter
              </button>
              <span className="text-[11px] text-[#8a7a6e] tracking-wide hidden sm:block">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </span>
            </div>

            {/* Right — sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 border border-[#d4c4b0] px-4 py-2 text-[10px] tracking-[0.25em] uppercase hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-200"
              >
                <span>Sort: {activeSortLabel}</span>
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sortOpen && (
                <div className="sort-dropdown">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={`w-full text-left px-5 py-3 text-[11px] tracking-[0.15em] uppercase transition-colors hover:bg-[#e8ddd2] ${
                        activeSort === opt.value
                          ? "text-[#b89a6a] font-medium"
                          : "text-[#3d322a]"
                      }`}
                    >
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

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10">

          {/* Empty state */}
          {products.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 mx-auto mb-6 opacity-20">
                <JewelleryPlaceholder />
              </div>
              <p className="font-cormorant text-3xl font-light text-[#3d322a] mb-2">
                No pieces found
              </p>
              <p className="text-sm text-[#8a7a6e] mb-6">
                Try adjusting your filters or browse all collections.
              </p>
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                }}
                className="border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlist.has(product.id)}
                onWishlist={() => toggleWishlist(product.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <PaginationBar
            hasNextPage={collection.products?.pageInfo?.hasNextPage}
            hasPreviousPage={collection.products?.pageInfo?.hasPreviousPage}
            startCursor={collection.products?.pageInfo?.startCursor}
            endCursor={collection.products?.pageInfo?.endCursor}
          />
        </div>

        {/* ── Filter Sidebar Overlay ── */}
        {sidebarOpen && (
          <>
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="sidebar-drawer slide-in">
              <FilterSidebar
                allCollections={allCollections}
                currentHandle={collection.handle}
                activeSort={activeSort}
                minPrice={minPrice}
                maxPrice={maxPrice === 999999 ? 0 : maxPrice}
                onClose={() => setSidebarOpen(false)}
                onSort={setSort}
                onPriceRange={setPriceRange}
              />
            </aside>
          </>
        )}

        {/* ── Bottom CTA ── */}
        <section className="bg-[#b89a6a] py-12 px-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span className="font-cormorant text-[18vw] font-light text-[#a08050]/20 leading-none whitespace-nowrap">
              Mayra
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-cormorant text-2xl sm:text-3xl font-light text-[#1a1410] mb-4">
              Every Piece Tells a Story,<br />
              Let Yours <em className="italic">Shine Through</em>
            </p>
            <Link
              to="/collections/all"
              className="inline-block border border-[#1a1410] text-[#1a1410] px-10 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#1a1410] hover:text-[#d4b896] transition-all duration-300"
            >
              Explore All Jewellery
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

// ─────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────
type ProductCardProps = {
  product: any;
  wishlisted: boolean;
  onWishlist: () => void;
};

function ProductCard({ product, wishlisted, onWishlist }: ProductCardProps) {
  return (
    <div className="product-card group fade-up">
      <Link to={`/products/${product.handle}`} className="block">
        <div
          className="relative overflow-hidden mb-3 rounded-sm bg-[#f5efe8]"
          style={{ aspectRatio: "3/4" }}
        >
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              className="card-img w-full h-full object-cover"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <JewelleryPlaceholder />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick view bar */}
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

        <h3 className="font-cormorant text-lg font-light leading-tight mb-1 text-[#3d322a] group-hover:text-[#b89a6a] transition-colors duration-300">
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

      {/* Wishlist button — outside Link to avoid nested nav */}
      <button
        onClick={onWishlist}
        className="mt-2 flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8a7a6e] hover:text-[#b89a6a] transition-colors"
        aria-label="Add to wishlist"
      >
        <svg
          width="13"
          height="13"
          fill={wishlisted ? "#b89a6a" : "none"}
          stroke={wishlisted ? "#b89a6a" : "currentColor"}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {wishlisted ? "Saved" : "Wishlist"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Filter Sidebar
// ─────────────────────────────────────────
type FilterSidebarProps = {
  allCollections: any[];
  currentHandle: string;
  activeSort: string;
  minPrice: number;
  maxPrice: number;
  onClose: () => void;
  onSort: (val: string) => void;
  onPriceRange: (min: number, max: number) => void;
};

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 999999 },
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 – ₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000 – ₹60,000", min: 30000, max: 60000 },
  { label: "Above ₹60,000", min: 60000, max: 999999 },
];

function FilterSidebar({
  allCollections,
  currentHandle,
  activeSort,
  minPrice,
  maxPrice,
  onClose,
  onSort,
  onPriceRange,
}: FilterSidebarProps) {
  return (
    <div className="h-full flex flex-col font-jost text-[#3d322a]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ddd2]">
        <h2 className="font-cormorant text-2xl font-light">Filters</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-[#8a7a6e] hover:text-[#b89a6a] transition-colors"
          aria-label="Close filters"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Collections nav */}
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4">
            Categories
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/collections/all"
                onClick={onClose}
                className={`block pl-3 py-2 text-sm border-l-2 transition-all duration-200 ${
                  currentHandle === "all"
                    ? "collection-nav-active border-[#b89a6a] text-[#b89a6a]"
                    : "border-transparent text-[#8a7a6e] hover:text-[#3d322a] hover:border-[#d4c4b0]"
                }`}
              >
                All Jewellery
              </Link>
            </li>
            {allCollections.map((col: any) => (
              <li key={col.id}>
                <Link
                  to={`/collections/${col.handle}`}
                  onClick={onClose}
                  className={`block pl-3 py-2 text-sm border-l-2 transition-all duration-200 ${
                    currentHandle === col.handle
                      ? "collection-nav-active border-[#b89a6a] text-[#b89a6a]"
                      : "border-transparent text-[#8a7a6e] hover:text-[#3d322a] hover:border-[#d4c4b0]"
                  }`}
                >
                  {col.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e8ddd2]" />

        {/* Price range */}
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4">
            Price Range
          </p>
          <ul className="space-y-2">
            {PRICE_RANGES.map((range) => {
              const isActive =
                minPrice === range.min &&
                (range.max === 999999
                  ? maxPrice === 0 || maxPrice === 999999
                  : maxPrice === range.max);
              return (
                <li key={range.label}>
                  <button
                    onClick={() => onPriceRange(range.min, range.max)}
                    className={`w-full text-left flex items-center gap-3 py-1.5 text-sm transition-colors ${
                      isActive ? "text-[#b89a6a] font-medium" : "text-[#8a7a6e] hover:text-[#3d322a]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                        isActive ? "border-[#b89a6a] bg-[#b89a6a]" : "border-[#d4c4b0]"
                      }`}
                    >
                      {isActive && (
                        <svg width="8" height="8" fill="white" viewBox="0 0 10 10">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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

        {/* Divider */}
        <div className="h-px bg-[#e8ddd2]" />

        {/* Sort */}
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4">
            Sort By
          </p>
          <ul className="space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => { onSort(opt.value); onClose(); }}
                  className={`w-full text-left flex items-center gap-3 py-1.5 text-sm transition-colors ${
                    activeSort === opt.value ? "text-[#b89a6a] font-medium" : "text-[#8a7a6e] hover:text-[#3d322a]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                      activeSort === opt.value ? "border-[#b89a6a] bg-[#b89a6a]" : "border-[#d4c4b0]"
                    }`}
                  >
                    {activeSort === opt.value && (
                      <svg width="8" height="8" fill="white" viewBox="0 0 10 10">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
          onClick={onClose}
          className="w-full bg-[#b89a6a] text-[#0d0b09] py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#a08050] transition-colors duration-300"
        >
          View {"{count}"} Pieces
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Pagination Bar
// ─────────────────────────────────────────
type PaginationBarProps = {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

function PaginationBar({
  hasNextPage,
  hasPreviousPage,
  startCursor,
  endCursor,
}: PaginationBarProps) {
  if (!hasNextPage && !hasPreviousPage) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-14">
      {hasPreviousPage && (
        <Link
          to={`?direction=previous&cursor=${startCursor}`}
          className="border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
        >
          ← Previous
        </Link>
      )}
      {hasNextPage && (
        <Link
          to={`?direction=next&cursor=${endCursor}`}
          className="border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
        >
          Load More →
        </Link>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// GraphQL Queries
// ─────────────────────────────────────────
const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
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
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
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