import { Environment, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

import * as THREE from "three";
import Gopher from "./components/Gopher";
import ThirdPersonCamera from "./components/ThirdPersonCamera";
import usePointerLock from "./hooks/usePointerLock";


function Ground() {
  const texture = useTexture("/grass.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.anisotropy = 8;

  return (
    <mesh
      position={[0, -1, 0]}
      rotation={[-THREE.MathUtils.degToRad(90), 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#dd6868" map={texture} />
    </mesh>
  );
}

function App() {
  const gopherRef = useRef<THREE.Group>(null!);
  const pointerLock = usePointerLock(0.002);

  return (
    <>
      {!pointerLock.isLocked && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "24px",
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          화면을 클릭하여 시작하세요
          <br />
          <span style={{ fontSize: "16px" }}>
            WASD: 이동 | 마우스: 카메라 회전 | ESC: 나가기
          </span>
        </div>
      )}

      <Canvas shadows>
        <ThirdPersonCamera
          target={gopherRef}
          rotation={pointerLock.rotation}
          distance={10}
          height={3}
          smoothness={0.15}
        />

        <fog attach="fog" args={["#cce0aa", 30, 80]} />

        <ambientLight intensity={0.35} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Gopher ref={gopherRef} cameraRotation={pointerLock.rotation} />

        <Ground />

        <Environment preset="forest" />
      </Canvas>
    </>
  );
}

export default App;
