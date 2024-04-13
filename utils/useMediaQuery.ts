import { useLayoutEffect, useState } from "react";
import tailwindConfig from "../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const handleResize = () => {
      const mobileSize = Number(fullConfig.theme.screens.sm.replace("px", ""));
      if (!mobileSize) return;
      setIsMobile(window.innerWidth < mobileSize);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { isMobile };
};
