import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/product.$handle";
import { Image, Money, CartForm } from "@shopify/hydrogen";
import { useState } from "react";

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product?.title ?? "Product"} | Mayra by Gungun` },
    {
      name: "description",
      content: data?.product?.description ?? "Handcrafted fine jewellery from Jaipur.",
    },
  ];
};

// ─────────────────────────────────────────
// Loader
// ─────────────────────────────────────────
export async function loader({ params, context }: Route.LoaderArgs) {
  const { storefront } = context;
  const { handle } = params;

  if (!handle) throw new Response("Not found", { status: 404 });

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
  });

  if (!product) throw new Response("Product not found", { status: 404 });

  const { products } = await storefront.query(RELATED_PRODUCTS_QUERY, {
    variables: { count: 8 },
  });

  // Filter out the current product from related list
  const relatedProducts = (products?.nodes ?? []).filter(
    (p: any) => p.id !== product.id
  ).slice(0, 4);

  return { product, relatedProducts };
}

// ─────────────────────────────────────────
// Jewellery Placeholder (same as index.tsx)
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
// Page
// ─────────────────────────────────────────
export default function ProductPage() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.nodes[0]
  );
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "care">("description");
  const [activeImage, setActiveImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  const images =
    product.images?.nodes?.length > 0
      ? product.images.nodes
      : [product.featuredImage].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost { font-family: 'Jost', sans-serif; }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
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
        .thumb-active { border-color: #b89a6a !important; }
        .variant-active {
          background: #b89a6a !important;
          color: #0d0b09 !important;
          border-color: #b89a6a !important;
        }
        .tab-active {
          border-bottom-color: #b89a6a !important;
          color: #3d322a !important;
        }
        .add-cart-btn:hover { background: #3d322a; }
        .buy-btn:hover { background: #a08050; }
        .zoom-img:hover { transform: scale(1.04); }
        .zoom-img { transition: transform 0.6s ease; }
        .related-card:hover img { transform: scale(1.06); }
        .related-card img { transition: transform 0.6s ease; }
      `}</style>

      <main className="min-h-screen bg-[#faf6f0] font-jost text-[#3d322a]">
        {/* ── Breadcrumb ── */}
        <div className="bg-[#f0ebe3] border-b border-[#e8ddd2] px-6 lg:px-10 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#8a7a6e]">
            <Link to="/" className="hover:text-[#b89a6a] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections/all" className="hover:text-[#b89a6a] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#3d322a]">{product.title}</span>
          </div>
        </div>

        {/* ── Main Product Section ── */}
        <section className="max-w-6xl mx-auto px-4 lg:px-10 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* LEFT — Image Gallery */}
            <div className="fade-up">
              {/* Main image */}
              <div
                className="relative overflow-hidden rounded-sm bg-[#f5efe8] mb-4"
                style={{ aspectRatio: "4/5" }}
              >
                {images[activeImage] ? (
                  <Image
                    data={images[activeImage]}
                    className="w-full h-full object-cover zoom-img"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                ) : (
                  <JewelleryPlaceholder label={product.title} />
                )}

                {/* Wishlist button on image */}
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 flex items-center justify-center transition-all duration-300 hover:bg-[#b89a6a] group rounded-sm"
                  aria-label="Add to wishlist"
                >
                  <svg
                    width="16"
                    height="16"
                    fill={wishlist ? "#b89a6a" : "none"}
                    stroke={wishlist ? "#b89a6a" : "currentColor"}
                    viewBox="0 0 24 24"
                    className="group-hover:stroke-[#0d0b09] group-hover:fill-[#0d0b09] transition-all"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-[#0d0b09]/60 text-[#faf6f0] text-[10px] tracking-[0.2em] px-3 py-1.5">
                    {activeImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all duration-200 ${activeImage === i
                        ? "thumb-active"
                        : "border-transparent hover:border-[#d4b896]"
                        }`}
                    >
                      {img ? (
                        <Image
                          data={img}
                          className="w-full h-full object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full img-placeholder" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Product Info */}
            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              {/* Category tag */}
              {product.collections?.nodes?.[0] && (
                <Link
                  to={`/collections/${product.collections.nodes[0].handle}`}
                  className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#b89a6a] mb-4 hover:text-[#3d322a] transition-colors"
                >
                  {product.collections.nodes[0].title}
                </Link>
              )}

              {/* Title */}
              <h1 className="font-cormorant text-4xl lg:text-5xl font-light leading-tight text-[#3d322a] mb-4">
                {product.title}
              </h1>

              {/* Rating row (static 5-star for design; wire up reviews if you have them) */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="13" height="13" fill="#b89a6a" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] tracking-[0.15em] text-[#8a7a6e] uppercase">
                  Handcrafted · Jaipur
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-[#e8ddd2]">
                <Money
                  data={selectedVariant.price}
                  className="font-cormorant text-3xl font-light text-[#b89a6a]"
                />
                {selectedVariant.compareAtPrice && (
                  <Money
                    data={selectedVariant.compareAtPrice}
                    className="text-sm text-[#8a7a6e] line-through ml-3"
                  />
                )}
                <p className="text-[11px] tracking-[0.15em] text-[#8a7a6e] uppercase mt-1">
                  Weight: 32gm · Silver &amp; Gold-plated
                </p>
              </div>

              {/* Variants (if multiple) */}
              {product.variants.nodes.length > 1 && (
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#8a7a6e] mb-3">
                    Options
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.nodes.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase border transition-all duration-200 rounded-sm ${selectedVariant.id === variant.id
                          ? "variant-active"
                          : "border-[#d4c4b0] text-[#8a7a6e] hover:border-[#b89a6a]"
                          }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#8a7a6e] mb-3">
                  Quantity
                </p>
                <div className="inline-flex border border-[#d4c4b0]">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#3d322a] hover:bg-[#e8ddd2] transition-colors text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-[#d4c4b0]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#3d322a] hover:bg-[#e8ddd2] transition-colors text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#8a7a6e] ml-4">
                  {selectedVariant.availableForSale ? "In stock" : "Out of stock"}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {selectedVariant.availableForSale ? (
                  <>
                    <CartForm
                      route="/cart"
                      action={CartForm.ACTIONS.LinesAdd}
                      inputs={{
                        lines: [
                          {
                            merchandiseId: selectedVariant.id,
                            quantity: qty,
                          },
                        ],
                      }}
                    >
                      <button
                        type="submit"
                        className="add-cart-btn flex-1 bg-[#3d322a] text-[#faf6f0] px-8 py-4 text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
                      >
                        Add to Cart
                      </button>
                    </CartForm>

                    <CartForm
                      route="/cart"
                      action={CartForm.ACTIONS.LinesAdd}
                      inputs={{
                        lines: [{ merchandiseId: selectedVariant.id, quantity: qty }],
                      }}
                    >
                      <button
                        type="submit"
                        name="redirectTo"
                        value="/checkout"
                        className="buy-btn flex-1 bg-[#b89a6a] text-[#0d0b09] px-8 py-4 text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
                      >
                        Buy Now
                      </button>
                    </CartForm>
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-[#e8ddd2] text-[#8a7a6e] px-8 py-4 text-[10px] tracking-[0.3em] uppercase cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.link/0cknis?text=Hi! I'm interested in ${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-[#d4c4b0] px-5 py-3 text-[11px] tracking-[0.2em] uppercase text-[#3d322a] hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-300 w-full justify-center mb-6"
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire on WhatsApp
              </a>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#e8ddd2]">
                {[
                  { icon: "🚚", label: "Free Delivery", sub: "Above ₹999" },
                  { icon: "↩️", label: "Easy Returns", sub: "7 days" },
                  { icon: "🔒", label: "Secure Pay", sub: "100% safe" },
                ].map((b, i) => (
                  <div key={i} className="text-center">
                    <span className="text-xl block mb-1">{b.icon}</span>
                    <p className="text-[9px] tracking-[0.15em] uppercase font-medium text-[#3d322a]">
                      {b.label}
                    </p>
                    <p className="text-[9px] text-[#8a7a6e]">{b.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Description / Details / Care Tabs ── */}
        <section className="bg-white py-14 px-4 lg:px-10">
          <div className="max-w-3xl mx-auto">
            {/* Tab headers */}
            <div className="flex border-b border-[#e8ddd2] mb-8 gap-0">
              {(["description", "details", "care"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-[10px] tracking-[0.3em] uppercase border-b-2 -mb-px transition-all duration-200 ${activeTab === tab
                    ? "tab-active border-[#b89a6a] text-[#3d322a]"
                    : "border-transparent text-[#8a7a6e] hover:text-[#3d322a]"
                    }`}
                >
                  {tab === "description" ? "Description" : tab === "details" ? "Details" : "Care"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "description" && (
              <div
                className="font-cormorant text-lg font-light text-[#3d322a] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                {[
                  { label: "Material", value: "925 Sterling Silver, Gold Plated" },
                  { label: "Stone", value: "Soft Pink Stone Accents" },
                  { label: "Weight", value: "32 gm (approx.)" },
                  { label: "Finish", value: "Kundan & Meena" },
                  { label: "Origin", value: "Handcrafted in Jaipur, Rajasthan" },
                  { label: "Occasion", value: "Festive, Bridal, Formal" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-3 border-b border-[#e8ddd2] text-sm"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6e]">
                      {row.label}
                    </span>
                    <span className="text-[#3d322a] font-light">{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-5 font-cormorant text-lg font-light text-[#3d322a] leading-relaxed">
                {[
                  "Store in the velvet pouch provided to prevent tarnishing.",
                  "Keep away from water, perfume, and harsh chemicals.",
                  "Wipe gently with a soft dry cloth after each use.",
                  "Avoid wearing during heavy physical activity.",
                  "For deep cleaning, consult a certified jeweller.",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-cormorant text-2xl text-[#b89a6a] font-light leading-none mt-0.5">
                      0{i + 1}
                    </span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#faf6f0] py-16 px-4 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-3">
                You May Also Like
              </p>
              <h2 className="font-cormorant text-4xl font-light text-[#3d322a]">
                Related <em className="italic text-[#b89a6a]">Pieces</em>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
              {relatedProducts.slice(0, 4).map((p: any) => (
                <Link
                  key={p.id}
                  to={`/products/${p.handle}`}
                  className="related-card group"
                >
                  <div
                    className="relative overflow-hidden mb-3 rounded-sm"
                    style={{ aspectRatio: "3/4" }}
                  >
                    {p.featuredImage ? (
                      <Image
                        data={p.featuredImage}
                        className="w-full h-full object-cover"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                    ) : (
                      <JewelleryPlaceholder />
                    )}
                    <div className="absolute inset-0 bg-[#0d0b09]/0 group-hover:bg-[#0d0b09]/10 transition-colors duration-300" />
                  </div>
                  <h3 className="font-cormorant text-lg font-light text-[#3d322a] leading-tight mb-1 group-hover:text-[#b89a6a] transition-colors">
                    {p.title}
                  </h3>
                  <Money
                    data={p.priceRange.minVariantPrice}
                    className="text-sm text-[#b89a6a]"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Mid Banner ── */}
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
// GraphQL Queries
// ─────────────────────────────────────────
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 8) {
        nodes {
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      collections(first: 1) {
        nodes {
          title
          handle
        }
      }
    }
  }
` as const;

const RELATED_PRODUCTS_QUERY = `#graphql
  query RelatedProducts($count: Int!) {
    products(first: $count, sortKey: UPDATED_AT, reverse: true) {
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
      }
    }
  }
` as const;