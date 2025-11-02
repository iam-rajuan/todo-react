import { useEffect, useState } from "react";

/**
 * Simple hook to keep a value in localStorage + state.
 * Serializes/deserializes automatically.
 */
export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.error("useLocalStorage read error:", err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error("useLocalStorage write error:", err);
    }
  }, [key, state]);

  return [state, setState];
}
