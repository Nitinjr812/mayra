import { Link, useLocation } from "react-router";
import { Suspense, useState, useEffect, useRef } from "react";
import { Await } from "react-router";
import { useAside } from "~/components/Aside";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type CartCount = number | null;

interface NavbarProps {
    cart: Promise<{ totalQuantity: number } | null>;
    isLoggedIn: Promise<boolean>;
}

// ─────────────────────────────────────────
// Nav structure
// ─────────────────────────────────────────
const NAV_ITEMS = [
    { label: "Home", to: "/" },
    {
        label: "Shop",
        to: "/collections/all",
        dropdown: [
            { label: "All Products", to: "/collections/all" },
            { label: "Necklace", to: "/collections/decore-ecqxq" },
            { label: "Bangles", to: "/collections/bangles-88lzu" },
            { label: "Earrings", to: "/collections/long-earrings-hoxji" },
            { label: "Hand Bags", to: "/collections/hand-bags-jchto" },
            { label: "Ranihaar", to: "/collections/ranihar-19e5h" },
        ],
    },
    {
        label: "Necklace",
        to: "/collections/decore-ecqxq",
        dropdown: [
            { label: "View All Necklace", to: "/collections/decore-ecqxq" },
            { label: "Bridal", to: "/collections/decore-ecqxq?filter=Bridal" },
            { label: "Chokar", to: "/collections/decore-ecqxq?filter=Chokar" },
            { label: "Single Line", to: "/collections/decore-ecqxq?filter=Single+line" },
            { label: "Heritage", to: "/collections/decore-ecqxq?filter=Heritage" },
            { label: "Round Necklace", to: "/collections/decore-ecqxq?filter=round-necklace" },
        ],
    },
    {
        label: "Bangles",
        to: "/collections/bangles-88lzu",
        dropdown: [
            { label: "View All Bangles", to: "/collections/bangles-88lzu" },
            { label: "Kundan Meena", to: "/collections/bangles-88lzu?filter=kundan-meena" },
            { label: "Sapphire", to: "/collections/bangles-88lzu?filter=sapphire" },
            { label: "Moissanite", to: "/collections/bangles-88lzu?filter=moissanite" },
            { label: "Normal", to: "/collections/bangles-88lzu?filter=normall" },
        ],
    },
    {
        label: "Earrings",
        to: "/collections/long-earrings-hoxji",
        dropdown: [
            { label: "View All Earrings", to: "/collections/long-earrings-hoxji" },
            { label: "Moissanite", to: "/collections/long-earrings-hoxji?filter=moissanite" },
        ],
    },
    { label: "Hand Bags", to: "/collections/hand-bags-jchto" },
    { label: "About Us", to: "/pages/about" },
    { label: "Gallery", to: "/pages/gallery" },
    { label: "Contact Us", to: "/pages/contact" },
];

