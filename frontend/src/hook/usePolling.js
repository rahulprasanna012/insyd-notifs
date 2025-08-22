import { useEffect, useRef, useState } from "react";

/**
 * Stable polling that:
 * - uses the latest fn via a ref (no interval restarts on every render)
 * - prevents overlapping requests with an in-flight guard
 */
export default function usePolling(fn, { intervalMs = 5000, immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const timerRef = useRef(null);
  const fnRef = useRef(fn);
  const inFlight = useRef(false);

  // Keep the latest fn without changing the interval
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const run = async () => {
    if (inFlight.current) return;       // 👈 avoid overlap
    inFlight.current = true;
    try {
      const res = await fnRef.current?.();
      setData(res ?? null);
      setErr(null);
    } catch (e) {
      setErr(e);
    } finally {
      inFlight.current = false;
    }
  };

  useEffect(() => {
    if (immediate) run();
    timerRef.current = setInterval(run, intervalMs);
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [intervalMs, immediate]);           // 👈 does NOT depend on fn

  return { data, err, refresh: run };
}
