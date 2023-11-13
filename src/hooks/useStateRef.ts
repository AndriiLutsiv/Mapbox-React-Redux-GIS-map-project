import { useEffect, useRef } from "react";

const useStateRef = <T>(value: T) => {
  const ref = useRef(value);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref;
};

export default useStateRef;
