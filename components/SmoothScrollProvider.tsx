"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";

interface Props {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: Props) {
  const lenis = useRef<Lenis>();

  useLayoutEffect(() => {
    lenis.current = new Lenis({ duration: 1.2, smoothWheel: true });

    const raf = (time: number) => {
      lenis.current?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => lenis.current?.destroy();
  }, []);

  return <>{children}</>;
}
