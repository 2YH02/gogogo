import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import useKeys from "../hooks/useKeys";

const Gopher = ({
  ref,
  cameraRotation,
}: {
  ref: React.RefObject<Group>;
  cameraRotation: { x: number; y: number };
}) => {
  const { scene } = useGLTF("/gopher.glb");
  const keys = useKeys();

  useFrame(() => {
    if (!ref.current) return;

    const moveSpeed = 0.1;
    const moveDirection = new THREE.Vector3();

    if (keys["w"]) {
      moveDirection.x -= Math.sin(cameraRotation.y);
      moveDirection.z -= Math.cos(cameraRotation.y);
    }
    if (keys["s"]) {
      moveDirection.x += Math.sin(cameraRotation.y);
      moveDirection.z += Math.cos(cameraRotation.y);
    }
    if (keys["a"]) {
      moveDirection.x -= Math.cos(cameraRotation.y);
      moveDirection.z += Math.sin(cameraRotation.y);
    }
    if (keys["d"]) {
      moveDirection.x += Math.cos(cameraRotation.y);
      moveDirection.z -= Math.sin(cameraRotation.y);
    }

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      ref.current.position.x += moveDirection.x * moveSpeed;
      ref.current.position.z += moveDirection.z * moveSpeed;

      const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
      ref.current.rotation.y = targetRotation;
    }
  });

  return <primitive ref={ref} object={scene} castShadow />;
};

export default Gopher;
