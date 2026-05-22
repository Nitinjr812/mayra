import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/_index";
import { Image, Money } from "@shopify/hydrogen";
import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction = () => [
  { title: "Mayra by Gungun | Handcrafted Indian Fine Jewellery" },
  {
    name: "description",
    content:
      "Timeless handcrafted jewellery – Ranihaar, Bangles, Earrings, Necklace & more. Since 2020, Jaipur.",
  },
];

// ─────────────────────────────────────────
// Loader
// ─────────────────────────────────────────
export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [{ collections }, { products }, { articles }] = await Promise.all([
    storefront.query(FEATURED_COLLECTIONS_QUERY),
    storefront.query(FEATURED_PRODUCTS_QUERY),
    storefront.query(FEATURED_ARTICLES_QUERY),
  ]);

  return {
    collections: collections.nodes,
    products: products.nodes,
    articles: articles.nodes,
  };
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function Homepage() {
  const { collections, products, articles } = useLoaderData<typeof loader>();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost { font-family: 'Jost', sans-serif; }
        .hero-content { animation: fadeUp 1.2s ease forwards; }
        .hero-content-delay { animation: fadeUp 1.4s ease 0.3s both; }
        .hero-content-delay2 { animation: fadeUp 1.4s ease 0.6s both; }
        .social-float { animation: floatY 3s ease-in-out infinite; }
        .social-float:nth-child(2) { animation-delay: 0.5s; }
        .card-hover:hover img { transform: scale(1.06); }
        .card-hover img { transition: transform 0.7s ease; }
        .card-hover:hover .card-arrow { opacity: 1; transform: translateY(0); }
        .card-arrow { opacity: 0; transform: translateY(4px); transition: opacity 0.3s ease, transform 0.3s ease; }
        .product-hover:hover .quick-view { transform: translateY(0) !important; }
        .trust-badge { transition: transform 0.3s ease; }
        .trust-badge:hover { transform: translateY(-4px); }

        /* Jewellery placeholder shimmer */
        .img-placeholder {
          background: linear-gradient(135deg, #e8ddd2 0%, #f5efe8 40%, #e8ddd2 100%);
          position: relative;
          overflow: hidden;
        }
        .img-placeholder::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <main className="min-h-screen bg-[#faf6f0] font-jost text-[#3d322a]">
        <HeroSection />
        <TrustBadges />
        <MarqueeBar />
        <CategoryGrid collections={collections} />
        <FeaturesSection />
        <FeaturedProducts products={products} />
        <AboutSection />
        <MidVideoSection />
        <BlogSection articles={articles} />
        <InstagramSection />
        <NewsletterSection />
        <FooterSection />
      </main>
    </>
  );
}

