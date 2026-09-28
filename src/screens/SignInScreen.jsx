"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

var LEVELS = [
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
  var s = 1;
  if (pw.length >= 12) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: "signin", showPw: false, remember: true, newPw: "", terms: false };
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var tab = s.tab || "signin";
    var tabs = [
      { id: "signin", label: "Sign in" },
      { id: "create", label: "Create account" },
    ].map(function (t) {
      var on = t.id === tab;
      return {
        label: t.label,
        aria: on ? "true" : "false",
        bg: on ? "#FFFFFF" : "transparent",
        fg: on ? "#0D4F8B" : "#5E6470",
        shadow: on ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        pick: function () {
          self.setState({ tab: t.id });
        },
      };
    });
    var shown = !!s.showPw;
    var pw = s.newPw || "";
    var sc = score(pw);
    var lvl = sc < 0 ? { label: "", fg: "#5E6470", bar: "#E6E4DE" } : LEVELS[sc];
    var filled = sc < 0 ? 0 : Math.max(1, sc);
    var bars = [0, 1, 2, 3].map(function (i) {
      return { bg: i < filled ? lvl.bar : "#E6E4DE" };
    });
    var rules = [
      { label: "8+ characters", ok: pw.length >= 8 },
      { label: "A number", ok: /\d/.test(pw) },
      { label: "A symbol", ok: /[^A-Za-z0-9]/.test(pw) },
    ].map(function (r) {
      return { label: r.label, fg: r.ok ? "#2F7A3C" : "#5E6470", bg: r.ok ? "#418D4D" : "#C9C6BE", sr: r.ok ? " (met)" : " (not met)" };
    });
    var strongEnough = sc >= 2;
    var terms = !!s.terms;
    var canCreate = strongEnough && terms;
    var hint = !strongEnough ? "Choose a password rated Fair or better." : "Tick the box to accept the terms.";
    return {
      tabs: tabs,
      isSignIn: tab === "signin",
      isCreate: tab === "create",
      goCreate: function () {
        self.setState({ tab: "create" });
      },
      pwType: shown ? "text" : "password",
      pwShown: shown,
      pwHidden: !shown,
      pwAria: shown ? "true" : "false",
      pwToggleText: shown ? "Hide" : "Show",
      pwToggleLabel: shown ? "Hide password" : "Show password",
      togglePw: function () {
        self.setState({ showPw: !self.state.showPw });
      },
      remember: !!s.remember,
      toggleRemember: function () {
        self.setState({ remember: !self.state.remember });
      },
      newPw: pw,
      onNewPw: function (e) {
        self.setState({ newPw: e.target.value });
      },
      bars: bars,
      strength: { label: lvl.label, fg: lvl.fg },
      rules: rules,
      terms: terms,
      toggleTerms: function () {
        self.setState({ terms: !self.state.terms });
      },
      canCreate: canCreate,
      cannotCreate: !canCreate,
      createHint: hint,
    };
  }
}

const CSS =
  "body{margin:0;font-family:'Geist',system-ui,sans-serif;color:#111318;background:#FFFFFF;-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0D4F8B}\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.btn-y:hover{background:#276833;color:#FFFFFF}\n.ghost:hover{background:#F6F5F1}\n.field:focus-within{border-color:#1679BE;box-shadow:0 0 0 4px rgba(22,121,190,0.14)}\n.field input{outline:none}\ninput[type=checkbox]{accent-color:#2F7A3C;width:18px;height:18px;margin:0}\n";

