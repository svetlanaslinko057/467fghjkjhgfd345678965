/**
 * useIsMobile - Hook to detect mobile viewport
 * B16 Mobile Retail Polish
 */
import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 920) {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}
