import { Link } from "react-router";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────
// FOOTER — Alag component file
// Import karo: import { FooterSection } from "~/components/footer";
// ─────────────────────────────────────────

export function FooterSection() {
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-[#1a1410] text-[#faf6f0]/70">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

        {/* ── Brand ── */}
        <div>
          <Link to="/" className="block mb-5">
            {mounted && logoError ? (
              <span className="font-cormorant text-2xl text-[#faf6f0] font-light block">
                Mayra by Gungun
              </span>
            ) : (
              <img
                src="https://mayrabygungun.com/public/assets/img/mayra by gungun website 2.png"
                alt="Mayra by Gungun"
                className="h-14 object-contain"
                onError={() => setLogoError(true)}
                suppressHydrationWarning
              />
            )}
          </Link>
          <p className="text-sm leading-relaxed text-[#faf6f0]/50 mb-6">
            Cherish the Sparkle, Embrace the Moment. Handcrafted fine jewellery
            from Jaipur since 2020.
          </p>
          <div className="flex gap-3">
            {/* Instagram */}
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
            {/* WhatsApp */}
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

        {/* ── Pages ── */}
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

        {/* ── Quick Shop ── */}
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

        {/* ── Contact ── */}
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

      {/* ── Bottom bar ── */}
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