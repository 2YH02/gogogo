import { useCallback, useEffect, useState } from "react";

export default function useKeys() {
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const onDown = useCallback((e: KeyboardEvent) => {
    setKeys((key) =>
      key[e.key.toLowerCase()] ? key : { ...key, [e.key.toLowerCase()]: true }
    );
  }, []);

  const onUp = useCallback((e: KeyboardEvent) => {
    setKeys((key) => {
      if (!key[e.key.toLowerCase()]) return key;
      const copy = { ...key };
      delete copy[e.key.toLowerCase()];
      return copy;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [onUp, onDown]);

  return keys;
}
