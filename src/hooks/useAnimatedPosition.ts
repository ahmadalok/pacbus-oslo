"use client";

import { useRef, useEffect, useState } from "react";

interface Position {
  lat: number;
  lng: number;
  bearing: number;
}

export function useAnimatedPosition(
  target: Position,
  duration: number = 10_000
) {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);
  const startRef = useRef(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = target;
    startRef.current = Date.now();

    function animate() {
      const elapsed = Date.now() - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const ease = t * (2 - t); // ease-out quad

      setCurrent({
        lat: prev.lat + (target.lat - prev.lat) * ease,
        lng: prev.lng + (target.lng - prev.lng) * ease,
        bearing: target.bearing,
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target.lat, target.lng, target.bearing, duration]);

  return current;
}