// ─────────────────────────────────────────
// Main Navbar Export
// ─────────────────────────────────────────
export function Navbar({ cart, isLoggedIn }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [announcementVisible, setAnnouncementVisible] = useState(true);
    const location = useLocation();
    const searchRef = useRef<HTMLInputElement>(null);

    // Detect scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    // Focus search on open
    useEffect(() => {
        if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
    }, [searchOpen]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const isHero = location.pathname === "/";

    // Nav background logic
    const navBg =
        scrolled || !isHero || mobileOpen
            ? "bg-white/97 backdrop-blur-md shadow-sm border-b border-[#e8ddd2]"
            : "bg-transparent";

    const textColor =
        scrolled || !isHero || mobileOpen ? "text-[#3d322a]" : "text-white";

    const logoType: "dark" | "light" =
        scrolled || !isHero ? "dark" : "light";

    // Announcement bar height offset
    const announcementH = announcementVisible ? "top-8" : "top-0";

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Jost:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost { font-family: 'Jost', sans-serif; }

        /* Desktop dropdown */
        .nav-dropdown {
          opacity: 0;
          visibility: hidden;
          transform: translateY(6px);
          transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
        }
        .nav-item:hover .nav-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* Underline animation */
        .nav-link-underline {
          position: relative;
          display: inline-block;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          height: 1px;
          width: 0;
          background: #b89a6a;
          transition: width 0.3s ease;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.active::after {
          width: 100%;
        }

        /* Mobile accordion */
        .mobile-accordion-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s ease;
        }
        .mobile-accordion-content.open {
          grid-template-rows: 1fr;
        }
        .mobile-accordion-inner {
          overflow: hidden;
        }

        /* Search bar slide */
        .search-bar {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s ease;
        }
        .search-bar.open {
          grid-template-rows: 1fr;
        }
        .search-bar-inner {
          overflow: hidden;
        }

        /* Hamburger */
        .hamburger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: currentColor;
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(5.5px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-5.5px) rotate(-45deg);
        }
      `}</style>

            {/* Announcement bar */}
            <AnnouncementBar onHide={() => setAnnouncementVisible(false)} />

            {/* Main Nav */}
            <header
                className={`fixed ${announcementH} left-0 right-0 z-40 font-jost transition-all duration-300 ${navBg}`}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">

                        {/* ── Mobile: Hamburger (left) ── */}
                        <div className="flex items-center lg:hidden">
                            <button
                                className={`hamburger ${mobileOpen ? "open" : ""} flex flex-col gap-[5px] p-2 -ml-2 ${textColor}`}
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-label="Toggle menu"
                                aria-expanded={mobileOpen}
                            >
                                <span />
                                <span />
                                <span />
                            </button>
                        </div>

                        {/* ── Logo — centered on mobile, left on desktop ── */}
                        <Link
                            to="/"
                            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mr-8 flex-shrink-0"
                            aria-label="Mayra by Gungun — Home"
                        >
                            <NavLogo type={logoType} />
                        </Link>

                        {/* ── Desktop Nav Links ── */}
                        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1">
                            {NAV_ITEMS.map((item) => (
                                <div key={item.label} className="nav-item relative group">
                                    <Link
                                        to={item.to}
                                        className={`nav-link-underline text-[10px] tracking-[0.18em] uppercase font-medium py-2 inline-flex items-center gap-1 transition-colors duration-200 ${textColor} hover:text-[#b89a6a]`}
                                    >
                                        {item.label}
                                        {item.dropdown && (
                                            <svg
                                                className="w-2 h-2 mt-px flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 10 6"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l4 4 4-4" />
                                            </svg>
                                        )}
                                    </Link>

                                    {item.dropdown && (
                                        <div className="nav-dropdown absolute top-full left-0 mt-0 w-52 bg-white border border-[#e8ddd2] shadow-xl z-50 py-2">
                                            {item.dropdown.map((sub) => (
                                                <Link
                                                    key={sub.label}
                                                    to={sub.to}
                                                    className="block px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#3d322a] hover:bg-[#faf6f0] hover:text-[#b89a6a] transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* ── Right: Icons ── */}
                        <div className={`flex items-center gap-0.5 sm:gap-1 ${textColor}`}>

                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen((v) => !v)}
                                className="w-9 h-9 flex items-center justify-center hover:text-[#b89a6a] transition-colors"
                                aria-label={searchOpen ? "Close search" : "Open search"}
                                aria-expanded={searchOpen}
                            >
                                {searchOpen ? (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                            </button>

                            {/* Wishlist — hidden on smallest screens */}
                            <Link
                                to="/account/wishlist"
                                className="w-9 h-9 hidden sm:flex items-center justify-center hover:text-[#b89a6a] transition-colors"
                                aria-label="Wishlist"
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>

                            {/* Account */}
                            <Suspense
                                fallback={
                                    <Link
                                        to="/account/login"
                                        className="w-9 h-9 hidden sm:flex items-center justify-center hover:text-[#b89a6a] transition-colors"
                                        aria-label="Account"
                                    >
                                        <AccountIcon />
                                    </Link>
                                }
                            >
                                <Await resolve={isLoggedIn}>
                                    {(loggedIn) => (
                                        <Link
                                            to={loggedIn ? "/account" : "/account/login"}
                                            className="w-9 h-9 hidden sm:flex items-center justify-center hover:text-[#b89a6a] transition-colors"
                                            aria-label={loggedIn ? "My Account" : "Login"}
                                        >
                                            <AccountIcon />
                                        </Link>
                                    )}
                                </Await>
                            </Suspense>

                            {/* Cart */}
                            <CartButton cart={cart} textColor={textColor} />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className={`search-bar ${searchOpen ? "open" : ""} border-t border-[#e8ddd2] bg-white`}>
                    <div className="search-bar-inner">
                        <div className="max-w-2xl mx-auto px-4 py-3">
                            <form action="/search" method="get" className="flex items-center gap-3">
                                <svg className="text-[#b89a6a] flex-shrink-0" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    name="q"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search jewellery — Ranihaar, Bangles, Kundan..."
                                    className="flex-1 text-sm text-[#3d322a] placeholder:text-[#b0a090] bg-transparent outline-none py-1 font-jost"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="text-[#8a7a6e] hover:text-[#b89a6a] flex-shrink-0"
                                        aria-label="Clear search"
                                    >
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            <MobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                announcementVisible={announcementVisible}
            />

            {/* Spacer when not on hero (accounts for announcement bar + nav height) */}
            {!isHero && (
                <div
                    style={{
                        height: announcementVisible
                            ? "calc(2rem + 56px)"
                            : "56px",
                    }}
                    className="sm:hidden"
                />
            )}
            {!isHero && (
                <div
                    style={{
                        height: announcementVisible
                            ? "calc(2rem + 68px)"
                            : "68px",
                    }}
                    className="hidden sm:block"
                />
            )}
        </>
    );
}

// ─────────────────────────────────────────
// Logo Component — avoids duplication bug
// ─────────────────────────────────────────
function NavLogo({ type }: { type: "dark" | "light" }) {
    const [imgError, setImgError] = useState(false);
    const src =
        type === "dark"
            ? "https://mayrabygungun.com/public/assets/img/mayra by gungun website 1.png"
            : "https://mayrabygungun.com/public/assets/img/mayra by gungun website 2.png";

    if (imgError) {
        return (
            <span
                className="font-cormorant text-xl lg:text-2xl font-light whitespace-nowrap"
                style={{ color: type === "dark" ? "#3d322a" : "white" }}
            >
                Mayra by Gungun
            </span>
        );
    }

    return (
        <img
            src={src}
            alt="Mayra by Gungun"
            className="h-9 sm:h-10 lg:h-11 object-contain max-w-[140px] sm:max-w-[160px]"
            onError={() => setImgError(true)}
        />
    );
}

// ─────────────────────────────────────────
// Announcement Bar
// ─────────────────────────────────────────
function AnnouncementBar({ onHide }: { onHide: () => void }) {
    const messages = [
        "✦  Free Shipping on orders above ₹999  ✦",
        "✦  Handcrafted Jewellery from Jaipur  ✦",
        "✦  Subscribe & Get 15% Off Your First Order  ✦",
    ];
    const [idx, setIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
        return () => clearInterval(t);
    }, []);

    if (!visible) return null;

    const handleHide = () => {
        setVisible(false);
        onHide();
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#1a1410] text-[#d4b896] text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase flex items-center justify-center h-8 font-jost px-8">
            <span className="transition-all duration-500 truncate text-center">
                {messages[idx]}
            </span>
            <button
                onClick={handleHide}
                className="absolute right-3 sm:right-4 text-[#d4b896]/60 hover:text-[#d4b896] transition-colors p-1"
                aria-label="Close announcement"
            >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    );
}

// ─────────────────────────────────────────
// Cart Button
// ─────────────────────────────────────────
function CartButton({
    cart,
    textColor,
}: {
    cart: Promise<{ totalQuantity: number } | null>;
    textColor: string;
}) {
    const { open } = useAside();

    return (
        <button
            onClick={() => open("cart")}
            className={`w-9 h-9 flex items-center justify-center relative hover:text-[#b89a6a] transition-colors ${textColor}`}
            aria-label="Open cart"
        >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <Suspense fallback={null}>
                <Await resolve={cart}>
                    {(c) =>
                        c?.totalQuantity ? (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b89a6a] text-[#1a1410] text-[9px] font-semibold rounded-full flex items-center justify-center leading-none">
                                {c.totalQuantity > 9 ? "9+" : c.totalQuantity}
                            </span>
                        ) : null
                    }
                </Await>
            </Suspense>
        </button>
    );
}

// ─────────────────────────────────────────
// Account Icon SVG
// ─────────────────────────────────────────
function AccountIcon() {
    return (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

// ─────────────────────────────────────────
// Mobile Menu Drawer
// ─────────────────────────────────────────
function MobileMenu({
    open,
    onClose,
    announcementVisible,
}: {
    open: boolean;
    onClose: () => void;
    announcementVisible: boolean;
}) {
    const [openItem, setOpenItem] = useState<string | null>(null);

    // Reset accordion when drawer closes
    useEffect(() => {
        if (!open) setOpenItem(null);
    }, [open]);

    const drawerTop = announcementVisible ? "top-8" : "top-0";

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-[#0d0b09]/60 transition-opacity duration-300 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className={`fixed ${drawerTop} left-0 bottom-0 z-50 w-[280px] sm:w-[320px] bg-white font-jost flex flex-col transition-transform duration-350 ease-out ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                style={{ transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8ddd2]">
                    <Link to="/" onClick={onClose} className="flex items-center">
                        <NavLogo type="dark" />
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-[#8a7a6e] hover:text-[#b89a6a] transition-colors"
                        aria-label="Close menu"
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto overscroll-contain">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className="border-b border-[#f0ebe4] last:border-0">
                            {item.dropdown ? (
                                <>
                                    <button
                                        className="w-full flex items-center justify-between px-5 py-4 text-[10px] tracking-[0.2em] uppercase text-[#3d322a] hover:text-[#b89a6a] transition-colors"
                                        onClick={() =>
                                            setOpenItem(openItem === item.label ? null : item.label)
                                        }
                                        aria-expanded={openItem === item.label}
                                    >
                                        <span>{item.label}</span>
                                        <svg
                                            className={`w-3 h-3 transition-transform duration-300 flex-shrink-0 ${
                                                openItem === item.label ? "rotate-180" : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 10 6"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l4 4 4-4" />
                                        </svg>
                                    </button>
                                    <div
                                        className={`mobile-accordion-content ${
                                            openItem === item.label ? "open" : ""
                                        }`}
                                    >
                                        <div className="mobile-accordion-inner bg-[#faf6f0]">
                                            {item.dropdown.map((sub) => (
                                                <Link
                                                    key={sub.label}
                                                    to={sub.to}
                                                    onClick={onClose}
                                                    className="flex items-center gap-2.5 px-7 py-3 text-[10px] tracking-[0.15em] uppercase text-[#8a7a6e] hover:text-[#b89a6a] transition-colors"
                                                >
                                                    <span className="w-1 h-1 bg-[#b89a6a] rounded-full flex-shrink-0" />
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.to}
                                    onClick={onClose}
                                    className="flex px-5 py-4 text-[10px] tracking-[0.2em] uppercase text-[#3d322a] hover:text-[#b89a6a] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Drawer Footer */}
                <div className="px-5 py-5 border-t border-[#e8ddd2]">
                    <div className="flex gap-3 mb-4">
                        <a
                            href="https://www.instagram.com/mayrabygungun/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 border border-[#b89a6a]/40 flex items-center justify-center text-[#b89a6a] hover:bg-[#b89a6a] hover:text-white transition-all"
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
                            className="w-9 h-9 border border-[#b89a6a]/40 flex items-center justify-center text-[#b89a6a] hover:bg-[#b89a6a] hover:text-white transition-all"
                            aria-label="WhatsApp"
                        >
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>
                        <a
                            href="tel:+919660090441"
                            className="w-9 h-9 border border-[#b89a6a]/40 flex items-center justify-center text-[#b89a6a] hover:bg-[#b89a6a] hover:text-white transition-all"
                            aria-label="Call us"
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </a>
                    </div>
                    <Link
                        to="/account/login"
                        onClick={onClose}
                        className="block w-full text-center border border-[#b89a6a] text-[#b89a6a] py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-[#b89a6a] hover:text-white transition-all"
                    >
                        Login / Register
                    </Link>
                </div>
            </aside>
        </>
    );
}   