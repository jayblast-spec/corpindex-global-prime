"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import {
  AdditiveBlending,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  Vector3,
} from "three";

export type AetherAiState = "idle" | "processing" | "typing" | "success" | "error";

interface Aether3DProps {
  aiState?: AetherAiState;
  className?: string;
  performanceDpr?: [number, number];
}

interface StateProfile {
  core: string;
  accent: string;
  glass: string;
  pulseSpeed: number;
  pulseDepth: number;
  emission: number;
  rotationSpeed: number;
}

const stateProfiles: Record<AetherAiState, StateProfile> = {
  idle: {
    core: "#7dd3fc",
    accent: "#cbd5e1",
    glass: "#dbeafe",
    pulseSpeed: 1.25,
    pulseDepth: 0.12,
    emission: 1.6,
    rotationSpeed: 0.12,
  },
  processing: {
    core: "#a855f7",
    accent: "#c084fc",
    glass: "#ede9fe",
    pulseSpeed: 8.5,
    pulseDepth: 0.32,
    emission: 3.8,
    rotationSpeed: 0.62,
  },
  typing: {
    core: "#f59e0b",
    accent: "#facc15",
    glass: "#fef3c7",
    pulseSpeed: 3.2,
    pulseDepth: 0.24,
    emission: 2.6,
    rotationSpeed: 0.34,
  },
  success: {
    core: "#34d399",
    accent: "#f8fafc",
    glass: "#ecfeff",
    pulseSpeed: 4.5,
    pulseDepth: 0.4,
    emission: 5.2,
    rotationSpeed: 0.22,
  },
  error: {
    core: "#fb7185",
    accent: "#fecdd3",
    glass: "#ffe4e6",
    pulseSpeed: 5.5,
    pulseDepth: 0.28,
    emission: 3.2,
    rotationSpeed: 0.16,
  },
};

