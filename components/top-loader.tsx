"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * A YouTube-style progress bar that spans the top of the viewport while a
 * page navigation is in flight. Self-contained: drop it once into a layout
 * and it tracks every `<Link>` click, programmatic `router.push`, and
 * browser back/forward. It intentionally ignores `router.refresh()` (a data
 * revalidation, not a page load) since the URL doesn't change.
 */
export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const running = useRef(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startRef = useRef<() => void>(() => {});
  const finishRef = useRef<() => void>(() => {});
  const firstRender = useRef(true);

  useEffect(() => {
    const clearTrickle = () => {
      if (trickle.current) clearInterval(trickle.current);
      trickle.current = null;
    };
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    // Creep toward ~90% while we wait — never reaching the end until the new
    // route renders, with diminishing steps so it feels alive.
    function start() {
      if (running.current) return;
      running.current = true;
      setVisible(true);
      setProgress(8);
      trickle.current = setInterval(() => {
        setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
      }, 350);
      // Safety net: never leave the bar stuck if a navigation is cancelled.
      timers.current.push(setTimeout(finish, 10000));
    }

    function finish() {
      if (!running.current) return;
      running.current = false;
      clearTrickle();
      clearTimers();
      setProgress(100);
      timers.current.push(
        setTimeout(() => {
          setVisible(false);
          timers.current.push(setTimeout(() => setProgress(0), 300));
        }, 220),
      );
    }

    startRef.current = start;
    finishRef.current = finish;

    const sameLocation = (url: URL) =>
      url.pathname === location.pathname && url.search === location.search;

    function onClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || sameLocation(url)) return;
      start();
    }

    // Programmatic navigations (`router.push`/`replace`) funnel through
    // history — patch it, but only fire when the URL actually changes so
    // `refresh()`-style updates stay quiet.
    const originalPush = history.pushState;
    history.pushState = function (...args) {
      const next = args[2];
      if (next != null) {
        try {
          if (!sameLocation(new URL(next.toString(), location.href))) start();
        } catch {
          /* ignore malformed URLs */
        }
      }
      return originalPush.apply(this, args);
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", start);
      history.pushState = originalPush;
      clearTrickle();
      clearTimers();
    };
    // Wires up global listeners once and owns the full state machine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A completed navigation lands here: the new route's pathname/search is
  // committed, so drive the bar home.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    finishRef.current();
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="h-full bg-primary transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 8px var(--primary), 0 0 4px var(--primary)",
        }}
      />
    </div>
  );
}
