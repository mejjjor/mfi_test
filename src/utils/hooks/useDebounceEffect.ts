import { useEffect, DependencyList, useRef } from "react";

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
  disabledFirstRun: boolean = false
) {
  const firstUpdate = useRef(disabledFirstRun);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!firstUpdate.current) {
        fn.apply(undefined, deps);
      } else {
        firstUpdate.current = false;
      }
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