function AetherRig({ aiState }: { aiState: AetherAiState }) {
  const root = useRef<Group>(null);
  const chassis = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const leftFin = useRef<Mesh>(null);
  const rightFin = useRef<Mesh>(null);
  const coreLight = useRef<PointLight>(null);
  const look = useRef(new Vector3(0, 0, 0));
  const currentCore = useRef(new Color(stateProfiles.idle.core));
  const currentAccent = useRef(new Color(stateProfiles.idle.accent));
  const successBurst = useRef(0);
  const previousState = useRef<AetherAiState>(aiState);

  const darkMetal = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0f172a",
        metalness: 0.92,
        roughness: 0.24,
        envMapIntensity: 1.35,
      }),
    [],
  );

  const emissiveMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ffffff",
        emissive: new Color(stateProfiles.idle.core),
        emissiveIntensity: stateProfiles.idle.emission,
        toneMapped: false,
        transparent: true,
        opacity: 0.92,
        blending: AdditiveBlending,
      }),
    [],
  );

  const accentMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: stateProfiles.idle.accent,
        emissive: new Color(stateProfiles.idle.accent),
        emissiveIntensity: 0.55,
        metalness: 0.74,
        roughness: 0.18,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    if (aiState === "success" && previousState.current !== "success") {
      successBurst.current = 1;
    }

    previousState.current = aiState;
  }, [aiState]);

  useFrame((state, delta) => {
    const profile = stateProfiles[aiState];
    const elapsed = state.clock.elapsedTime;
    const burst = successBurst.current;
    const pulse = 1 + Math.sin(elapsed * profile.pulseSpeed) * profile.pulseDepth + burst * 0.55;
    const wave = Math.sin(elapsed * 2.2 + Math.cos(elapsed * 0.8)) * 0.06;

    currentCore.current.lerp(new Color(profile.core), 1 - Math.exp(-delta * 5));
    currentAccent.current.lerp(new Color(profile.accent), 1 - Math.exp(-delta * 4));
    successBurst.current = Math.max(0, successBurst.current - delta * 1.8);

    look.current.lerp(new Vector3(state.pointer.x * 0.34, state.pointer.y * 0.22, 0), 1 - Math.exp(-delta * 6));

    if (root.current) {
      root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, look.current.x, 1 - Math.exp(-delta * 5));
      root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, -look.current.y, 1 - Math.exp(-delta * 5));
      root.current.rotation.z = Math.sin(elapsed * 0.6) * 0.025;
      root.current.position.y = Math.sin(elapsed * 1.1) * 0.055;
    }

    if (chassis.current) {
      chassis.current.rotation.y += delta * profile.rotationSpeed;
      chassis.current.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.012);
    }

    if (core.current) {
      core.current.scale.setScalar(aiState === "typing" ? pulse + wave : pulse);
      emissiveMaterial.emissive.copy(currentCore.current);
      emissiveMaterial.emissiveIntensity = profile.emission + burst * 7;
    }

    if (coreLight.current) {
      coreLight.current.color.copy(currentCore.current);
      coreLight.current.intensity = profile.emission * 3.2 + burst * 18;
    }

    if (halo.current) {
      halo.current.rotation.x += delta * (profile.rotationSpeed + 0.18);
      halo.current.rotation.z -= delta * (profile.rotationSpeed * 0.55 + 0.08);
      halo.current.scale.setScalar(1 + Math.sin(elapsed * profile.pulseSpeed * 0.5) * 0.025 + burst * 0.08);
    }

    if (leftFin.current && rightFin.current) {
      const finLift = Math.sin(elapsed * (aiState === "typing" ? 4.8 : 1.8)) * (aiState === "typing" ? 0.13 : 0.05);
      leftFin.current.rotation.z = -0.36 + finLift;
      rightFin.current.rotation.z = 0.36 - finLift;
      accentMaterial.color.copy(currentAccent.current);
      accentMaterial.emissive.copy(currentAccent.current);
    }
  });

  return (
    <group ref={root}>
      <pointLight ref={coreLight} position={[0, 0.1, 0.7]} intensity={5} distance={4} />

      <mesh ref={chassis} castShadow receiveShadow>
        <sphereGeometry args={[0.82, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.35}
          chromaticAberration={0.055}
          color={stateProfiles[aiState].glass}
          distortion={0.22}
          distortionScale={0.18}
          ior={1.35}
          metalness={0.03}
          roughness={0.09}
          samples={8}
          temporalDistortion={0.12}
          thickness={0.58}
          transmission={0.88}
          transparent
        />
      </mesh>

      <mesh ref={core} position={[0, 0.02, 0.03]}>
        <sphereGeometry args={[0.26, 48, 48]} />
        <primitive object={emissiveMaterial} attach="material" />
      </mesh>

      <mesh ref={halo} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.72, 0.022, 16, 128]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.016, 12, 96]} />
        <primitive object={darkMetal} attach="material" />
      </mesh>

      <mesh ref={leftFin} position={[-0.72, -0.05, -0.02]} rotation={[0.1, 0.28, -0.36]} castShadow>
        <cylinderGeometry args={[0.04, 0.075, 0.58, 20]} />
        <primitive object={darkMetal} attach="material" />
      </mesh>

      <mesh ref={rightFin} position={[0.72, -0.05, -0.02]} rotation={[0.1, -0.28, 0.36]} castShadow>
        <cylinderGeometry args={[0.04, 0.075, 0.58, 20]} />
        <primitive object={darkMetal} attach="material" />
      </mesh>

      <mesh position={[-0.34, 0.22, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.08, 24]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      <mesh position={[0.34, 0.22, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.08, 24]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      <Sparkles
        color={stateProfiles[aiState].core}
        count={44}
        opacity={0.55}
        scale={[1.8, 1.35, 1.8]}
        size={1.35}
        speed={aiState === "processing" ? 1.7 : 0.55}
      />
    </group>
  );
}

function Scene({ aiState }: { aiState: AetherAiState }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2.4, 3.2, 3.5]} intensity={2.1} />
      <AetherRig aiState={aiState} />
      <ContactShadows blur={2.6} far={4} opacity={0.22} position={[0, -1.03, 0]} scale={4} />
      <Environment preset="city" />
    </>
  );
}

function Aether3D({ aiState = "idle", className, performanceDpr = [1, 1.75] }: Aether3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ fov: 36, position: [0, 0.05, 4.2] }}
        dpr={performanceDpr}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        <Scene aiState={aiState} />
      </Canvas>
    </div>
  );
}

export default memo(Aether3D);