// ─────────────────────────────────────────
// Jewellery Placeholder SVG (inline, no external request)
// ─────────────────────────────────────────
function JewelleryPlaceholder({ label = "" }: { label?: string }) {
  return (
    <div className="w-full h-full img-placeholder flex flex-col items-center justify-center gap-3">
      {/* SVG jewellery icon */}
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
// HERO
// ─────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0d0b09]">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay
        loop
        muted
        playsInline
        poster="https://mayrabygungun.com/public/assets/img/website text.png"
      >
        <source
          src="https://mayrabygungun.com/public/webtheme/Untitled design.mp4"
          type="video/mp4"
        />
      </video>

      {/* Depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09]/20 via-[#0d0b09]/30 to-[#0d0b09]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b09]/40 via-transparent to-[#0d0b09]/40" />

      {/* ── Social links — fixed to RIGHT side, vertically centered ── */}
      {/* Positioned so they sit in the middle-right of the hero,
          safely below the navbar (top-8 announcement + ~68px nav = ~100px total).
          We use top-1/2 -translate-y-1/2 with a generous mt to clear the nav. */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
        {/* Vertical line above */}
        <div className="w-px h-12 bg-[#b89a6a]/30" />

        <a
          href="https://www.instagram.com/mayrabygungun/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float w-9 h-9 border border-[#b89a6a]/50 flex items-center justify-center text-[#d4b896] hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
          aria-label="Instagram"
        >
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        <a
          href="https://wa.link/0cknis"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float w-9 h-9 border border-[#b89a6a]/50 flex items-center justify-center text-[#d4b896] hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
          aria-label="WhatsApp"
        >
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* Vertical line below */}
        <div className="w-px h-12 bg-[#b89a6a]/30" />

        {/* Rotated label */}
        <span
          className="text-[#b89a6a]/50 text-[8px] tracking-[0.3em] uppercase"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.25em" }}
        >
          Follow Us
        </span>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="hero-content text-[#d4b896] text-[10px] tracking-[0.5em] uppercase mb-8 font-light">
          Handcrafted Indian Fine Jewellery
        </p>
        <div className="hero-content-delay mb-8">
          <HeroLogoImage />
        </div>
        <p className="hero-content-delay2 text-[10px] tracking-[0.3em] uppercase text-[#faf6f0]/60 mb-10">
          Wear Your Heritage With Pride · Since 2020
        </p>
        <div className="hero-content-delay2">
          <Link
            to="/collections/all"
            className="inline-block border border-[#b89a6a] text-[#d4b896] px-12 py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
          >
            Discover Collection
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[#faf6f0]/40">
        <div className="w-px h-14 bg-gradient-to-b from-[#b89a6a] to-transparent" />
        <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// Logo with clean React fallback (no DOM manipulation)
function HeroLogoImage() {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <h1 className="font-cormorant text-[clamp(3rem,8vw,6rem)] font-light text-[#faf6f0] leading-[1.05]">
        Mayra by <em className="italic text-[#d4b896]">Gungun</em>
      </h1>
    );
  }
  return (
    <img
      src="https://mayrabygungun.com/public/assets/img/website text.png"
      alt="Mayra by Gungun"
      className="max-w-[320px] sm:max-w-[420px] md:max-w-[520px] mx-auto"
      onError={() => setError(true)}
    />
  );
}

// ─────────────────────────────────────────
// TRUST BADGES
// ─────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: "🚚", title: "Free Standard Delivery", sub: "On orders above ₹999" },
    { icon: "🔒", title: "100% Secure Payments", sub: "Safe & encrypted checkout" },
    { icon: "💬", title: "Customer Support", sub: "Mon–Sat, 10am–7pm" },
    { icon: "↩️", title: "Free & Easy Returns", sub: "7-day hassle-free returns" },
  ];

  return (
    <section className="bg-[#faf6f0] border-y border-[#e8ddd2]">
      <div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
        {badges.map((b, i) => (
          <div
            key={i}
            className={`trust-badge flex flex-col items-center text-center py-7 px-4 ${i < 3 ? "border-r border-[#e8ddd2]" : ""
              } ${i >= 2 ? "border-t border-[#e8ddd2] md:border-t-0" : ""}`}
          >
            <span className="text-2xl mb-3">{b.icon}</span>
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#3d322a] mb-1">
              {b.title}
            </h4>
            <p className="text-[11px] text-[#8a7a6e]">{b.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// MARQUEE
// ─────────────────────────────────────────
function MarqueeBar() {
  const items = [
    "Handcrafted Jewellery",
    "Kundan & Meena",
    "Bridal Collection",
    "Ranihaar",
    "Moissanite Collection",
    "Free Shipping in India",
    "Polki & Sapphire",
    "Heritage Designs",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#b89a6a] py-3 overflow-hidden">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {doubled.map((item, i) => (
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
  );
}

// ─────────────────────────────────────────
// CATEGORY GRID
// ─────────────────────────────────────────
type CollectionNode = {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  "ranihar": "https://mayrabygungun.com/public/uploads/all/1KxbXlaZDucvCvMc61oyqT4HfLJFU14grFKGY2QX.png",
  "hand-bags": "https://mayrabygungun.com/public/uploads/all/v2GSQ59vHj9HbyAmZTNV3Mwom3p757xDuHBvpNcz.png",
  "long-earrings": "https://mayrabygungun.com/public/uploads/all/2ZcfwgkActvMs8Sf2JTN3XzgLjVFkKmqRw5PCLkW.png",
  "bangles": "https://mayrabygungun.com/public/uploads/all/tJ6t2JyzdSWK4i9DfSEXoEzYAjCd51jhjxNxQaf6.jpg",
  "decore": "https://mayrabygungun.com/public/uploads/all/FBEKyzaKjImOLw1dvRcvQ2X5RgwEu9hDJ2QWHSpN.jpg",
};

function getCategoryImg(handle: string): string | null {
  const key = Object.keys(CATEGORY_FALLBACKS).find((k) =>
    handle.toLowerCase().includes(k)
  );
  return key ? CATEGORY_FALLBACKS[key] : null;
}

function CategoryGrid({ collections }: { collections: CollectionNode[] }) {
  const displayCollections =
    collections.length > 0
      ? collections.slice(0, 5)
      : [
        { id: "1", title: "Ranihaar", handle: "ranihar-19e5h", image: null },
        { id: "2", title: "Hand Bags", handle: "hand-bags-jchto", image: null },
        { id: "3", title: "Earrings", handle: "long-earrings-hoxji", image: null },
        { id: "4", title: "Bangles", handle: "bangles-88lzu", image: null },
        { id: "5", title: "Necklace", handle: "decore-ecqxq", image: null },
      ];

  return (
    <section className="bg-[#faf6f0] py-20 px-4 lg:px-10">
      <div className="text-center mb-14">
        <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-3 font-jost">
          Explore
        </p>
        <h2 className="font-cormorant text-4xl lg:text-5xl font-light text-[#3d322a]">
          Shop by <em className="italic text-[#b89a6a]">Category</em>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayCollections.map((col, index) => {
            const imgSrc = col.image?.url || getCategoryImg(col.handle);

            return (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                className="card-hover group relative overflow-hidden block rounded-sm"
                style={{ aspectRatio: index < 2 ? "3/4" : "2/3" }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={col.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <JewelleryPlaceholder label={col.title} />
                )}
                {/* Gradient overlay always visible at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/75 via-[#0d0b09]/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-cormorant text-xl font-light text-white leading-tight">
                    {col.title}
                  </h3>
                  <span className="card-arrow text-[9px] tracking-[0.25em] uppercase text-[#d4b896] block mt-1">
                    View Collection →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/collections/all"
            className="inline-block border border-[#b89a6a] text-[#b89a6a] px-10 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────
function FeaturesSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      {/* Image */}
      <div className="relative min-h-[380px] lg:min-h-[560px]">
        {!imgError ? (
          <img
            src="https://mayrabygungun.com/public/webtheme/assets/wp-content/uploads/2024/08/Main-home-rev-img-02.jpg"
            alt="Fine Jewellery craftsmanship"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback: elegant dark gradient with decorative element
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] via-[#2d2218] to-[#3d322a] flex items-center justify-center">
            <div className="text-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-4 opacity-30">
                <circle cx="40" cy="40" r="30" stroke="#b89a6a" strokeWidth="1" />
                <circle cx="40" cy="40" r="18" stroke="#b89a6a" strokeWidth="1" />
                <circle cx="40" cy="40" r="6" fill="#b89a6a" opacity="0.5" />
                <path d="M40 10 L40 22" stroke="#b89a6a" strokeWidth="1" />
                <path d="M40 58 L40 70" stroke="#b89a6a" strokeWidth="1" />
                <path d="M10 40 L22 40" stroke="#b89a6a" strokeWidth="1" />
                <path d="M58 40 L70 40" stroke="#b89a6a" strokeWidth="1" />
              </svg>
              <p className="font-cormorant text-2xl text-[#b89a6a] font-light italic">Artisan Crafted</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#faf6f0]/5" />
      </div>

      {/* Text */}
      <div className="bg-[#faf6f0] px-8 sm:px-10 lg:px-16 py-16 lg:py-20 flex flex-col justify-center">
        <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-4 font-jost">
          Why Mayra
        </p>
        <h2 className="font-cormorant text-4xl lg:text-5xl font-light leading-tight text-[#3d322a] mb-2">
          <em className="italic text-[#b89a6a]">Elegance</em>
          <br />
          Expressed
        </h2>
        <p className="text-sm text-[#8a7a6e] mb-10 leading-relaxed">
          Classic and Contemporary Styles, crafted for the modern Indian woman.
        </p>

        <div className="space-y-8">
          {[
            {
              num: "01",
              title: "Artisan Crafted",
              desc: "Each piece handmade by master artisans from Jaipur with generations of expertise.",
            },
            {
              num: "02",
              title: "Heritage Designs",
              desc: "Rooted in traditional Kundan, Meena & Polki styles, reimagined for today.",
            },
            {
              num: "03",
              title: "Certified Quality",
              desc: "Premium silver and gemstones sourced and certified for lasting brilliance.",
            },
          ].map((f) => (
            <div key={f.num} className="flex gap-6 items-start">
              <span className="font-cormorant text-4xl text-[#b89a6a] font-light leading-none flex-shrink-0">
                {f.num}
              </span>
              <div>
                <h4 className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1 text-[#3d322a]">
                  {f.title}
                </h4>
                <p className="text-sm text-[#8a7a6e] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/pages/about"
            className="inline-block border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
          >
            Our Story →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FEATURED PRODUCTS
// ─────────────────────────────────────────
type ProductNode = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

function FeaturedProducts({ products }: { products: ProductNode[] }) {
  return (
    <section className="bg-white py-20 px-4 lg:px-10">
      <div className="text-center mb-14">
        <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-3">
          New Arrivals
        </p>
        <h2 className="font-cormorant text-4xl lg:text-5xl font-light text-[#3d322a]">
          Featured <em className="italic text-[#b89a6a]">Pieces</em>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="product-hover group"
          >
            <div
              className="relative overflow-hidden mb-3 rounded-sm"
              style={{ aspectRatio: "3/4" }}
            >
              {product.featuredImage ? (
                <Image
                  data={product.featuredImage}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              ) : (
                <JewelleryPlaceholder label="New Arrival" />
              )}
              {/* Quick view */}
              <div
                className="quick-view absolute bottom-0 left-0 right-0 bg-[#0d0b09] text-[#d4b896] text-[9px] tracking-[0.25em] uppercase py-3 text-center"
                style={{ transform: "translateY(100%)", transition: "transform 0.3s ease" }}
              >
                Quick View
              </div>
              {/* Wishlist */}
              <button
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#b89a6a] hover:text-white rounded-sm"
                aria-label="Add to wishlist"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <h3 className="font-cormorant text-lg font-light leading-tight mb-1 text-[#3d322a]">
              {product.title}
            </h3>
            <Money
              data={product.priceRange.minVariantPrice}
              className="text-sm text-[#b89a6a] tracking-wide"
            />
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/collections/all"
          className="inline-block border border-[#b89a6a] text-[#b89a6a] px-12 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
        >
          View More
        </Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────
function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="bg-[#faf6f0] grid grid-cols-1 lg:grid-cols-2">
      {/* Text */}
      <div className="px-8 sm:px-10 lg:px-16 py-16 lg:py-20 flex flex-col justify-center">
        <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-4">
          Our Story
        </p>
        <h2 className="font-cormorant text-4xl lg:text-5xl font-light leading-tight text-[#3d322a] mb-6">
          About <em className="italic text-[#b89a6a]">Mayra</em>
          <br />
          By Gungun
        </h2>
        <p className="text-sm text-[#8a7a6e] leading-relaxed mb-4">
          At Mayra by Gungun, we believe jewelry is more than just an
          accessory—it's a story, a celebration, and an expression of who you
          are. As a trusted name in the silver jewelry manufacturing industry,
          we pride ourselves on creating timeless, elegant, and handcrafted
          pieces that resonate with individuality and charm.
        </p>
        <p className="text-sm text-[#8a7a6e] leading-relaxed mb-10">
          From bridal Ranihaar to everyday Kundan bangles, we bring you
          jewellery that lives in memory long after the moment has passed.
          Rooted in Jaipur's rich jewellery heritage.
        </p>
        <Link
          to="/pages/about"
          className="self-start border border-[#b89a6a] text-[#b89a6a] px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
        >
          Read More →
        </Link>
      </div>

      {/* Image */}
      <div className="relative min-h-[340px] lg:min-h-auto">
        {!imgError ? (
          <img
            src="https://mayrabygungun.com/public/assets/img/857x300.png"
            alt="About Mayra by Gungun"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8ddd2] to-[#d4c4b0] flex items-center justify-center">
            <div className="text-center px-8">
              <p className="font-cormorant text-3xl italic text-[#b89a6a] mb-3">
                "Cherish the Sparkle,
                <br />Embrace the Moment."
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a7a6e]">
                — Mayra by Gungun, since 2020
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// MID VIDEO SECTION
// ─────────────────────────────────────────
function MidVideoSection() {
  return (
    <section className="relative h-[460px] md:h-[560px] flex items-center justify-center overflow-hidden bg-[#0d0b09]">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://mayrabygungun.com/public/webtheme/12557744_1920_1080_24fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[#0d0b09]/50" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="text-[#d4b896] text-[10px] tracking-[0.4em] uppercase mb-6">
          The Collection
        </p>
        <h2 className="font-cormorant text-4xl md:text-5xl font-light text-white leading-tight mb-4">
          Exquisite jewelry designed to{" "}
          <em className="italic text-[#d4b896]">elevate</em> your style
        </h2>
        <p className="text-sm text-white/60 mb-10">
          Showcase your unique elegance with every piece.
        </p>
        <Link
          to="/collections/all"
          className="inline-block border border-[#b89a6a] text-[#d4b896] px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
        >
          Discover
        </Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// BLOG SECTION
// ─────────────────────────────────────────
type ArticleNode = {
  id: string;
  title: string;
  handle: string;
  publishedAt: string;
  image?: { url: string; altText?: string | null } | null;
  blog: { handle: string };
};

const FALLBACK_ARTICLES = [
  {
    id: "1",
    title: "The Ultimate Guide to Finding the Perfect Necklace: Unveiling the Best Styles, Materials.",
    handle: "the-ultimate-guide-to-finding-the-perfect-necklace-unveiling-the-best-styles-materials",
    publishedAt: "2024-03-04",
    image: { url: "https://mayrabygungun.com/public/uploads/all/Rc4XaRf4mYOgRPiqNT4N5aZbzvNnNLc420VK3d9Q.png" },
    blog: { handle: "news" },
  },
  {
    id: "2",
    title: "Budget-Friendly Options for Finding the Perfect Jewellery",
    handle: "budget-friendly-options-for-finding-the-perfect-jewellery",
    publishedAt: "2024-03-04",
    image: { url: "https://mayrabygungun.com/public/uploads/all/ZlNnNcJcl9rSEZVSlaI3ebThRXqk9TsoNgZ4Qzvv.png" },
    blog: { handle: "news" },
  },
  {
    id: "3",
    title: "The Timeless Art of Meenakari: Celebrating Heritage with Mayra by Gungun",
    handle: "the-timeless-art-of-meenakari-celebrating-heritage-with-mayra-by-gungun",
    publishedAt: "2023-10-17",
    image: { url: "https://mayrabygungun.com/public/uploads/all/qOG2CMlazHlw5rbOqDdwGQCXT1AOsp5XVSgjrcG0.png" },
    blog: { handle: "news" },
  },
];

function BlogSection({ articles }: { articles: ArticleNode[] }) {
  const displayArticles = articles.length > 0 ? articles.slice(0, 3) : FALLBACK_ARTICLES;

  return (
    <section className="bg-[#faf6f0] py-20 px-4 lg:px-10">
      <div className="text-center mb-14">
        <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-3">Journals</p>
        <h2 className="font-cormorant text-4xl lg:text-5xl font-light text-[#3d322a]">
          From Our <em className="italic text-[#b89a6a]">Story</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {displayArticles.map((article: any) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

function BlogCard({ article }: { article: any }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/blogs/${article.blog?.handle || "news"}/${article.handle}`}
      className="group"
    >
      <div className="relative overflow-hidden mb-5 rounded-sm" style={{ aspectRatio: "4/3" }}>
        {article.image?.url && !imgError ? (
          <img
            src={article.image.url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <JewelleryPlaceholder label="Journal" />
        )}
      </div>
      <p className="text-[#b89a6a] text-[10px] tracking-[0.2em] uppercase mb-2">
        {new Date(article.publishedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
      <h3 className="font-cormorant text-xl font-light text-[#3d322a] leading-snug mb-3 group-hover:text-[#b89a6a] transition-colors">
        {article.title}
      </h3>
      <span className="text-[10px] tracking-[0.2em] uppercase text-[#b89a6a] border-b border-[#b89a6a]/40 pb-px">
        Read the Story →
      </span>
    </Link>
  );
}

// ─────────────────────────────────────────
// INSTAGRAM SECTION
// ─────────────────────────────────────────
function InstagramSection() {
  const tiles = [
    "https://mayrabygungun.com/public/uploads/all/JKmeiVEjpGaKfd47GS6OBjM8OzP5ZbYj2cyNwt1i.png",
    "https://mayrabygungun.com/public/uploads/all/jrjRzvoK3jzfUwfE1lLAOhg0zBoEu7BaDciAtCqs.jpg",
    "https://mayrabygungun.com/public/uploads/all/A76G5ykSTngFGXJeaiYQgD73uVy1QQBizSamBWZd.jpg",
    "https://mayrabygungun.com/public/uploads/all/2VIC0I4QZEZ14lxhtfyDl9hRDtp7Z9ISU2wkk3RT.jpg",
    "https://mayrabygungun.com/public/uploads/all/AcqsS6DL9i5pLJXqXinAowDaEI1GHmC6hTC4NhhG.png",
    "https://mayrabygungun.com/public/uploads/all/JJDPGVlgVsJ04kU9eqatlVdu73vTu138HW7LTBZv.png",
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="text-center mb-10">
        <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-3">Follow Us</p>
        <a
          href="https://www.instagram.com/mayrabygungun/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-cormorant text-3xl lg:text-4xl font-light text-[#3d322a] hover:text-[#b89a6a] transition-colors"
        >
          @mayrabygungun
        </a>
        <p className="text-xs text-[#8a7a6e] mt-2 tracking-wide">Our Instagram Feeds</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 max-w-6xl mx-auto">
        {tiles.map((src, i) => (
          <InstaThumb key={i} src={src} index={i} />
        ))}
      </div>
    </section>
  );
}

function InstaThumb({ src, index }: { src: string; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href="https://www.instagram.com/mayrabygungun/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden block rounded-sm"
      style={{ aspectRatio: "1" }}
    >
      {!imgError ? (
        <img
          src={src}
          alt={`Instagram post ${index + 1}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full img-placeholder" />
      )}
      <div className="absolute inset-0 bg-[#b89a6a]/0 group-hover:bg-[#b89a6a]/35 transition-colors duration-300 flex items-center justify-center">
        <svg
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-[#b89a6a] py-16 px-6 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-cormorant text-[20vw] font-light text-[#a08050]/20 leading-none whitespace-nowrap">
          Mayra
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-[#1a1410]/60 text-[10px] tracking-[0.4em] uppercase mb-4">Inner Circle</p>
        <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1410] mb-2">
          Every Piece Tells a Story,
          <br />
          Let Yours <em className="italic">Shine Through</em>
        </h2>
        <p className="text-xs tracking-wide text-[#1a1410]/70 mb-8">
          Subscribe to our Newsletter and get 15% off your first order.
        </p>

        {submitted ? (
          <p className="text-[#1a1410] font-medium tracking-wide py-3">
            ✓ Thank you! Welcome to the Mayra family.
          </p>
        ) : (
          <div className="flex max-w-md mx-auto border border-[#1a1410]/30 bg-white/20">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3 bg-transparent text-[#1a1410] text-sm placeholder:text-[#1a1410]/50 outline-none min-w-0"
            />
            <button
              type="button"
              onClick={() => { if (email) setSubmitted(true); }}
              className="px-5 sm:px-6 py-3 bg-[#1a1410] text-[#d4b896] text-[10px] tracking-[0.2em] uppercase hover:bg-[#3d322a] transition-colors flex-shrink-0"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────
function FooterSection() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-[#1a1410] text-[#faf6f0]/70">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="block mb-5">
            {!logoError ? (
              <img
                src="https://mayrabygungun.com/public/assets/img/mayra by gungun website 2.png"
                alt="Mayra by Gungun"
                className="h-14 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-cormorant text-2xl text-[#faf6f0] font-light block">
                Mayra by Gungun
              </span>
            )}
          </Link>
          <p className="text-sm leading-relaxed text-[#faf6f0]/50 mb-6">
            Cherish the Sparkle, Embrace the Moment. Handcrafted fine jewellery from Jaipur since 2020.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/mayrabygungun/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#b89a6a]/40 flex items-center justify-center text-[#b89a6a] hover:bg-[#b89a6a] hover:text-[#1a1410] transition-all"
              aria-label="Instagram"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://wa.link/0cknis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#b89a6a]/40 flex items-center justify-center text-[#b89a6a] hover:bg-[#b89a6a] hover:text-[#1a1410] transition-all"
              aria-label="WhatsApp"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#faf6f0] mb-6">Pages</h4>
          <ul className="space-y-3">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/pages/about" },
              { label: "Store", to: "/collections/all" },
              { label: "Contact Us", to: "/pages/contact" },
              { label: "Gallery", to: "/pages/gallery" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-sm hover:text-[#b89a6a] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Shop */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#faf6f0] mb-6">Quick Shop</h4>
          <ul className="space-y-3">
            {[
              { label: "Necklace", to: "/collections/decore-ecqxq" },
              { label: "Bangles", to: "/collections/bangles-88lzu" },
              { label: "Earrings", to: "/collections/long-earrings-hoxji" },
              { label: "Hand Bags", to: "/collections/hand-bags-jchto" },
              { label: "Ranihaar", to: "/collections/ranihar-19e5h" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-sm hover:text-[#b89a6a] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#faf6f0] mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <svg className="text-[#b89a6a] flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919660090441" className="text-sm hover:text-[#b89a6a]">+91 96600 90441</a>
            </li>
            <li className="flex gap-3 items-start">
              <svg className="text-[#b89a6a] flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:mayrabygungun2@gmail.com" className="text-sm hover:text-[#b89a6a] break-all">
                mayrabygungun2@gmail.com
              </a>
            </li>
            <li className="flex gap-3 items-start">
              <svg className="text-[#b89a6a] flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm leading-relaxed">
                Bordi Ka Rasta, 607, Kishanpole Bazar,<br />
                Jaipur, Rajasthan – 302001
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#faf6f0]/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#faf6f0]/40">©2024–2025 MayraByGungun. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { label: "Terms & Conditions", to: "/pages/terms" },
              { label: "Privacy Policy", to: "/pages/privacy-policy" },
              { label: "Shipping Policy", to: "/pages/shipping-policy" },
              { label: "Refund Policy", to: "/pages/return-policy" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[10px] tracking-wide text-[#faf6f0]/40 hover:text-[#b89a6a] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────
// GraphQL Queries
// ─────────────────────────────────────────
const FEATURED_COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image { url altText width height }
      }
    }
  }
` as const;

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        featuredImage { url altText width height }
      }
    }
  }
` as const;

const FEATURED_ARTICLES_QUERY = `#graphql
  query FeaturedArticles {
    articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        publishedAt
        image { url altText }
        blog { handle }
      }
    }
  }
` as const;