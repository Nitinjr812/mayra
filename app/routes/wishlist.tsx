import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Image, Money, CartForm } from "@shopify/hydrogen";
import type { Route } from "./+types/wishlist";

// ─────────────────────────────────────────
// Links — fonts via <link> tag (Hydrogen standard)
// @import in <style> kaam nahi karta Hydrogen SSR mein
// ─────────────────────────────────────────
export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap",
  },
];

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction = () => [
  { title: "Wishlist | Mayra by Gungun" },
];

// ─────────────────────────────────────────
// Loader — no server data needed
// Wishlist localStorage mein hai (client-side only)
// ─────────────────────────────────────────
export async function loader() {
  return {};
}

// ─────────────────────────────────────────
// Wishlist Helpers (localStorage)
// ─────────────────────────────────────────
const WISHLIST_KEY = "mayra_wishlist";

export type WishlistItem = {
  id: string;
  productId: string;
  handle: string;
  title: string;
  variantTitle?: string;
  price: { amount: string; currencyCode: string };
  image?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  addedAt: number;
};

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToWishlist(item: WishlistItem): void {
  const list = getWishlist();
  if (!list.find((i) => i.id === item.id)) {
    list.push({ ...item, addedAt: Date.now() });
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("wishlist-update"));
  }
}

