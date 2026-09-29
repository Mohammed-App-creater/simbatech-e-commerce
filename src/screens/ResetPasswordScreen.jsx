"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { shopState, authConfig, auth, navigate } from "@/lib/client/store";

/*
 * /reset-password — with ?uid=&token= (from the email link) it asks for a new password and calls
 * auth.resetPassword({ uid, token, password }). Without them it lets the user request a reset:
 * email accounts get a link ("Check your email"), phone accounts get an SMS code and set the new
 * password right here with auth.resetPassword({ phone, code, password }). Card, fields and
 * strength meter follow the sign-in page.
 */

const LEVELS = [
  { label: "Too short", fg: "#B02418", bar: "#C42A1C" },
  { label: "Weak", fg: "#B02418", bar: "#C42A1C" },
  { label: "Fair", fg: "#9A4A06", bar: "#F08A24" },
  { label: "Good", fg: "#7A5700", bar: "#F0AE00" },
  { label: "Strong", fg: "#2F7A3C", bar: "#418D4D" },
];
function score(pw) {
  // -1 empty, 0 too short, 1..4 = length>=8 + length>=12 + has digit + has symbol
  if (!pw) return -1;
  if (pw.length < 8) return 0;
  let s = 1;
  if (pw.length >= 12) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const FIELD = {
  height: "50px",
  boxSizing: "border-box",
  padding: "0 4px 0 16px",
  border: "1px solid #E6E4DE",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#FFFFFF",
};
const INPUT = {
  flexGrow: "1",
  minWidth: "0",
  height: "46px",
  border: "none",
  background: "transparent",
  font: "inherit",
  fontSize: "15px",
  color: "#111318",
};
const LABEL = { fontSize: "13px", fontWeight: "600" };
const TOGGLE = {
  height: "42px",
  padding: "0 12px",
  border: "none",
  borderRadius: "10px",
  background: "#F3F2EE",
  color: "#0D4F8B",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
};
const BTN = {
  height: "54px",
  border: "none",
  borderRadius: "14px",
  background: "#2F7A3C",
  color: "#FFFFFF",
  font: "inherit",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
};
const NOTE = {
  margin: "0",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#EAF3FA",
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#0D4F8B",
};

function Arrow() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5E6470"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function Heading({ title, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <h1
        style={{
          margin: "0",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "32px",
          lineHeight: "1",
          fontWeight: "700",
          letterSpacing: "-0.04em",
        }}
      >
        {title}
      </h1>
      <span style={{ fontSize: "15px", color: "#5E6470" }}>{sub}</span>
    </div>
  );
}

function ErrorLine({ children }) {
  return children ? (
    <span role="alert" style={{ marginTop: "-10px", fontSize: "12px", color: "#B02418", textAlign: "center" }}>
      {children}
    </span>
  ) : null;
}

/* New password + confirmation with the sign-in page's strength meter. */
function PasswordFields({ pw, confirm, onPw, onConfirm, shown, onToggle, idPrefix }) {
  const sc = score(pw);
  const lvl = sc < 0 ? { label: "", fg: "#5E6470", bar: "#E6E4DE" } : LEVELS[sc];
  const filled = sc < 0 ? 0 : Math.max(1, sc);
  const bars = [0, 1, 2, 3].map((i) => ({ bg: i < filled ? lvl.bar : "#E6E4DE" }));
  const rules = [
    { label: "8+ characters", ok: pw.length >= 8 },
    { label: "A number", ok: /\d/.test(pw) },
    { label: "A symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ].map((r) => ({
    label: r.label,
    fg: r.ok ? "#2F7A3C" : "#5E6470",
    bg: r.ok ? "#418D4D" : "#C9C6BE",
    sr: r.ok ? " (met)" : " (not met)",
  }));
  const mismatch = confirm && confirm !== pw;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor={idPrefix + "-pw"} style={LABEL}>
          New password
        </label>
        <div className="field" style={FIELD}>
          <LockIcon />
          <input
            id={idPrefix + "-pw"}
            type={shown ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={pw}
            onChange={onPw}
            aria-describedby={idPrefix + "-strength"}
            style={INPUT}
          />
          <button
            type="button"
            onClick={onToggle}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown ? "true" : "false"}
            style={TOGGLE}
          >
            {shown ? "Hide" : "Show"}
          </button>
        </div>
        <div
          id={idPrefix + "-strength"}
          aria-live="polite"
          style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              aria-hidden="true"
              style={{ flexGrow: "1", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "4px" }}
              data-cols="4"
            >
              {bars.map((b, i0) => (
                <Fragment key={i0}>
                  <span style={{ height: "6px", borderRadius: "999px", background: b.bg, transition: "background .2s ease" }} />
                </Fragment>
              ))}
            </div>
            <span style={{ width: "84px", textAlign: "right", fontSize: "13px", fontWeight: "700", color: lvl.fg }}>{lvl.label}</span>
          </div>
          <div style={{ display: "flex", gap: "14px", fontSize: "12px" }}>
            {rules.map((r, i0) => (
              <Fragment key={i0}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: r.fg, fontWeight: "600" }}>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "999px",
                      background: r.bg,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                  {r.label}
                  <span className="sr-only">{r.sr}</span>
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor={idPrefix + "-confirm"} style={LABEL}>
          Confirm new password
        </label>
        <div className="field" style={{ ...FIELD, borderColor: mismatch ? "#C42A1C" : "#E6E4DE" }}>
          <LockIcon />
          <input
            id={idPrefix + "-confirm"}
            type={shown ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Type it again"
            value={confirm}
            onChange={onConfirm}
            aria-invalid={mismatch ? "true" : "false"}
            style={INPUT}
          />
        </div>
        {mismatch ? (
          <span role="alert" style={{ fontSize: "12px", fontWeight: "600", color: "#B02418" }}>
            The passwords don&apos;t match.
          </span>
        ) : null}
      </div>
    </>
  );
}

