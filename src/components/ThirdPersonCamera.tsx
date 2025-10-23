import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThirdPersonCameraProps {
  target: React.RefObject<THREE.Object3D>;
  rotation: { x: number; y: number };
  distance?: number;
  height?: number;
  smoothness?: number;
}

export default function ThirdPersonCamera({
  target,
  rotation,
  distance = 5,
  height = 2,
  smoothness = 0.1,
}: ThirdPersonCameraProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!target.current) return;

    const horizontalDistance = distance * Math.cos(rotation.x);
    const verticalDistance = distance * Math.sin(rotation.x);

    const idealOffset = new THREE.Vector3(
      Math.sin(rotation.y) * horizontalDistance,
      height + verticalDistance,
      Math.cos(rotation.y) * horizontalDistance
    );

    const targetPosition = target.current.position.clone().add(idealOffset);

    camera.position.lerp(targetPosition, smoothness);

    const lookAtTarget = target.current.position
      .clone()
      .add(new THREE.Vector3(0, 1, 0));
    currentLookAt.current.lerp(lookAtTarget, smoothness);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
