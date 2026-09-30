"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Render from "@/components/Render";
import { auth, navigate, shopState, connectShop, authConfig, storeVals } from "@/lib/client/store";
import PhoneInput from "@/components/PhoneInput";
import { isCompletePhone } from "@/lib/phone";

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
    var init = props.initial || {};
    this.state = {
      tab: init.tab === "signup" ? "create" : "signin",
      showPw: false,
      remember: true,
      newPw: "",
      terms: false,
      siId: "",
      siPw: "",
      caName: "",
      caPhone: "",
      caEmail: "",
      pending: false,
      error: "",
      note: "",
      // "google" when the Google redirect came back with ?error=google (cleared on the next action)
      topError: init.error === "google" ? "Google sign-in didn't complete. Try again or use your phone or email." : "",
      // "password" (the normal form) | "otp" (phone sign-in) | "forgot" (password reset), sign-in tab only
      mode: "password",
      // phone (OTP) sign-in
      otpStep: 1,
      otpPhone: "",
      otpSentTo: "",
      otpCode: "",
      otpName: "",
      otpNewAccount: false,
      otpNeedName: false,
      otpDevCode: "",
      // forgot password
      fpId: "",
      fpVia: "",
      fpDevLink: "",
      fpDevCode: "",
      fpCode: "",
      fpPw: "",
      // seconds until "Resend" is allowed again (shared by the OTP and SMS-reset steps)
      resendIn: 0,
    };
  }
  componentDidMount() {
    this.unsubShop = connectShop(this);
  }
  componentWillUnmount() {
    this.unsubShop && this.unsubShop();
    this.stopCountdown();
  }
  stopCountdown() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
  }
  startCountdown(seconds) {
    var self = this;
    this.stopCountdown();
    var n = Math.max(0, Math.round(Number(seconds) || 0));
    this.setState({ resendIn: n });
    if (!n) return;
    this.resendTimer = setInterval(function () {
      var left = (self.state.resendIn || 0) - 1;
      if (left <= 0) self.stopCountdown();
      self.setState({ resendIn: Math.max(0, left) });
    }, 1000);
  }
  nextHref() {
    return (this.props.initial && this.props.initial.next) || "/account";
  }
  setMode(mode) {
    this.stopCountdown();
    this.setState({
      mode: mode,
      error: "",
      note: "",
      topError: "",
      pending: false,
      otpStep: 1,
      otpCode: "",
      otpName: "",
      otpNewAccount: false,
      otpNeedName: false,
      otpDevCode: "",
      fpVia: "",
      fpDevLink: "",
      fpDevCode: "",
      fpCode: "",
      fpPw: "",
      resendIn: 0,
      // prefill the reset form from whatever the user typed into the sign-in field
      fpId: mode === "forgot" ? this.state.siId || this.state.fpId : this.state.fpId,
      otpPhone: mode === "otp" && !this.state.otpPhone && /^[+\d\s]+$/.test(this.state.siId || "") ? this.state.siId : this.state.otpPhone,
    });
  }
  fail(err) {
    this.setState({ pending: false, error: (err && err.message) || "Something went wrong. Please try again." });
  }
  // ── Phone (OTP) sign-in ──
  submitOtpSend(e) {
    if (e) e.preventDefault();
    var self = this;
    var s = this.state;
    if (s.pending) return;
    var phone = (s.otpStep === 2 ? s.otpSentTo : s.otpPhone).trim();
    if (!phone) {
      this.setState({ error: "Enter your phone number.", note: "" });
      return;
    }
    if (!isCompletePhone(phone)) {
      this.setState({ error: "Enter the 9 digits after +251, starting with 9 or 7 (e.g. 911 234 567).", note: "" });
      return;
    }
    this.setState({ pending: true, error: "", note: "", topError: "" });
    auth
      .otpSend(phone)
      .then(function (res) {
        res = res || {};
        self.setState({
          pending: false,
          otpStep: 2,
          otpSentTo: res.phone || phone,
          otpNewAccount: !!res.newAccount,
          otpNeedName: !!res.newAccount,
          otpDevCode: res.devCode ? String(res.devCode) : "",
          otpCode: s.otpStep === 2 ? s.otpCode : "",
          note: s.otpStep === 2 ? "We sent you a new code." : "",
        });
        self.startCountdown(res.resendInSeconds);
      })
      .catch(function (err) {
        self.fail(err);
      });
  }
  submitOtpVerify(e) {
    if (e) e.preventDefault();
    var self = this;
    var s = this.state;
    if (s.pending) return;
    var code = (s.otpCode || "").replace(/\D/g, "");
    if (code.length !== 6) {
      this.setState({ error: "Enter the 6-digit code we sent you.", note: "" });
      return;
    }
    if (s.otpNeedName && s.otpName.trim().length < 2) {
      this.setState({ error: "Enter your name to create your account.", note: "" });
      return;
    }
    this.setState({ pending: true, error: "", note: "" });
    auth
      .otpVerify(s.otpSentTo, code, s.otpNeedName ? s.otpName.trim() : undefined, !!s.remember)
      .then(function () {
        self.stopCountdown();
        navigate(self.nextHref());
      })
      .catch(function (err) {
        if (err && err.status === 422 && err.field === "name") {
          self.setState({ pending: false, otpNeedName: true, error: err.message || "Enter your name to create your account." });
          return;
        }
        self.fail(err);
      });
  }
  // ── Forgot password ──
  submitForgot(e) {
    if (e) e.preventDefault();
    var self = this;
    var s = this.state;
    if (s.pending) return;
    var id = (s.fpId || "").trim();
    if (!id) {
      this.setState({ error: "Enter your phone or email.", note: "" });
      return;
    }
    this.setState({ pending: true, error: "", note: "", topError: "" });
    auth
      .forgotPassword(id)
      .then(function (res) {
        res = res || {};
        self.setState({
          pending: false,
          fpVia: res.via === "sms" ? "sms" : "email",
          fpDevLink: res.devLink || "",
          fpDevCode: res.devCode ? String(res.devCode) : "",
          fpCode: s.fpVia === "sms" ? s.fpCode : "",
          note: s.fpVia === "sms" ? "We sent you a new code." : "",
        });
        if (res.via === "sms") self.startCountdown(res.resendInSeconds);
      })
      .catch(function (err) {
        self.fail(err);
      });
  }
  submitReset(e) {
    if (e) e.preventDefault();
    var self = this;
    var s = this.state;
    if (s.pending) return;
    var code = (s.fpCode || "").replace(/\D/g, "");
    if (code.length !== 6) {
      this.setState({ error: "Enter the 6-digit code we sent you.", note: "" });
      return;
    }
    if (score(s.fpPw) < 2) {
      this.setState({ error: "Choose a password with at least 8 characters, including a number or a symbol.", note: "" });
      return;
    }
    this.setState({ pending: true, error: "", note: "" });
    auth
      .resetPassword({ phone: (s.fpId || "").trim(), code: code, password: s.fpPw })
      .then(function () {
        self.stopCountdown();
        navigate(self.nextHref());
      })
      .catch(function (err) {
        self.fail(err);
      });
  }
  submitSignIn(e) {
    if (e) e.preventDefault();
    var self = this;
    var s = this.state;
    if (s.pending) return;
    if (!s.siId.trim() || !s.siPw) {
      this.setState({ error: "Enter your phone or email and your password.", note: "" });
      return;
    }
    this.setState({ pending: true, error: "", note: "", topError: "" });
    auth
      .signIn(s.siId.trim(), s.siPw, !!s.remember)
      .then(function () {
        navigate((self.props.initial && self.props.initial.next) || "/account");
      })
      .catch(function (err) {
        self.setState({ pending: false, error: (err && err.message) || "Something went wrong. Please try again." });
      });
  }
  submitCreate(e) {
    if (e) e.preventDefault();
    var self = this;
    var s = this.state;
    if (s.pending) return;
    if (score(s.newPw) < 2 || !s.terms) return;
    var identifier = s.caPhone.trim() || s.caEmail.trim();
    if (!s.caName.trim()) {
      this.setState({ error: "Enter your full name.", note: "" });
      return;
    }
    if (!identifier) {
      this.setState({ error: "Enter your phone or email.", note: "" });
      return;
    }
    if (s.caPhone.trim() && !isCompletePhone(s.caPhone)) {
      this.setState({ error: "Enter the 9 digits after +251, starting with 9 or 7 (e.g. 911 234 567).", note: "" });
      return;
    }
    this.setState({ pending: true, error: "", note: "", topError: "" });
    auth
      .signUp(s.caName.trim(), identifier, s.newPw)
      .then(function () {
        navigate((self.props.initial && self.props.initial.next) || "/account");
      })
      .catch(function (err) {
        self.setState({ pending: false, error: (err && err.message) || "Something went wrong. Please try again." });
      });
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var shop = shopState(this.props.initial);
    var store = storeVals(shop);
    var authCfg = authConfig(shop);
    var tab = s.tab || "signin";
    var mode = s.mode || "password";
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
          self.setState({ tab: t.id, error: "", note: "", topError: "" });
          if (self.state.mode !== "password") self.setMode("password");
        },
      };
    });
    var resendIn = s.resendIn || 0;
    var otpDev = !!s.otpDevCode || (!!authCfg.otpDevMode && s.otpStep === 2);
    var fpDev = !!s.fpDevCode || (!!authCfg.otpDevMode && s.fpVia === "sms");
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
      isSignIn: tab === "signin" && mode === "password",
      isOtp: tab === "signin" && mode === "otp",
      isForgot: tab === "signin" && mode === "forgot",
      isCreate: tab === "create",
      city: store.city,
      goCreate: function () {
        self.setState({ tab: "create", error: "", note: "", topError: "" });
        if (self.state.mode !== "password") self.setMode("password");
      },
      next: this.nextHref(),
      pending: !!s.pending,
      pendingAria: s.pending ? "true" : "false",
      error: s.error || "",
      note: s.note || "",
      topError: s.topError || "",
      // Google: a real link only when the server has it configured
      googleOn: !!authCfg.google,
      googleOff: !authCfg.google,
      googleHref: auth.googleStartUrl(this.nextHref()),
      googleNote: function (e) {
        if (e) e.preventDefault();
        self.setState({ error: "", note: "Google sign-in isn't set up yet — use your phone or email." });
      },
      usePassword: function (e) {
        if (e) e.preventDefault();
        self.setMode("password");
      },
      useOtp: function (e) {
        if (e) e.preventDefault();
        self.setMode("otp");
      },
      useForgot: function (e) {
        if (e) e.preventDefault();
        self.setMode("forgot");
      },
      // ── phone (OTP) sign-in ──
      otpStep1: s.otpStep !== 2,
      otpStep2: s.otpStep === 2,
      otpPhone: s.otpPhone || "",
      otpSentTo: s.otpSentTo || "",
      otpCode: s.otpCode || "",
      otpName: s.otpName || "",
      otpNeedName: !!s.otpNeedName,
      otpDev: otpDev,
      otpDevText: s.otpDevCode
        ? "Development mode: your code is " + s.otpDevCode
        : "Development mode: no SMS is sent — the code is in the server log.",
      otpSend: function (e) {
        self.submitOtpSend(e);
      },
      enterOtpSend: function (e) {
        if (e.key === "Enter") self.submitOtpSend(e);
      },
      otpVerify: function (e) {
        self.submitOtpVerify(e);
      },
      enterOtpVerify: function (e) {
        if (e.key === "Enter") self.submitOtpVerify(e);
      },
      otpSendLabel: s.pending ? "Sending code…" : "Send code",
      otpVerifyLabel: s.pending ? "Signing in…" : s.otpNeedName ? "Create account" : "Sign in",
      changeNumber: function (e) {
        if (e) e.preventDefault();
        self.stopCountdown();
        self.setState({
          otpStep: 1,
          otpCode: "",
          otpDevCode: "",
          otpNeedName: false,
          otpNewAccount: false,
          error: "",
          note: "",
          resendIn: 0,
        });
      },
      // ── resend (OTP step 2 and SMS reset) ──
      canResend: resendIn <= 0,
      resendWait: resendIn > 0,
      resendText: "Resend in " + resendIn + "s",
      resendOtp: function (e) {
        self.submitOtpSend(e);
      },
      resendReset: function (e) {
        self.submitForgot(e);
      },
      // ── forgot password ──
      fpStart: !s.fpVia,
      fpEmail: s.fpVia === "email",
      fpSms: s.fpVia === "sms",
      fpId: s.fpId || "",
      fpCode: s.fpCode || "",
      fpPw: s.fpPw || "",
      fpDevLink: s.fpDevLink || "",
      fpDev: fpDev,
      fpDevText: s.fpDevCode
        ? "Development mode: your code is " + s.fpDevCode
        : "Development mode: no SMS is sent — the code is in the server log.",
      forgot: function (e) {
        self.submitForgot(e);
      },
      enterForgot: function (e) {
        if (e.key === "Enter") self.submitForgot(e);
      },
      reset: function (e) {
        self.submitReset(e);
      },
      enterReset: function (e) {
        if (e.key === "Enter") self.submitReset(e);
      },
      forgotLabel: s.pending ? "Sending…" : "Continue",
      resetLabel: s.pending ? "Saving…" : "Set new password",
      siId: s.siId || "",
      siPw: s.siPw || "",
      caName: s.caName || "",
      caPhone: s.caPhone || "",
      caEmail: s.caEmail || "",
      field: function (name) {
        return function (e) {
          var patch = { error: "" };
          patch[name] = e.target.value;
          self.setState(patch);
        };
      },
      enterSignIn: function (e) {
        if (e.key === "Enter") self.submitSignIn(e);
      },
      enterCreate: function (e) {
        if (e.key === "Enter") self.submitCreate(e);
      },
      signIn: function (e) {
        self.submitSignIn(e);
      },
      create: function (e) {
        self.submitCreate(e);
      },
      signInLabel: s.pending ? "Signing in…" : "Sign in",
      createLabel: s.pending ? "Creating account…" : "Create account",
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
                    Same-day delivery and collection across {vals.city}
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
                    Track orders, extend rentals, pay with Telebirr
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
                data-abs="art"
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
                data-abs="art"
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
                data-abs="art"
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
                data-abs="art"
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
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>ETB 3,500 / day</span>
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
                href="/shop"
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
                    {vals.topError ? (
                      <span role="alert" style={{ marginTop: "-10px", fontSize: "12px", color: "#B02418", textAlign: "center" }}>
                        {vals.topError}
                      </span>
                    ) : null}
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
                            placeholder="09XX XXX XXX or you@example.com"
                            value={vals.siId}
                            onChange={vals.field("siId")}
                            onKeyDown={vals.enterSignIn}
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
                            value={vals.siPw}
                            onChange={vals.field("siPw")}
                            onKeyDown={vals.enterSignIn}
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
                          onClick={vals.useForgot}
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
                      href={vals.next}
                      onClick={vals.signIn}
                      aria-disabled={vals.pendingAria}
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
                      {vals.signInLabel}
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
                    {vals.error ? (
                      <span role="alert" style={{ marginTop: "-10px", fontSize: "12px", color: "#B02418", textAlign: "center" }}>
                        {vals.error}
                      </span>
                    ) : null}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "13px", color: "#5E6470" }}>
                      <span style={{ flexGrow: "1", height: "1px", background: "#E6E4DE" }} />
                      or
                      <span style={{ flexGrow: "1", height: "1px", background: "#E6E4DE" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }} data-cols="2">
                      {vals.googleOn ? (
                        <a
                          href={vals.googleHref}
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
                        </a>
                      ) : null}
                      {vals.googleOff ? (
                        <button
                          type="button"
                          className="ghost"
                          aria-disabled="true"
                          onClick={vals.googleNote}
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
                      ) : null}
                      <button
                        type="button"
                        className="ghost"
                        onClick={vals.useOtp}
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
                    {vals.note ? (
                      <span role="status" style={{ marginTop: "-10px", fontSize: "12px", color: "#5E6470", textAlign: "center" }}>
                        {vals.note}
                      </span>
                    ) : null}
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
                {vals.isOtp ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} data-sec="sign-in-otp">
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
                        Sign in with your phone
                      </h2>
                      <span style={{ fontSize: "15px", color: "#5E6470" }} role="status">
                        {vals.otpStep1 ? "We'll text you a one-time code." : "We sent a code to " + vals.otpSentTo}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {vals.otpStep1 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label htmlFor="otp-phone" style={{ fontSize: "13px", fontWeight: "600" }}>
                            Phone
                          </label>
                          <PhoneInput
                            id="otp-phone"
                            value={vals.otpPhone}
                            onChange={vals.field("otpPhone")}
                            onKeyDown={vals.enterOtpSend}
                            height={50}
                            radius={14}
                            border="1px solid #E6E4DE"
                          />
                        </div>
                      ) : null}
                      {vals.otpStep2 ? (
                        <>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="otp-code" style={{ fontSize: "13px", fontWeight: "600" }}>
                              6-digit code
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
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                              </svg>
                              <input
                                id="otp-code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="123456"
                                value={vals.otpCode}
                                onChange={vals.field("otpCode")}
                                onKeyDown={vals.enterOtpVerify}
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
                            {vals.otpDev ? <span style={{ fontSize: "12px", color: "#5E6470" }}>{vals.otpDevText}</span> : null}
                          </div>
                          {vals.otpNeedName ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <label htmlFor="otp-name" style={{ fontSize: "13px", fontWeight: "600" }}>
                                Your name
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
                                  id="otp-name"
                                  type="text"
                                  autoComplete="name"
                                  placeholder="First and last name"
                                  value={vals.otpName}
                                  onChange={vals.field("otpName")}
                                  onKeyDown={vals.enterOtpVerify}
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
                          ) : null}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label
                              htmlFor="otp-remember"
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
                              <input id="otp-remember" type="checkbox" checked={vals.remember} onChange={vals.toggleRemember} />
                              Remember me
                            </label>
                            {vals.canResend ? (
                              <a
                                href="#"
                                onClick={vals.resendOtp}
                                aria-disabled={vals.pendingAria}
                                style={{
                                  height: "44px",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#0D4F8B",
                                }}
                              >
                                Resend code
                              </a>
                            ) : null}
                            {vals.resendWait ? (
                              <span
                                aria-live="polite"
                                style={{
                                  height: "44px",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#5E6470",
                                }}
                              >
                                {vals.resendText}
                              </span>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <Link
                      href={vals.next}
                      onClick={vals.otpStep1 ? vals.otpSend : vals.otpVerify}
                      aria-disabled={vals.pendingAria}
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
                      {vals.otpStep1 ? vals.otpSendLabel : vals.otpVerifyLabel}
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
                    {vals.error ? (
                      <span role="alert" style={{ marginTop: "-10px", fontSize: "12px", color: "#B02418", textAlign: "center" }}>
                        {vals.error}
                      </span>
                    ) : null}
                    {vals.note ? (
                      <span role="status" style={{ marginTop: "-10px", fontSize: "12px", color: "#5E6470", textAlign: "center" }}>
                        {vals.note}
                      </span>
                    ) : null}
                    <span style={{ fontSize: "14px", color: "#5E6470", textAlign: "center" }}>
                      {vals.otpStep2 ? (
                        <>
                          <button
                            type="button"
                            onClick={vals.changeNumber}
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
                            Change number
                          </button>
                          {" · "}
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={vals.usePassword}
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
                        Use password instead
                      </button>
                    </span>
                  </>
                ) : null}
                {vals.isForgot ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} data-sec="forgot-password">
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
                        Reset your password
                      </h2>
                      <span style={{ fontSize: "15px", color: "#5E6470" }} role="status">
                        {vals.fpStart
                          ? "Enter your phone or email and we'll help you choose a new one."
                          : vals.fpEmail
                            ? "We've emailed you a link to choose a new password."
                            : "We sent a code to " + vals.fpId}
                      </span>
                    </div>
                    {vals.fpEmail && vals.fpDevLink ? (
                      <span style={{ fontSize: "12px", lineHeight: "1.5", color: "#5E6470", textAlign: "center" }}>
                        {"Development mode: no email is sent — "}
                        <a
                          href={vals.fpDevLink}
                          style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}
                        >
                          open the reset link
                        </a>
                      </span>
                    ) : null}
                    {vals.fpStart || vals.fpSms ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {vals.fpStart ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="fp-id" style={{ fontSize: "13px", fontWeight: "600" }}>
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
                                id="fp-id"
                                type="text"
                                autoComplete="username"
                                placeholder="09XX XXX XXX or you@example.com"
                                value={vals.fpId}
                                onChange={vals.field("fpId")}
                                onKeyDown={vals.enterForgot}
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
                        ) : null}
                        {vals.fpSms ? (
                          <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <label htmlFor="fp-code" style={{ fontSize: "13px", fontWeight: "600" }}>
                                6-digit code
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
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <rect x="6" y="2" width="12" height="20" rx="3" />
                                  <path d="M11 18h2" />
                                </svg>
                                <input
                                  id="fp-code"
                                  type="text"
                                  inputMode="numeric"
                                  autoComplete="one-time-code"
                                  maxLength={6}
                                  placeholder="123456"
                                  value={vals.fpCode}
                                  onChange={vals.field("fpCode")}
                                  onKeyDown={vals.enterReset}
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
                              {vals.fpDev ? <span style={{ fontSize: "12px", color: "#5E6470" }}>{vals.fpDevText}</span> : null}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <label htmlFor="fp-pw" style={{ fontSize: "13px", fontWeight: "600" }}>
                                New password
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
                                  id="fp-pw"
                                  type={vals.pwType}
                                  autoComplete="new-password"
                                  placeholder="At least 8 characters"
                                  value={vals.fpPw}
                                  onChange={vals.field("fpPw")}
                                  onKeyDown={vals.enterReset}
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
                                  aria-controls="fp-pw"
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
                                  {vals.pwToggleText}
                                </button>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                              {vals.canResend ? (
                                <a
                                  href="#"
                                  onClick={vals.resendReset}
                                  aria-disabled={vals.pendingAria}
                                  style={{
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#0D4F8B",
                                  }}
                                >
                                  Resend code
                                </a>
                              ) : null}
                              {vals.resendWait ? (
                                <span
                                  aria-live="polite"
                                  style={{
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#5E6470",
                                  }}
                                >
                                  {vals.resendText}
                                </span>
                              ) : null}
                            </div>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                    {vals.fpStart || vals.fpSms ? (
                      <Link
                        href={vals.next}
                        onClick={vals.fpStart ? vals.forgot : vals.reset}
                        aria-disabled={vals.pendingAria}
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
                        {vals.fpStart ? vals.forgotLabel : vals.resetLabel}
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
                    ) : null}
                    {vals.error ? (
                      <span role="alert" style={{ marginTop: "-10px", fontSize: "12px", color: "#B02418", textAlign: "center" }}>
                        {vals.error}
                      </span>
                    ) : null}
                    {vals.note ? (
                      <span role="status" style={{ marginTop: "-10px", fontSize: "12px", color: "#5E6470", textAlign: "center" }}>
                        {vals.note}
                      </span>
                    ) : null}
                    <span style={{ fontSize: "14px", color: "#5E6470", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={vals.usePassword}
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
                        Back to sign in
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
                            value={vals.caName}
                            onChange={vals.field("caName")}
                            onKeyDown={vals.enterCreate}
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
                          <PhoneInput
                            id="ca-phone"
                            value={vals.caPhone}
                            onChange={vals.field("caPhone")}
                            onKeyDown={vals.enterCreate}
                            height={48}
                            radius={14}
                            border="1px solid #E6E4DE"
                          />
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
                              value={vals.caEmail}
                              onChange={vals.field("caEmail")}
                              onKeyDown={vals.enterCreate}
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
                            onKeyDown={vals.enterCreate}
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
                            suppressHydrationWarning
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
                          href={vals.next}
                          onClick={vals.create}
                          aria-disabled={vals.pendingAria}
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
                          {vals.createLabel}
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
                        {vals.error ? (
                          <span role="alert" style={{ marginTop: "-10px", fontSize: "12px", color: "#B02418", textAlign: "center" }}>
                            {vals.error}
                          </span>
                        ) : null}
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
                  <Link
                    href="/p/terms"
                    style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Terms
                  </Link>
                  {" and "}
                  <Link
                    href="/p/privacy"
                    style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Privacy policy
                  </Link>
                  {". Need help? "}
                  <Link
                    href="/p/contact"
                    style={{ fontWeight: "600", color: "#0D4F8B", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Contact support
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
