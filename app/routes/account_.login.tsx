import { redirect, data } from "react-router";
import { Form, Link, useActionData, useSearchParams } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/account_.login";

// ─────────────────────────────────────────
// Meta
// ─────────────────────────────────────────
export const meta: Route.MetaFunction = () => [
  { title: "Login / Register | Mayra by Gungun" },
];

// ─────────────────────────────────────────
// Loader
// ─────────────────────────────────────────
export async function loader({ context }: Route.LoaderArgs) {
  const customerAccessToken = await context.session.get("customerAccessToken");
  if (customerAccessToken) return redirect("/account");
  return {};
}

// ─────────────────────────────────────────
// Action
// ─────────────────────────────────────────
export async function action({ request, context }: Route.ActionArgs) {
  const { storefront, session } = context;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  // ── LOGIN ──
  if (intent === "login") {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password)
      return data({ intent: "login", error: "Please fill in all fields." }, { status: 400 });

    const { customerAccessTokenCreate } = await storefront.mutate(LOGIN_MUTATION, {
      variables: { input: { email, password } },
    });

    if (customerAccessTokenCreate?.customerUserErrors?.length)
      return data(
        { intent: "login", error: customerAccessTokenCreate.customerUserErrors[0].message },
        { status: 400 }
      );

    const accessToken = customerAccessTokenCreate?.customerAccessToken?.accessToken;
    if (!accessToken)
      return data({ intent: "login", error: "Login failed. Please try again." }, { status: 400 });

    session.set("customerAccessToken", accessToken);
    return redirect("/account", {
      headers: { "Set-Cookie": await session.commit() },
    });
  }

  // ── REGISTER ──
  if (intent === "signup") {
    const firstName = String(formData.get("firstName") ?? "");
    const lastName = String(formData.get("lastName") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!firstName || !email || !password)
      return data({ intent: "signup", error: "Please fill in all required fields." }, { status: 400 });

    if (password.length < 8)
      return data({ intent: "signup", error: "Password must be at least 8 characters." }, { status: 400 });

    const { customerCreate } = await storefront.mutate(REGISTER_MUTATION, {
      variables: {
        input: { firstName, lastName, email, password, acceptsMarketing: true },
      },
    });

    if (customerCreate?.customerUserErrors?.length)
      return data(
        { intent: "signup", error: customerCreate.customerUserErrors[0].message },
        { status: 400 }
      );

    // Auto-login after register
    const { customerAccessTokenCreate } = await storefront.mutate(LOGIN_MUTATION, {
      variables: { input: { email, password } },
    });

    const accessToken = customerAccessTokenCreate?.customerAccessToken?.accessToken;
    if (accessToken) {
      session.set("customerAccessToken", accessToken);
      return redirect("/account", {
        headers: { "Set-Cookie": await session.commit() },
      });
    }

    return redirect("/account/login?registered=true");
  }

  return data({ error: "Invalid request." }, { status: 400 });
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export default function AccountLogin() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const defaultTab = (actionData as any)?.intent === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-fade-up { animation: fadeUp 0.7s ease forwards; }

        .auth-page {
          display: flex;
          min-height: 100vh;
          background: #faf6f0;
          font-family: 'Jost', sans-serif;
          color: #3d322a;
        }

        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(40px, 7vw, 100px) clamp(24px, 6vw, 80px);
        }

        .auth-right {
          width: 380px;
          background: #2c1a0e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 60px 40px;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .auth-breadcrumb {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a08070;
          margin-bottom: 48px;
          font-family: 'Jost', sans-serif;
        }

        .auth-breadcrumb a {
          color: #b89a6a;
          text-decoration: none;
          transition: color 0.2s;
        }

        .auth-breadcrumb a:hover { color: #3d322a; }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid #e8ddd2;
          margin-bottom: 40px;
        }

        .auth-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          padding: 10px 32px 10px 0;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #bbb;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }

        .auth-tab.tab-active {
          color: #3d322a;
          border-bottom-color: #b89a6a;
        }

        .auth-form { width: 100%; max-width: 420px; }

        .auth-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 300;
          color: #3d322a;
          margin: 0 0 8px;
          line-height: 1.1;
        }

        .auth-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: #a08070;
          margin: 0 0 32px;
        }

        .auth-success {
          background: #f0faf4;
          border: 1px solid #b2dfc2;
          color: #2a6644;
          font-size: 13px;
          padding: 10px 16px;
          margin-bottom: 24px;
        }

        .auth-error {
          background: #fdf0ee;
          border: 1px solid #f5c6c0;
          color: #c0392b;
          font-size: 13px;
          padding: 10px 16px;
          margin-bottom: 24px;
        }

        .auth-form-group { margin-bottom: 20px; }

        .auth-form-row-half { display: flex; gap: 16px; }
        .auth-form-row-half .auth-form-group { flex: 1; min-width: 0; }

        .auth-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #a08070;
          margin-bottom: 8px;
          font-family: 'Jost', sans-serif;
        }

        .auth-input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #d4c4b0;
          border-radius: 0;
          padding: 10px 0;
          font-size: 14px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          background: transparent;
          color: #3d322a;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }

        .auth-input:focus { border-color: #b89a6a; }
        .auth-input::placeholder { color: #ccc; font-style: italic; }

        .auth-check-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .auth-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #8a7a6e;
          cursor: pointer;
        }

        .auth-remember input[type='checkbox'] {
          accent-color: #b89a6a;
          width: 13px;
          height: 13px;
        }

        .auth-forgot {
          font-size: 11px;
          color: #b89a6a;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }

        .auth-forgot:hover { color: #3d322a; }

        .auth-btn-primary {
          width: 100%;
          background: #3d322a;
          color: #faf6f0;
          border: none;
          padding: 15px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: background 0.3s;
          margin-bottom: 22px;
        }

        .auth-btn-primary:hover:not(:disabled) { background: #b89a6a; }
        .auth-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .auth-switch {
          text-align: center;
          font-size: 12px;
          color: #8a7a6e;
        }

        .auth-switch-btn {
          background: none;
          border: none;
          color: #b89a6a;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .auth-switch-btn:hover { color: #3d322a; }

        /* Right panel */
        .auth-ornament { width: 48px; height: 1px; background: #c9a97a; }

        .auth-brand-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          color: #f5ebe0;
          letter-spacing: 4px;
        }

        .auth-brand-by {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #c9a97a;
          font-family: 'Jost', sans-serif;
        }

        .auth-brand-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: #d4b896;
          text-align: center;
          line-height: 1.9;
        }

        .auth-brand-gems { font-size: 16px; color: #c9a97a; letter-spacing: 8px; }

        .auth-brand-origin {
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #6a4a2e;
          text-align: center;
          line-height: 1.8;
          font-family: 'Jost', sans-serif;
          text-transform: uppercase;
        }

        .auth-trust-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
          width: 100%;
        }

        .auth-trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: #8a6a4a;
          letter-spacing: 0.1em;
        }

        .auth-trust-dot {
          width: 4px;
          height: 4px;
          background: #c9a97a;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 900px) { .auth-right { display: none; } }

        @media (max-width: 480px) {
          .auth-form-row-half { flex-direction: column; gap: 0; }
          .auth-check-row { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      <main className="auth-page">

        {/* ── LEFT: Form ── */}
        <div className="auth-left auth-fade-up">
          <div className="auth-breadcrumb">
            <Link to="/">Home</Link> / {activeTab === "login" ? "Login" : "Register"}
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab${activeTab === "login" ? " tab-active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab${activeTab === "signup" ? " tab-active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Register
            </button>
          </div>

          {/* LOGIN */}
          {activeTab === "login" && (
            <Form method="POST" className="auth-form">
              <input type="hidden" name="intent" value="login" />
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Login to your account to continue.</p>

              {justRegistered && (
                <p className="auth-success">Account created! Please login to continue.</p>
              )}
              {(actionData as any)?.intent === "login" && (actionData as any)?.error && (
                <p className="auth-error">{(actionData as any).error}</p>
              )}

              <div className="auth-form-group">
                <label htmlFor="login-email" className="auth-label">Email Address</label>
                <input id="login-email" name="email" type="email" className="auth-input"
                  placeholder="you@example.com" autoComplete="email" required />
              </div>

              <div className="auth-form-group">
                <label htmlFor="login-password" className="auth-label">Password</label>
                <input id="login-password" name="password" type="password" className="auth-input"
                  placeholder="••••••••" autoComplete="current-password" required />
              </div>

              <div className="auth-check-row">
                <label className="auth-remember">
                  <input type="checkbox" name="remember" /> Remember me
                </label>
                <Link to="/account/recover" className="auth-forgot">Forgot password?</Link>
              </div>

              <button type="submit" className="auth-btn-primary">Login</button>

              <p className="auth-switch">
                Don&apos;t have an account?{" "}
                <button type="button" className="auth-switch-btn" onClick={() => setActiveTab("signup")}>
                  Register Now
                </button>
              </p>
            </Form>
          )}

          {/* SIGNUP */}
          {activeTab === "signup" && (
            <Form method="POST" className="auth-form">
              <input type="hidden" name="intent" value="signup" />
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join us and discover handcrafted jewellery.</p>

              {(actionData as any)?.intent === "signup" && (actionData as any)?.error && (
                <p className="auth-error">{(actionData as any).error}</p>
              )}

              <div className="auth-form-row-half">
                <div className="auth-form-group">
                  <label htmlFor="firstName" className="auth-label">First Name</label>
                  <input id="firstName" name="firstName" type="text" className="auth-input"
                    placeholder="Priya" autoComplete="given-name" required />
                </div>
                <div className="auth-form-group">
                  <label htmlFor="lastName" className="auth-label">Last Name</label>
                  <input id="lastName" name="lastName" type="text" className="auth-input"
                    placeholder="Sharma" autoComplete="family-name" />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-email" className="auth-label">Email Address</label>
                <input id="signup-email" name="email" type="email" className="auth-input"
                  placeholder="you@example.com" autoComplete="email" required />
              </div>

              <div className="auth-form-group" style={{ marginBottom: "28px" }}>
                <label htmlFor="signup-password" className="auth-label">Password</label>
                <input id="signup-password" name="password" type="password" className="auth-input"
                  placeholder="Min. 8 characters" autoComplete="new-password" required minLength={8} />
              </div>

              <button type="submit" className="auth-btn-primary">Create Account</button>

              <p className="auth-switch">
                Already have an account?{" "}
                <button type="button" className="auth-switch-btn" onClick={() => setActiveTab("login")}>
                  Login
                </button>
              </p>
            </Form>
          )}
        </div>

        {/* ── RIGHT: Brand Panel ── */}
        <div className="auth-right">
          <div className="auth-ornament" />
          <span className="auth-brand-logo">Mayra</span>
          <span className="auth-brand-by">by Gungun</span>
          <div className="auth-ornament" />
          <p className="auth-brand-quote">
            Every piece tells a story,<br />let yours shine through.
          </p>
          <div className="auth-brand-gems">✦ ✦ ✦</div>
          <p className="auth-brand-origin">Handcrafted jewellery<br />from Jaipur, Rajasthan</p>
          <div className="auth-trust-list">
            {["Free Standard Delivery", "100% Secure Payments", "Easy 7-Day Returns", "Certified Craftsmanship"].map((item) => (
              <div className="auth-trust-item" key={item}>
                <div className="auth-trust-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}

// ─────────────────────────────────────────
// GraphQL
// ─────────────────────────────────────────
const LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
` as const;

const REGISTER_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email firstName lastName }
      customerUserErrors { code field message }
    }
  }
` as const;