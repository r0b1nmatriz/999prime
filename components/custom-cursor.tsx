
"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div
        className="cursor-dot"
        style={{ transform: `translate(${position.x - 2}px, ${position.y - 2}px)` }}
      />
      <div
        className="cursor-outline"
        style={{ transform: `translate(${position.x - 10}px, ${position.y - 10}px)` }}
      />
    </>
  );
}