export default class SignInScreen extends Component {
  render() {
    const vals = this.renderVals();
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
          <div style={{ flexGrow: "1", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }} data-cols="2">
            <div
              style={{ position: "relative", background: "#0D4F8B", color: "#FFFFFF", overflow: "hidden" }}
              data-banner
              data-sec="left-brand-panel"
            >
              {" "}
              <div
                style={{
                  position: "absolute",
                  right: "-160px",
                  top: "420px",
                  width: "640px",
                  height: "640px",
                  borderRadius: "999px",
                  background: "#1A62A8",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{
                  position: "absolute",
                  left: "-140px",
                  bottom: "-200px",
                  width: "420px",
                  height: "420px",
                  borderRadius: "999px",
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
                data-abs="deco"
                data-w
              />{" "}
              <div
                style={{
                  position: "absolute",
                  left: "var(--gutter)",
                  top: "56px",
                  right: "var(--gutter)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                }}
                data-abs="text"
              >
                <Link href="/" aria-label="Simbatech home" style={{ alignSelf: "flex-start" }}>
                  <img src="/images/logo-white.png" alt="Simbatech" style={{ height: "58px", width: "auto", display: "block" }} />
                </Link>
                <span
                  style={{
                    alignSelf: "flex-start",
                    marginTop: "28px",
                    height: "30px",
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.12)",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#CFEBD3",
                  }}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#8FD19A" }} />
                  Buy or rent, one account
                </span>
                <h1
                  style={{
                    margin: "0",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "64px",
                    lineHeight: "0.96",
                    fontWeight: "700",
                    letterSpacing: "-0.045em",
                  }}
                >
                  Own it. Rent it.
                  <br />
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontWeight: "400",
                      letterSpacing: "-0.02em",
                      color: "#8FD19A",
                    }}
                  >
                    Get it today.
                  </span>
                </h1>
                <ul
                  style={{
                    margin: "0",
                    padding: "0",
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    maxWidth: "400px",
                  }}
                >
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#E1ECF5" }}>
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        flexShrink: "0",
                        borderRadius: "10px",
                        background: "rgba(143,209,154,0.16)",
                        color: "#8FD19A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>
                    Buy to keep, or rent by the day
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#E1ECF5" }}>
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        flexShrink: "0",
                        borderRadius: "10px",
                        background: "rgba(143,209,154,0.16)",
                        color: "#8FD19A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>
                    Same-day delivery and collection across [CITY]
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#E1ECF5" }}>
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        flexShrink: "0",
                        borderRadius: "10px",
                        background: "rgba(143,209,154,0.16)",
                        color: "#8FD19A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>
                    Track orders, extend rentals, pay with M-Pesa
                  </li>
                </ul>
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  left: "60px",
                  bottom: "60px",
                  width: "210px",
                  height: "210px",
                  borderRadius: "999px",
                  background: "#E0F1FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                data-abs="text"
                data-sec="collage"
              >
                <div style={{ zoom: "0.9", width: "200px", height: "200px" }}>
                  <Render kind={"camera"} />
                </div>
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  left: "300px",
                  bottom: "150px",
                  width: "170px",
                  height: "170px",
                  borderRadius: "999px",
                  background: "#DDF5EA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                data-abs="misc"
              >
                <div style={{ zoom: "0.72", width: "200px", height: "200px" }}>
                  <Render kind={"tent"} />
                </div>
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  right: "60px",
                  bottom: "210px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "999px",
                  background: "#FFEADB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                data-abs="misc"
              >
                <div style={{ zoom: "0.62", width: "200px", height: "200px" }}>
                  <Render kind={"headphones"} />
                </div>
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  right: "90px",
                  bottom: "36px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "999px",
                  background: "#FFF4C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                data-abs="misc"
              >
                <div style={{ zoom: "0.62", width: "200px", height: "200px" }}>
                  <Render kind={"drill"} />
                </div>
              </div>{" "}
              <div
                style={{
                  position: "absolute",
                  left: "250px",
                  bottom: "56px",
                  height: "44px",
                  padding: "0 8px 0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderRadius: "999px",
                  background: "#FFFFFF",
                  color: "#111318",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
                }}
                data-abs="misc"
              >
                <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
                  <span style={{ fontSize: "11px", color: "#5E6470" }}>Canopy Tent 3 × 3 m</span>
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>KES 3,500 / day</span>
                </span>
                <span
                  style={{
                    height: "30px",
                    padding: "0 10px",
                    borderRadius: "999px",
                    background: "#2F7A3C",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Rent
                </span>
              </div>{" "}
            </div>
            <div
              style={{
                position: "relative",
                background: "#F6F5F1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              data-sec="right-form"
            >
              <Link
                href="/"
                style={{
                  position: "absolute",
                  top: "32px",
                  right: "48px",
                  height: "44px",
                  padding: "0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  background: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0D4F8B",
                }}
                data-abs="misc"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Back to shop
              </Link>
              <div
                style={{
                  width: "480px",
                  boxSizing: "border-box",
                  marginTop: "40px",
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
                <div
                  role="tablist"
                  aria-label="Account access"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "4px",
                    padding: "4px",
                    background: "#F3F2EE",
                    borderRadius: "14px",
                  }}
                  data-cols="2"
                >
                  {(vals.tabs || []).map((t, i0) => (
                    <Fragment key={i0}>
                      <button
                        type="button"
                        role="tab"
                        onClick={t.pick}
                        aria-selected={t.aria}
                        style={{
                          height: "44px",
                          border: "none",
                          borderRadius: "11px",
                          background: t.bg,
                          color: t.fg,
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: t.shadow,
                        }}
                        suppressHydrationWarning
                      >
                        {t.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
                {vals.isSignIn ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} data-sec="sign-in">
                      <h2
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "32px",
                          lineHeight: "1",
                          fontWeight: "700",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        Welcome back
                      </h2>
                      <span style={{ fontSize: "15px", color: "#5E6470" }}>Sign in to track orders and manage rentals.</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label htmlFor="si-id" style={{ fontSize: "13px", fontWeight: "600" }}>
                          Phone or email
                        </label>
                        <div
                          className="field"
                          style={{
                            height: "50px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#FFFFFF",
                          }}
                        >
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
                            id="si-id"
                            type="text"
                            autoComplete="username"
                            placeholder="07XX XXX XXX or you@example.com"
                            style={{
                              flexGrow: "1",
                              minWidth: "0",
                              height: "46px",
                              border: "none",
                              background: "transparent",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label htmlFor="si-pw" style={{ fontSize: "13px", fontWeight: "600" }}>
                          Password
                        </label>
                        <div
                          className="field"
                          style={{
                            height: "50px",
                            boxSizing: "border-box",
                            padding: "0 4px 0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#FFFFFF",
                          }}
                        >
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
                          <input
                            id="si-pw"
                            type={vals.pwType}
                            autoComplete="current-password"
                            placeholder="Your password"
                            style={{
                              flexGrow: "1",
                              minWidth: "0",
                              height: "46px",
                              border: "none",
                              background: "transparent",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                          <button
                            type="button"
                            onClick={vals.togglePw}
                            aria-label={vals.pwToggleLabel}
                            aria-pressed={vals.pwAria}
                            aria-controls="si-pw"
                            style={{
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
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            suppressHydrationWarning
                          >
                            {vals.pwShown ? (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M3 3l18 18" />
                                  <path d="M10.6 6.1A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6M6.3 7.6C3.9 9.3 2.5 12 2.5 12S6 18 12 18a9 9 0 0 0 4-1" />
                                </svg>
                              </>
                            ) : null}
                            {vals.pwHidden ? (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </>
                            ) : null}
                            {vals.pwToggleText}
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label
                          htmlFor="si-remember"
                          style={{
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "14px",
                            color: "#3A3F4A",
                            cursor: "pointer",
                          }}
                        >
                          <input id="si-remember" type="checkbox" checked={vals.remember} onChange={vals.toggleRemember} />
                          Remember me
                        </label>
                        <a
                          href="#"
                          style={{
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0D4F8B",
                          }}
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="btn-y"
                      style={{
                        height: "54px",
                        borderRadius: "14px",
                        background: "#2F7A3C",
                        color: "#FFFFFF",
                        fontSize: "16px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      Sign in
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
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "13px", color: "#5E6470" }}>
                      <span style={{ flexGrow: "1", height: "1px", background: "#E6E4DE" }} />
                      or
                      <span style={{ flexGrow: "1", height: "1px", background: "#E6E4DE" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }} data-cols="2">
                      <button
                        type="button"
                        className="ghost"
                        style={{
                          height: "50px",
                          border: "1.5px solid #E6E4DE",
                          borderRadius: "14px",
                          background: "#FFFFFF",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111318",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "999px",
                            border: "1.5px solid #E6E4DE",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "13px",
                            fontWeight: "800",
                            color: "#1679BE",
                          }}
                        >
                          G
                        </span>
                        Continue with Google
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        style={{
                          height: "50px",
                          border: "1.5px solid #E6E4DE",
                          borderRadius: "14px",
                          background: "#FFFFFF",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111318",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2F7A3C"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="6" y="2" width="12" height="20" rx="3" />
                          <path d="M11 18h2" />
                        </svg>
                        Continue with phone (OTP)
                      </button>
                    </div>
                    <span style={{ fontSize: "14px", color: "#5E6470", textAlign: "center" }}>
                      {"New to Simbatech? "}
                      <button
                        type="button"
                        onClick={vals.goCreate}
                        style={{
                          height: "44px",
                          padding: "0 4px",
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#0D4F8B",
                          cursor: "pointer",
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                        }}
                      >
                        Create an account
                      </button>
                    </span>
                  </>
                ) : null}
                {vals.isCreate ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} data-sec="create-account">
                      <h2
                        style={{
                          margin: "0",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "32px",
                          lineHeight: "1",
                          fontWeight: "700",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        Create your account
                      </h2>
                      <span style={{ fontSize: "15px", color: "#5E6470" }}>Shop, rent and track, in one place.</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label htmlFor="ca-name" style={{ fontSize: "13px", fontWeight: "600" }}>
                          Full name
                        </label>
                        <div
                          className="field"
                          style={{
                            height: "48px",
                            boxSizing: "border-box",
                            padding: "0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            background: "#FFFFFF",
                          }}
                        >
                          <input
                            id="ca-name"
                            type="text"
                            autoComplete="name"
                            placeholder="First and last name"
                            style={{
                              flexGrow: "1",
                              minWidth: "0",
                              height: "44px",
                              border: "none",
                              background: "transparent",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }} data-cols="2">
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label htmlFor="ca-phone" style={{ fontSize: "13px", fontWeight: "600" }}>
                            Phone
                          </label>
                          <div
                            className="field"
                            style={{
                              height: "48px",
                              boxSizing: "border-box",
                              padding: "0 6px 0 6px",
                              border: "1px solid #E6E4DE",
                              borderRadius: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "#FFFFFF",
                            }}
                          >
                            <span
                              style={{
                                height: "34px",
                                padding: "0 8px",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "9px",
                                background: "#F3F2EE",
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#3A3F4A",
                              }}
                            >
                              +254
                            </span>
                            <input
                              id="ca-phone"
                              type="tel"
                              autoComplete="tel-national"
                              placeholder="7XX XXX XXX"
                              style={{
                                flexGrow: "1",
                                minWidth: "0",
                                height: "44px",
                                border: "none",
                                background: "transparent",
                                font: "inherit",
                                fontSize: "15px",
                                color: "#111318",
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label htmlFor="ca-email" style={{ fontSize: "13px", fontWeight: "600" }}>
                            Email
                          </label>
                          <div
                            className="field"
                            style={{
                              height: "48px",
                              boxSizing: "border-box",
                              padding: "0 14px",
                              border: "1px solid #E6E4DE",
                              borderRadius: "14px",
                              display: "flex",
                              alignItems: "center",
                              background: "#FFFFFF",
                            }}
                          >
                            <input
                              id="ca-email"
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              style={{
                                flexGrow: "1",
                                minWidth: "0",
                                height: "44px",
                                border: "none",
                                background: "transparent",
                                font: "inherit",
                                fontSize: "15px",
                                color: "#111318",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label htmlFor="ca-pw" style={{ fontSize: "13px", fontWeight: "600" }}>
                          Password
                        </label>
                        <div
                          className="field"
                          style={{
                            height: "48px",
                            boxSizing: "border-box",
                            padding: "0 4px 0 16px",
                            border: "1px solid #E6E4DE",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#FFFFFF",
                          }}
                        >
                          <input
                            id="ca-pw"
                            type={vals.pwType}
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            value={vals.newPw}
                            onChange={vals.onNewPw}
                            aria-describedby="ca-strength"
                            style={{
                              flexGrow: "1",
                              minWidth: "0",
                              height: "44px",
                              border: "none",
                              background: "transparent",
                              font: "inherit",
                              fontSize: "15px",
                              color: "#111318",
                            }}
                          />
                          <button
                            type="button"
                            onClick={vals.togglePw}
                            aria-label={vals.pwToggleLabel}
                            aria-pressed={vals.pwAria}
                            aria-controls="ca-pw"
                            style={{
                              height: "40px",
                              padding: "0 12px",
                              border: "none",
                              borderRadius: "10px",
                              background: "#F3F2EE",
                              color: "#0D4F8B",
                              font: "inherit",
                              fontSize: "13px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                            suppressHydrationWarning
                          >
                            {vals.pwToggleText}
                          </button>
                        </div>
                        <div
                          id="ca-strength"
                          aria-live="polite"
                          style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              aria-hidden="true"
                              style={{ flexGrow: "1", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "4px" }}
                              data-cols="4"
                            >
                              {(vals.bars || []).map((b, i0) => (
                                <Fragment key={i0}>
                                  <span
                                    style={{ height: "6px", borderRadius: "999px", background: b.bg, transition: "background .2s ease" }}
                                  />
                                </Fragment>
                              ))}
                            </div>
                            <span
                              style={{ width: "84px", textAlign: "right", fontSize: "13px", fontWeight: "700", color: vals.strength.fg }}
                              suppressHydrationWarning
                            >
                              {vals.strength.label}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "14px", fontSize: "12px" }}>
                            {(vals.rules || []).map((r, i0) => (
                              <Fragment key={i0}>
                                <span
                                  style={{ display: "flex", alignItems: "center", gap: "5px", color: r.fg, fontWeight: "600" }}
                                  suppressHydrationWarning
                                >
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
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M5 12l5 5 9-10" />
                                    </svg>
                                  </span>
                                  {r.label}
                                  <span className="sr-only" suppressHydrationWarning>
                                    {r.sr}
                                  </span>
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                      <label
                        htmlFor="ca-terms"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "12px 0 0",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          color: "#3A3F4A",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          id="ca-terms"
                          type="checkbox"
                          checked={vals.terms}
                          onChange={vals.toggleTerms}
                          style={{ marginTop: "1px" }}
                        />
                        I agree to the Terms of use, Rental terms and Privacy policy.
                      </label>
                    </div>
                    {vals.canCreate ? (
                      <>
                        <Link
                          href="/account"
                          className="btn-y"
                          style={{
                            height: "54px",
                            borderRadius: "14px",
                            background: "#2F7A3C",
                            color: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          Create account
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
                        </Link>
                      </>
                    ) : null}
                    {vals.cannotCreate ? (
                      <>
                        <button
                          type="button"
                          aria-disabled="true"
                          style={{
                            height: "54px",
                            border: "none",
                            borderRadius: "14px",
                            background: "#A9CDB0",
                            color: "#0F3A17",
                            font: "inherit",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "not-allowed",
                          }}
                        >
                          Create account
                        </button>
                        <span
                          style={{ marginTop: "-10px", fontSize: "12px", color: "#5E6470", textAlign: "center" }}
                          suppressHydrationWarning
                        >
                          {vals.createHint}
                        </span>
                      </>
                    ) : null}
                  </>
                ) : null}
                <span style={{ fontSize: "12px", lineHeight: "1.5", color: "#5E6470", textAlign: "center" }}>
                  {"By continuing you agree to our "}
                  <a href="#" style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    Terms
                  </a>
                  {" and "}
                  <a href="#" style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    Privacy policy
                  </a>
                  {". Need help? "}
                  <a href="#" style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    Contact support
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
