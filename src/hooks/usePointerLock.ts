import { useEffect, useState } from "react";

interface PointerLockState {
  isLocked: boolean;
  rotation: { x: number; y: number };
}

export default function usePointerLock(sensitivity = 0.002) {
  const [state, setState] = useState<PointerLockState>({
    isLocked: false,
    rotation: { x: 0, y: 0 },
  });

  useEffect(() => {
    const handlePointerLockChange = () => {
      setState((prev) => ({
        ...prev,
        isLocked: document.pointerLockElement !== null,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        setState((prev) => {
          const newX = prev.rotation.x - e.movementY * sensitivity;
          const clampedX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, newX));

          return {
            ...prev,
            rotation: {
              x: clampedX,
              y: prev.rotation.y - e.movementX * sensitivity,
            },
          };
        });
      }
    };

    const handleClick = () => {
      if (!document.pointerLockElement) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, [sensitivity]);

  return state;
}
