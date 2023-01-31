import { useEffect, useState } from "react";

const useReactiveState = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, setValue];
};

export default useReactiveState;
