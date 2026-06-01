import { useLoaderData, Link } from "react-router";
import { CartForm, Image, Money } from "@shopify/hydrogen";
import type { Route } from "./+types/cart";

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction = () => [
  { title: "My Cart | Mayra by Gungun" },
];

// ─────────────────────────────────────────
// Loader
// ─────────────────────────────────────────
export async function loader({ context }: Route.LoaderArgs) {
  const cart = await context.cart.get();
  return { cart };
}

// ─────────────────────────────────────────
// Action
// ─────────────────────────────────────────
export async function action({ request, context }: Route.ActionArgs) {
  const { cart } = context;
  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);


  let result;

  if (action === CartForm.ACTIONS.LinesAdd) {
    result = await cart.addLines(inputs.lines);
  } else if (action === CartForm.ACTIONS.LinesUpdate) {
    result = await cart.updateLines(inputs.lines);
  } else if (action === CartForm.ACTIONS.LinesRemove) {
    result = await cart.removeLines(inputs.lineIds);
  } else {
    throw new Error(`Unexpected action: ${action}`);
  }

  const headers = cart.setCartId(result.cart.id);
  return { cart: result.cart, errors: result.userErrors, headers };
}

// ─────────────────────────────────────────
// Step Indicator
// ─────────────────────────────────────────
const STEPS = [
  { id: 1, label: "My Cart" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Delivery" },
  { id: 4, label: "Payment" },
  { id: 5, label: "Confirmation" },
];

function StepIndicator({ current = 1 }: { current?: number }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[#e8ddd2] z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-[#b89a6a] z-0 transition-all duration-700"
          style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step) => {
          const isCompleted = step.id < current;
          const isActive = step.id === current;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 text-[10px] font-medium
                  ${isCompleted
                    ? "bg-[#b89a6a] border-[#b89a6a] text-[#0d0b09]"
                    : isActive
                      ? "bg-[#faf6f0] border-[#b89a6a] text-[#b89a6a]"
                      : "bg-[#faf6f0] border-[#e8ddd2] text-[#c4b4a4]"
                  }`}
              >
                {isCompleted ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[9px] tracking-[0.15em] uppercase hidden sm:block transition-colors duration-300
                  ${isActive ? "text-[#b89a6a] font-medium" : isCompleted ? "text-[#8a7a6e]" : "text-[#c4b4a4]"}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Cart Line Item — FIXED quantity controls
// CartForm se properly lines update hoga
// ─────────────────────────────────────────
function CartLineItem({ line }: { line: any }) {
  const { id, quantity, merchandise, cost } = line;

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-[#e8ddd2] group fade-in">
      {/* Image */}
      <div className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 overflow-hidden rounded-sm bg-[#f5efe8]">
        {merchandise.image ? (
          <Image
            data={merchandise.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="opacity-30">
              <circle cx="24" cy="24" r="10" stroke="#b89a6a" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="5" stroke="#b89a6a" strokeWidth="1" />
              <path d="M24 4L24 14M24 34L24 44M4 24L14 24M34 24L44 24" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-cormorant text-xl font-light text-[#3d322a] leading-snug mb-1">
              {merchandise.product.title}
            </h3>
            {merchandise.title !== "Default Title" && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6e] mb-2">
                {merchandise.title}
              </p>
            )}
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#b89a6a]">
              Handcrafted · Jaipur
            </p>
          </div>

          {/* ── Remove button ── */}
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{ lineIds: [id] }}
          >
            <button
              type="submit"
              className="text-[#c4b4a4] hover:text-[#b89a6a] transition-colors p-1 flex-shrink-0"
              aria-label="Remove item"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </CartForm>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* ── Quantity controls — each button is its own form ── */}
          <div className="inline-flex border border-[#d4c4b0]">
            {/* Decrease */}
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesUpdate}
              inputs={{
                lines: [{ id, quantity: Math.max(1, quantity - 1) }],
              }}
            >
              <button
                type="submit"
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-[#3d322a] hover:bg-[#e8ddd2] transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                −
              </button>
            </CartForm>

            {/* Count display */}
            <span className="w-10 h-8 flex items-center justify-center text-[11px] font-medium border-x border-[#d4c4b0] text-[#3d322a]">
              {quantity}
            </span>

            {/* Increase */}
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesUpdate}
              inputs={{
                lines: [{ id, quantity: quantity + 1 }],
              }}
            >
              <button
                type="submit"
                className="w-8 h-8 flex items-center justify-center text-[#3d322a] hover:bg-[#e8ddd2] transition-colors text-sm"
                aria-label="Increase quantity"
              >
                +
              </button>
            </CartForm>
          </div>

          {/* Price */}
          <Money
            data={cost.totalAmount}
            className="font-cormorant text-xl font-light text-[#b89a6a]"
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center fade-in">
      <div className="mb-8 opacity-30">
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="10" stroke="#b89a6a" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="5" stroke="#b89a6a" strokeWidth="1" />
          <path d="M24 4L24 14M24 34L24 44M4 24L14 24M34 24L44 24" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="24" cy="4" r="2" fill="#b89a6a" opacity="0.6" />
          <circle cx="24" cy="44" r="2" fill="#b89a6a" opacity="0.6" />
          <circle cx="4" cy="24" r="2" fill="#b89a6a" opacity="0.6" />
          <circle cx="44" cy="24" r="2" fill="#b89a6a" opacity="0.6" />
        </svg>
      </div>
      <p className="font-cormorant text-3xl font-light text-[#3d322a] mb-2">
        Your cart is empty
      </p>
      <p className="text-[11px] tracking-[0.2em] uppercase text-[#8a7a6e] mb-8">
        Discover our handcrafted pieces
      </p>
      <Link
        to="/collections/all"
        className="inline-block bg-[#3d322a] text-[#faf6f0] px-10 py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300"
      >
        Explore Collections
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function CartPage() {
  const { cart } = useLoaderData<typeof loader>();
  const lines = cart?.lines?.nodes ?? [];
  const isEmpty = lines.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost { font-family: 'Jost', sans-serif; }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .checkout-btn {
          background: #3d322a;
          transition: background 0.3s ease;
        }
        .checkout-btn:hover {
          background: #b89a6a;
          color: #0d0b09;
        }
        @media (min-width: 1024px) {
          .summary-sticky { position: sticky; top: 2rem; }
        }
        .promo-input:focus { outline: none; border-color: #b89a6a; }
      `}</style>

      <main className="min-h-screen bg-[#faf6f0] font-jost text-[#3d322a]">

        {/* Breadcrumb */}
        <div className="bg-[#f0ebe3] border-b border-[#e8ddd2] px-6 lg:px-10 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#8a7a6e]">
            <Link to="/" className="hover:text-[#b89a6a] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#3d322a]">Cart</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center pt-10 pb-2 fade-up">
          <p className="text-[#b89a6a] text-[10px] tracking-[0.4em] uppercase mb-2">
            Mayra by Gungun
          </p>
          <h1 className="font-cormorant text-4xl lg:text-5xl font-light text-[#3d322a]">
            Your <em className="italic text-[#b89a6a]">Selection</em>
          </h1>
        </div>

        {/* Steps */}
        <StepIndicator current={1} />

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="max-w-6xl mx-auto px-4 lg:px-10 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">

              {/* LEFT: Items */}
              <div className="fade-up" style={{ animationDelay: "0.05s" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a7a6e]">
                    {lines.length} {lines.length === 1 ? "Item" : "Items"}
                  </p>
                  <Link
                    to="/collections/all"
                    className="text-[10px] tracking-[0.2em] uppercase text-[#b89a6a] hover:text-[#3d322a] transition-colors flex items-center gap-1.5"
                  >
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>

                <div className="border-t border-[#e8ddd2]">
                  {lines.map((line: any) => (
                    <CartLineItem key={line.id} line={line} />
                  ))}
                </div>

                {/* Promo */}
                <div className="mt-8 p-5 border border-[#e8ddd2] bg-white">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a7a6e] mb-3">
                    Promo / Gift Code
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="promo-input flex-1 border border-[#d4c4b0] px-4 py-3 text-[11px] tracking-[0.1em] bg-[#faf6f0] placeholder-[#c4b4a4] transition-colors duration-200"
                    />
                    <button className="bg-[#3d322a] text-[#faf6f0] px-6 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-[#b89a6a] hover:text-[#0d0b09] transition-all duration-300">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-[#e8ddd2]">
                  {[
                    { icon: "🚚", label: "Free Delivery", sub: "Above ₹999" },
                    { icon: "↩️", label: "Easy Returns", sub: "7 days" },
                    { icon: "🔒", label: "Secure Pay", sub: "100% safe" },
                  ].map((b, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xl block mb-1">{b.icon}</span>
                      <p className="text-[9px] tracking-[0.15em] uppercase font-medium text-[#3d322a]">{b.label}</p>
                      <p className="text-[9px] text-[#8a7a6e]">{b.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Summary */}
              <div className="summary-sticky fade-up" style={{ animationDelay: "0.12s" }}>
                <div className="bg-white border border-[#e8ddd2] p-6 lg:p-8">
                  <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-[#e8ddd2]">
                    <h2 className="font-cormorant text-2xl font-light text-[#3d322a]">Order Summary</h2>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#8a7a6e]">
                      {lines.length} {lines.length === 1 ? "piece" : "pieces"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {lines.map((line: any) => (
                      <div key={line.id} className="flex justify-between items-start gap-2">
                        <span className="text-[11px] text-[#3d322a] leading-snug flex-1">
                          {line.merchandise.product.title}
                          {line.quantity > 1 && (
                            <span className="text-[#8a7a6e] ml-1">×{line.quantity}</span>
                          )}
                        </span>
                        <Money data={line.cost.totalAmount} className="text-[11px] text-[#3d322a] flex-shrink-0" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-t border-b border-[#e8ddd2] mb-6">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#8a7a6e] tracking-[0.1em] uppercase text-[10px]">Subtotal</span>
                      {cart?.cost?.subtotalAmount && (
                        <Money data={cart.cost.subtotalAmount} className="text-[#3d322a]" />
                      )}
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#8a7a6e] tracking-[0.1em] uppercase text-[10px]">Shipping</span>
                      <span className="text-[#3d322a]">
                        {Number(cart?.cost?.subtotalAmount?.amount) >= 999
                          ? <span className="text-[#b89a6a]">Free</span>
                          : "Calculated at next step"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#8a7a6e] tracking-[0.1em] uppercase text-[10px]">Taxes</span>
                      <span className="text-[#3d322a]">Included</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-7">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#8a7a6e]">Total</span>
                    {cart?.cost?.totalAmount && (
                      <Money data={cart.cost.totalAmount} className="font-cormorant text-3xl font-light text-[#b89a6a]" />
                    )}
                  </div>

                  {cart?.checkoutUrl && (
                    <a
                      href={cart.checkoutUrl}
                      className="checkout-btn block w-full text-center text-[#faf6f0] px-8 py-4 text-[10px] tracking-[0.35em] uppercase"
                    >
                      Proceed to Checkout
                    </a>
                  )}

                  <a
                    href="https://wa.link/0cknis?text=Hi! I'd like to place an order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 border border-[#d4c4b0] px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[#3d322a] hover:border-[#b89a6a] hover:text-[#b89a6a] transition-all duration-300 w-full"
                  >
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order via WhatsApp
                  </a>

                  <p className="text-center text-[9px] tracking-[0.1em] text-[#c4b4a4] mt-5 uppercase">
                    Secured by SSL · Razorpay / UPI
                  </p>
                </div>

                {/* What happens next */}
                <div className="mt-6 bg-white border border-[#e8ddd2] p-5">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#8a7a6e] mb-4">What happens next</p>
                  <div className="space-y-3">
                    {[
                      { step: "Shipping", desc: "Enter your delivery address" },
                      { step: "Delivery", desc: "Choose your delivery speed" },
                      { step: "Payment", desc: "Pay securely via Razorpay" },
                      { step: "Confirmation", desc: "Order confirmed & dispatched" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-[#e8ddd2] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[8px] text-[#c4b4a4]">{i + 2}</span>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-[#3d322a] font-medium">{s.step}</p>
                          <p className="text-[10px] text-[#8a7a6e]">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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