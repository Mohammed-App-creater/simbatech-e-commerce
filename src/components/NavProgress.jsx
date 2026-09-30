"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/*
 * Thin progress bar at the top of the window during client-side navigation. It starts on a click on
 * an internal link (or a "nav:start" event from store.navigate) and completes when the new URL has
 * rendered, so there's feedback the moment someone clicks even when the API is slow to answer.
 */
export const NAV_START_EVENT = "nav:start";

function isInternalNav(e) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
  if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return null;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname.startsWith("/api/")) return null;
  // same page (or only the #hash changes): no navigation to wait for
  if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
  return url;
}

export default function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState({ on: false, width: 0 });
  const timer = useRef(null);
  const safety = useRef(null);

  function stopTimers() {
    clearInterval(timer.current);
    clearTimeout(safety.current);
  }

  function start() {
    stopTimers();
    setState({ on: true, width: 8 });
    // creep towards 90% while waiting; the last stretch fills when the page arrives
    timer.current = setInterval(() => {
      setState((s) => (s.on ? { on: true, width: s.width + (90 - s.width) * 0.08 } : s));
    }, 200);
    // never leave the bar stuck if a navigation is cancelled or fails
    safety.current = setTimeout(done, 60000);
  }

  function done() {
    stopTimers();
    setState((s) => (s.on ? { on: true, width: 100 } : s));
    setTimeout(() => setState({ on: false, width: 0 }), 250);
  }

  useEffect(() => {
    const onClick = (e) => {
      if (isInternalNav(e)) start();
    };
    // capture phase: next/link calls preventDefault() on its clicks before a bubbling listener would run
    document.addEventListener("click", onClick, true);
    window.addEventListener(NAV_START_EVENT, start);
    window.addEventListener("popstate", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAV_START_EVENT, start);
      window.removeEventListener("popstate", start);
      stopTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the URL changed: the new page has rendered
  useEffect(() => {
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        height: "3px",
        width: state.width + "%",
        background: "#F0AE00",
        boxShadow: "0 0 8px rgba(240,174,0,0.6)",
        opacity: state.on ? 1 : 0,
        transition: "width 200ms ease, opacity 250ms ease",
        pointerEvents: "none",
      }}
    />
  );
}