export function removeFromWishlist(variantId: string): void {
  const list = getWishlist().filter((i) => i.id !== variantId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-update"));
}

export function isInWishlist(variantId: string): boolean {
  return getWishlist().some((i) => i.id === variantId);
}

// ─────────────────────────────────────────
// Heart Icon — client-only state
// ─────────────────────────────────────────
export function WishlistHeart({
  variantId,
  item,
  size = 18,
  className = "",
}: {
  variantId: string;
  item?: Omit<WishlistItem, "addedAt">;
  size?: number;
  className?: string;
}) {
  // Start false always — avoids SSR mismatch
  const [inList, setInList] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setInList(isInWishlist(variantId));
    const handler = () => setInList(isInWishlist(variantId));
    window.addEventListener("wishlist-update", handler);
    return () => window.removeEventListener("wishlist-update", handler);
  }, [variantId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    if (inList) {
      removeFromWishlist(variantId);
    } else if (item) {
      addToWishlist({ ...item, addedAt: Date.now() });
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={inList ? "Remove from wishlist" : "Add to wishlist"}
      className={`wishlist-heart ${animating ? "pop" : ""} ${className}`}
      style={{ lineHeight: 0, background: "none", border: "none", cursor: "pointer", padding: 4 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={inList ? "#b89a6a" : "none"}
        stroke={inList ? "#b89a6a" : "currentColor"}
        strokeWidth="1.5"
        style={{ transition: "fill 0.25s, stroke 0.25s" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────
function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-6 text-center fade-up">
      <div className="mb-8 relative">
        <div className="absolute inset-0 blur-2xl opacity-20 bg-[#b89a6a] rounded-full scale-150" />
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="relative opacity-40">
          <path
            d="M61.88 13.84a16.5 16.5 0 00-23.34 0L36 16.42l-2.54-2.58a16.5 16.5 0 00-23.34 23.34l2.54 2.54L36 63.14l23.34-23.42 2.54-2.54a16.5 16.5 0 000-23.34z"
            stroke="#b89a6a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-cormorant text-4xl font-light text-[#3d322a] mb-2">
        Your wishlist is empty
      </p>
      <p className="text-[11px] tracking-[0.25em] uppercase text-[#8a7a6e] mb-10 max-w-xs leading-relaxed">
        Save pieces that speak to your soul — they&apos;ll wait right here for you
      </p>
      <Link
        to="/collections/all"
        className="inline-block bg-[#3d322a] text-[#faf6f0] px-12 py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
      >
        Explore Collections
      </Link>
      <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm w-full opacity-60">
        {["New Arrivals", "Bestsellers", "Festive Edit"].map((label) => (
          <Link
            key={label}
            to="/collections/all"
            className="border border-[#e8ddd2] py-3 px-2 text-center text-[9px] tracking-[0.2em] uppercase text-[#8a7a6e] hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-300"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Wishlist Card
// ─────────────────────────────────────────
function WishlistCard({
  item,
  onRemove,
  index,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      removeFromWishlist(item.id);
      onRemove(item.id);
    }, 350);
  };

  return (
    <div
      className={`wishlist-card group relative bg-white border border-[#e8ddd2] overflow-hidden ${removing ? "removing" : "entering"}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image */}
      <Link to={`/products/${item.handle}`} className="block relative overflow-hidden aspect-[3/4] bg-[#f5efe8]">
        {item.image ? (
          <Image
            data={item.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" className="opacity-20">
              <circle cx="24" cy="24" r="10" stroke="#b89a6a" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="5" stroke="#b89a6a" strokeWidth="1" />
              <path d="M24 4L24 14M24 34L24 44M4 24L14 24M34 24L44 24" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#1a1410]/0 group-hover:bg-[#1a1410]/10 transition-all duration-500 pointer-events-none" />

        {/* Remove button */}
        <button
          onClick={(e) => { e.preventDefault(); handleRemove(); }}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#b89a6a] hover:text-white text-[#3d322a]"
        >
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Date badge */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <span className="text-[8px] tracking-[0.15em] uppercase bg-white/90 backdrop-blur-sm text-[#8a7a6e] px-2 py-1">
            Saved {new Date(item.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${item.handle}`} className="block group/title mb-1">
          <h3 className="font-cormorant text-lg font-light text-[#3d322a] leading-snug group-hover/title:text-[#b89a6a] transition-colors duration-300 line-clamp-1">
            {item.title}
          </h3>
        </Link>
        {item.variantTitle && item.variantTitle !== "Default Title" && (
          <p className="text-[9px] tracking-[0.2em] uppercase text-[#8a7a6e] mb-2">{item.variantTitle}</p>
        )}
        <p className="text-[9px] tracking-[0.15em] uppercase text-[#b89a6a] mb-3">Handcrafted · Jaipur</p>

        <div className="flex items-center justify-between gap-2">
          <Money
            data={item.price}
            className="font-cormorant text-xl font-light text-[#3d322a]"
          />

          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{ lines: [{ merchandiseId: item.id, quantity: 1 }] }}
          >
            <button
              type="submit"
              className="add-to-bag text-[9px] tracking-[0.2em] uppercase px-3 py-2 border border-[#3d322a] text-[#3d322a] hover:bg-[#3d322a] hover:text-[#faf6f0] transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap"
              aria-label={`Add ${item.title} to cart`}
            >
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add
            </button>
          </CartForm>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Sort
// ─────────────────────────────────────────
type SortOrder = "newest" | "oldest" | "price-low" | "price-high";

function sortItems(items: WishlistItem[], order: SortOrder): WishlistItem[] {
  return [...items].sort((a, b) => {
    if (order === "newest") return b.addedAt - a.addedAt;
    if (order === "oldest") return a.addedAt - b.addedAt;
    if (order === "price-low") return Number(a.price.amount) - Number(b.price.amount);
    if (order === "price-high") return Number(b.price.amount) - Number(a.price.amount);
    return 0;
  });
}

// ─────────────────────────────────────────
// Page — hydration-safe
// ─────────────────────────────────────────
export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  // hydrated = false on server, true after first client render
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(getWishlist());
    setHydrated(true);

    const handler = () => setItems(getWishlist());
    window.addEventListener("wishlist-update", handler);
    return () => window.removeEventListener("wishlist-update", handler);
  }, []);

  const handleRemove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const handleClearAll = () => {
    if (window.confirm("Poora wishlist clear kar dein?")) {
      localStorage.removeItem(WISHLIST_KEY);
      setItems([]);
      window.dispatchEvent(new Event("wishlist-update"));
    }
  };

  const sorted = sortItems(items, sortOrder);
  // isEmpty check only after hydration
  const isEmpty = hydrated && items.length === 0;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cardRemove {
          to   { opacity: 0; transform: translateY(10px) scale(0.95); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }
        .fade-up  { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-in  { animation: fadeIn 0.45s ease both; }

        .wishlist-card.entering {
          animation: cardEnter 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .wishlist-card.removing {
          animation: cardRemove 0.35s ease forwards;
          pointer-events: none;
        }
        .wishlist-heart.pop {
          animation: heartPop 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .sort-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a7a6e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
        .sort-select:focus { outline: none; border-color: #b89a6a; }
        .add-to-bag:active { transform: scale(0.97); }
        .skeleton {
          background: linear-gradient(90deg, #f5efe8 25%, #ede6dc 50%, #f5efe8 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      `}</style>

      <main className="min-h-screen bg-[#faf6f0] font-jost text-[#3d322a]">

        {/* Breadcrumb */}
        <div className="bg-[#f0ebe3] border-b border-[#e8ddd2] px-6 lg:px-10 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#8a7a6e]">
            <Link to="/" className="hover:text-[#b89a6a] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#3d322a]">Wishlist</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center pt-10 pb-6 fade-up">
          <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-2">
            Mayra by Gungun
          </p>
          <h1 className="font-cormorant text-4xl lg:text-5xl font-light text-[#3d322a]">
            My <em className="italic text-[#b89a6a]">Wishlist</em>
          </h1>
          {/*
            suppressHydrationWarning — yeh sirf client pe render hoga
            isliye server/client mismatch nahi aayega
          */}
          <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[#8a7a6e] min-h-[1.5em]" suppressHydrationWarning>
            {hydrated && items.length > 0
              ? `${items.length} ${items.length === 1 ? "piece" : "pieces"} saved`
              : ""}
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-8 fade-in">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4c4b0]" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#b89a6a" className="opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4c4b0]" />
        </div>

        {/* Body — skeleton → empty → content */}
        {!hydrated ? (
          /* Skeleton (SSR + first paint) */
          <div className="max-w-6xl mx-auto px-4 lg:px-10 pb-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-[#e8ddd2]">
                <div className="skeleton aspect-[3/4]" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-8 rounded w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyWishlist />
        ) : (
          <div className="max-w-6xl mx-auto px-4 lg:px-10 pb-20">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e8ddd2]">
              <div className="flex items-center gap-3">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6e]">Sort by</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="sort-select border border-[#d4c4b0] text-[11px] text-[#3d322a] px-3 py-2 bg-white"
                >
                  <option value="newest">Recently Added</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/collections/all"
                  className="text-[10px] tracking-[0.2em] uppercase text-[#b89a6a] hover:text-[#3d322a] transition-colors flex items-center gap-1.5"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add More
                </Link>
                <button
                  onClick={handleClearAll}
                  className="text-[10px] tracking-[0.2em] uppercase text-[#c4b4a4] hover:text-[#3d322a] transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {sorted.map((item, index) => (
                <WishlistCard key={item.id} item={item} onRemove={handleRemove} index={index} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-14 text-center">
              <p className="font-cormorant text-2xl font-light text-[#3d322a] mb-1 italic">
                Keep exploring
              </p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#8a7a6e] mb-6">
                More handcrafted treasures await
              </p>
              <Link
                to="/collections/all"
                className="inline-block bg-[#3d322a] text-[#faf6f0] px-12 py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <section className="bg-[#b89a6a] py-10 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <span className="font-cormorant text-[14vw] font-light text-[#a08050]/20 leading-none whitespace-nowrap">Mayra</span>
          </div>
          <div className="relative z-10">
            <p className="font-cormorant text-2xl font-light text-[#1a1410] mb-4">
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