function passwordProblem(pw, confirm) {
  if (pw.length < 8) return "Choose a password of at least 8 characters.";
  if (pw !== confirm) return "The passwords don't match.";
  return "";
}

export default function ResetPasswordScreen({ initial }) {
  const init = initial || {};
  const cfg = authConfig(shopState(initial));
  const hasToken = !!(init.uid && init.token);

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // request flow
  const [identifier, setIdentifier] = useState("");
  const [via, setVia] = useState(""); // "" | "email" | "sms"
  const [devLink, setDevLink] = useState("");
  const [devCode, setDevCode] = useState("");
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    timer.current = setTimeout(() => setResendIn((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(timer.current);
  }, [resendIn]);

  const fail = (err) => setError((err && err.message) || "Something went wrong. Please try again.");

  async function finish(payload) {
    setBusy(true);
    setError("");
    try {
      await auth.resetPassword(payload);
      setDone(true);
      navigate("/account", { replace: true });
    } catch (err) {
      fail(err);
      setBusy(false);
    }
  }

  function submitToken(e) {
    e.preventDefault();
    if (busy) return;
    const problem = passwordProblem(pw, confirm);
    if (problem) return setError(problem);
    finish({ uid: init.uid, token: init.token, password: pw });
  }

  async function submitRequest(e) {
    if (e) e.preventDefault();
    if (busy) return;
    const id = identifier.trim();
    if (!id) return setError("Enter your phone number or email address.");
    setBusy(true);
    setError("");
    try {
      const res = (await auth.forgotPassword(id)) || {};
      setVia(res.via === "sms" ? "sms" : "email");
      setDevLink(res.devLink || "");
      setDevCode(res.devCode || "");
      setCode("");
      if (res.via === "sms") setResendIn(Math.round(Number(res.resendInSeconds) || 45));
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  }

  function submitCode(e) {
    e.preventDefault();
    if (busy) return;
    if (code.trim().length < 4) return setError("Enter the code we sent you.");
    const problem = passwordProblem(pw, confirm);
    if (problem) return setError(problem);
    finish({ phone: identifier.trim(), code: code.trim(), password: pw });
  }

  const pwFields = (prefix) => (
    <PasswordFields
      pw={pw}
      confirm={confirm}
      onPw={(e) => {
        setPw(e.target.value);
        setError("");
      }}
      onConfirm={(e) => {
        setConfirm(e.target.value);
        setError("");
      }}
      shown={shown}
      onToggle={() => setShown((v) => !v)}
      idPrefix={prefix}
    />
  );

  let body;
  if (!cfg.passwordReset) {
    body = (
      <>
        <Heading title="Reset your password" sub="Password reset isn't available online yet." />
        <p style={NOTE}>Please contact support and we&apos;ll reset it for you.</p>
        <Link href="/p/contact?topic=support" className="btn-y" style={BTN}>
          Contact support
          <Arrow />
        </Link>
      </>
    );
  } else if (hasToken) {
    body = (
      <form onSubmit={submitToken} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Heading title="Choose a new password" sub="Pick something you don't use anywhere else." />
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>{pwFields("rp")}</div>
        <button type="submit" className="btn-y" disabled={busy || done} style={{ ...BTN, cursor: busy ? "wait" : "pointer" }}>
          {done ? "Password updated" : busy ? "Saving…" : "Save new password"}
          <Arrow />
        </button>
        <ErrorLine>{error}</ErrorLine>
        <span style={{ fontSize: "13px", color: "#5E6470", textAlign: "center" }}>
          Link expired?{" "}
          <Link href="/reset-password" style={{ fontWeight: "600", color: "#0D4F8B" }}>
            Ask for a new one
          </Link>
        </span>
      </form>
    );
  } else if (via === "email") {
    body = (
      <>
        <Heading title="Check your email" sub={"We've sent a reset link to " + identifier.trim() + ". It works for 3 days."} />
        <p style={NOTE}>No email after a few minutes? Check your spam folder, or make sure you typed the address your account uses.</p>
        {devLink ? (
          <p style={{ ...NOTE, background: "#FFF4C7", color: "#7A5700", overflowWrap: "anywhere" }}>
            Development mode: no mail server is set up, so here&apos;s your link —{" "}
            <a href={devLink} style={{ fontWeight: "700", color: "#7A5700", textDecoration: "underline" }}>
              {devLink}
            </a>
          </p>
        ) : null}
        <button
          type="button"
          className="ghost"
          onClick={() => {
            setVia("");
            setError("");
          }}
          style={{ ...BTN, background: "#FFFFFF", color: "#111318", border: "1.5px solid #E6E4DE", height: "50px", fontSize: "14px" }}
        >
          Use a different phone or email
        </button>
      </>
    );
  } else if (via === "sms") {
    body = (
      <form onSubmit={submitCode} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Heading title="Enter your code" sub={"We've sent a 6-digit code by SMS to " + identifier.trim() + "."} />
        {devCode ? <p style={{ ...NOTE, background: "#FFF4C7", color: "#7A5700" }}>Development mode: your code is {devCode}</p> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="rp-code" style={LABEL}>
              Code
            </label>
            <div className="field" style={{ ...FIELD, padding: "0 16px" }}>
              <input
                id="rp-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                style={{ ...INPUT, letterSpacing: "0.2em", fontWeight: "700" }}
              />
            </div>
          </div>
          {pwFields("rs")}
        </div>
        <button type="submit" className="btn-y" disabled={busy || done} style={{ ...BTN, cursor: busy ? "wait" : "pointer" }}>
          {done ? "Password updated" : busy ? "Saving…" : "Save new password"}
          <Arrow />
        </button>
        <ErrorLine>{error}</ErrorLine>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5E6470" }}>
          <button
            type="button"
            onClick={() => submitRequest()}
            disabled={busy || resendIn > 0}
            style={{
              border: "none",
              background: "transparent",
              font: "inherit",
              fontWeight: "600",
              color: resendIn > 0 ? "#5E6470" : "#0D4F8B",
              cursor: resendIn > 0 ? "default" : "pointer",
              padding: "0",
            }}
          >
            {resendIn > 0 ? "Resend code in " + resendIn + "s" : "Resend code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setVia("");
              setError("");
            }}
            style={{
              border: "none",
              background: "transparent",
              font: "inherit",
              fontWeight: "600",
              color: "#0D4F8B",
              cursor: "pointer",
              padding: "0",
            }}
          >
            Change number
          </button>
        </div>
      </form>
    );
  } else {
    body = (
      <form onSubmit={submitRequest} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Heading
          title="Reset your password"
          sub="Tell us the phone or email on your account. Email accounts get a link; phone accounts get an SMS code."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="rp-id" style={LABEL}>
            Phone or email
          </label>
          <div className="field" style={{ ...FIELD, padding: "0 16px" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5E6470"
              strokeWidth="1.7"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
            <input
              id="rp-id"
              type="text"
              autoComplete="username"
              placeholder="09XX XXX XXX or you@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError("");
              }}
              style={INPUT}
            />
          </div>
        </div>
        <button type="submit" className="btn-y" disabled={busy} style={{ ...BTN, cursor: busy ? "wait" : "pointer" }}>
          {busy ? "Sending…" : "Send reset link or code"}
          <Arrow />
        </button>
        <ErrorLine>{error}</ErrorLine>
        <span style={{ fontSize: "13px", color: "#5E6470", textAlign: "center" }}>
          Remembered it?{" "}
          <Link href="/signin" style={{ fontWeight: "600", color: "#0D4F8B" }}>
            Sign in
          </Link>
        </span>
      </form>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        color: "#111318",
        overflow: "hidden",
      }}
    >
      <SiteHeader initial={initial} />
      <section
        style={{
          margin: "24px var(--gutter) 0",
          padding: "48px 24px",
          borderRadius: "32px",
          background: "#F6F5F1",
          display: "flex",
          justifyContent: "center",
        }}
        data-sec="reset-password"
      >
        <div
          style={{
            width: "480px",
            maxWidth: "100%",
            boxSizing: "border-box",
            padding: "32px 36px",
            borderRadius: "28px",
            background: "#FFFFFF",
            boxShadow: "0 30px 60px -40px rgba(10,20,35,0.35)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          data-w
        >
          {body}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
