/**
 * Add these inside your root.tsx <head> section for Google Fonts:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com" />
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 * <link
 *   href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
 *   rel="stylesheet"
 * />
 *
 * ──────────────────────────────────────
 * NAVBAR component (app/components/Header.tsx)
 * ──────────────────────────────────────
 */

import { Link, useCart } from "@shopify/hydrogen";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Shop",
      href: "/collections/all",
      children: [
        { label: "All", href: "/collections/all" },
        { label: "Necklace", href: "/collections/necklace" },
        { label: "Bangles", href: "/collections/bangles" },
        { label: "Earrings", href: "/collections/earrings" },
        { label: "Hand Bags", href: "/collections/hand-bags" },
        { label: "Ranihaar", href: "/collections/ranihaar" },
      ],
    },
    { label: "About", href: "/pages/about" },
    { label: "Gallery", href: "/pages/gallery" },
    { label: "Contact", href: "/pages/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf6f0]/97 backdrop-blur-sm border-b border-[#b89a6a]/20 h-[70px] flex items-center px-6 lg:px-10">
      {/* Logo */}
      <Link to="/" className="font-cormorant text-xl lg:text-2xl tracking-[0.12em] uppercase text-[#1a1410] mr-auto">
        Mayra <em className="text-[#b89a6a] not-italic italic">by Gungun</em>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <div key={link.label} className="relative group">
            <Link
              to={link.href}
              className="text-[11px] tracking-[0.15em] uppercase text-[#3d322a] hover:text-[#b89a6a] transition-colors"
            >
              {link.label}
            </Link>
            {/* Dropdown */}
            {link.children && (
              <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-[#faf6f0] border border-[#b89a6a]/20 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {link.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block px-4 py-2.5 text-[11px] tracking-[0.1em] uppercase text-[#3d322a] hover:bg-[#b89a6a]/10 hover:text-[#b89a6a]"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-5 ml-8">
        {/* Search */}
        <button aria-label="Search" className="text-[#3d322a] hover:text-[#b89a6a] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        {/* Wishlist */}
        <Link to="/wishlist" aria-label="Wishlist" className="text-[#3d322a] hover:text-[#b89a6a] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </Link>
        {/* Cart */}
        <Link to="/cart" aria-label="Cart" className="text-[#3d322a] hover:text-[#b89a6a] transition-colors relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden text-[#3d322a]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {menuOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-[#faf6f0] border-b border-[#b89a6a]/20 py-6 px-6 flex flex-col gap-4 lg:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[12px] tracking-[0.15em] uppercase text-[#3d322a] hover:text-[#b89a6a] py-1 border-b border-[#b89a6a]/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-6 mt-4 text-[10px] tracking-[0.2em] uppercase text-[#8a7a6e]">
            <a href="https://wa.link/0cknis" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="https://www.instagram.com/mayrabygungun/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="tel:+919660090441">+91 96600 90441</a>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * ──────────────────────────────────────
 * FOOTER component (app/components/Footer.tsx)
 * ──────────────────────────────────────
 */
export function Footer() {
  const footerLinks = {
    Shop: [
      { label: "Necklace", href: "/collections/necklace" },
      { label: "Earrings", href: "/collections/earrings" },
      { label: "Bangles", href: "/collections/bangles" },
      { label: "Ranihaar", href: "/collections/ranihaar" },
      { label: "Hand Bags", href: "/collections/hand-bags" },
    ],
    Help: [
      { label: "About Us", href: "/pages/about" },
      { label: "Contact", href: "/pages/contact" },
      { label: "Gallery", href: "/pages/gallery" },
      { label: "Shipping Policy", href: "/policies/shipping-policy" },
      { label: "Returns", href: "/policies/refund-policy" },
    ],
    Connect: [
      { label: "Instagram", href: "https://www.instagram.com/mayrabygungun/" },
      { label: "WhatsApp", href: "https://wa.link/0cknis" },
      { label: "+91 96600 90441", href: "tel:+919660090441" },
    ],
  };

  return (
    <footer className="bg-[#1a1410] text-[#faf6f0]/60 pt-16 pb-8 px-6 lg:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 max-w-6xl mx-auto">
        {/* Brand */}
        <div>
          <Link to="/" className="font-cormorant text-xl tracking-[0.12em] uppercase text-[#faf6f0] block mb-4">
            Mayra <em className="text-[#b89a6a] italic">by Gungun</em>
          </Link>
          <p className="text-sm leading-relaxed max-w-[220px]">
            Handcrafted fine jewellery rooted in Indian heritage. Made with love, worn with pride.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://www.instagram.com/mayrabygungun/" target="_blank" rel="noreferrer" className="hover:text-[#b89a6a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://wa.link/0cknis" target="_blank" rel="noreferrer" className="hover:text-[#b89a6a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#b89a6a] mb-4 font-medium">{title}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#faf6f0]/50 hover:text-[#d4b896] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/8 pt-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-2 text-xs">
        <span>© 2025 Mayra by Gungun. All rights reserved.</span>
        <span>Made with love in India 🇮🇳</span>
      </div>
    </footer>
  );
}