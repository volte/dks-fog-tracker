import { useState, useEffect } from "react";
import _ from "lodash";

export interface Breakpoints {
  sm?: number;
  md?: number;
  lg?: number;
}

export const xs = 0;
export const sm = 1;
export const md = 2;
export const lg = 3;

const defaultBreakpoints: Breakpoints = {
  sm: 320,
  md: 720,
  lg: 1024,
};

const getBreakpoint = (breakpoints: Breakpoints, width: number): number => {
  let smBrk = breakpoints.sm ?? 0;
  let mdBrk = breakpoints.md ?? 0;
  let lgBrk = breakpoints.lg ?? 0;
  if (width < smBrk) {
    return xs;
  } else if (width >= smBrk && width < mdBrk) {
    return sm;
  } else if (width >= mdBrk && width < lgBrk) {
    return md;
  } else if (width >= lgBrk) {
    return lg;
  }
  return xs;
};

const useBreakpoint = (breakpoints: Breakpoints = defaultBreakpoints) => {
  const [brkPnt, setBrkPnt] = useState(() =>
    getBreakpoint(breakpoints, window.innerWidth)
  );

  useEffect(() => {
    const calcInnerWidth = _.throttle(function () {
      setBrkPnt(getBreakpoint(breakpoints, window.innerWidth));
    }, 200);
    window.addEventListener("resize", calcInnerWidth);
    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  return brkPnt;
};

export default useBreakpoint;
