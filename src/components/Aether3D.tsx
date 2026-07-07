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
  idle: { core: "#60a5fa", accent: "#e2e8f0", glass: "#e0f2fe", pulseSpeed: 1.1, pulseDepth: 0.1, emission: 1.8, rotationSpeed: 0.08 },
  processing: { core: "#a855f7", accent: "#c084fc", glass: "#f5f3ff", pulseSpeed: 8.6, pulseDepth: 0.32, emission: 4.2, rotationSpeed: 0.45 },
  typing: { core: "#f59e0b", accent: "#fde68a", glass: "#fff7ed", pulseSpeed: 3.4, pulseDepth: 0.22, emission: 2.8, rotationSpeed: 0.24 },
  success: { core: "#34d399", accent: "#f8fafc", glass: "#ecfeff", pulseSpeed: 4.8, pulseDepth: 0.42, emission: 5.5, rotationSpeed: 0.16 },
  error: { core: "#fb7185", accent: "#fecdd3", glass: "#fff1f2", pulseSpeed: 5.8, pulseDepth: 0.28, emission: 3.4, rotationSpeed: 0.12 },
};

function Limb({
  position,
  rotation,
  length,
  material,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  material: MeshStandardMaterial;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.06, length, 24]} />
        <primitive object={material} attach="material" />
      </mesh>
      <mesh position={[0, length / 2, 0]} castShadow>
        <sphereGeometry args={[0.075, 24, 24]} />
        <primitive object={material} attach="material" />
      </mesh>
      <mesh position={[0, -length / 2, 0]} castShadow>
        <sphereGeometry args={[0.07, 24, 24]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

function AetherRig({ aiState }: { aiState: AetherAiState }) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const chestCore = useRef<Mesh>(null);
  const chestRing = useRef<Mesh>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftHand = useRef<Mesh>(null);
  const rightHand = useRef<Mesh>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);
  const coreLight = useRef<PointLight>(null);
  const look = useRef(new Vector3(0, 0, 0));
  const currentCore = useRef(new Color(stateProfiles.idle.core));
  const currentAccent = useRef(new Color(stateProfiles.idle.accent));
  const successBurst = useRef(0);
  const previousState = useRef<AetherAiState>(aiState);

  const darkMetal = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#111827",
        metalness: 0.94,
        roughness: 0.2,
        envMapIntensity: 1.5,
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
        opacity: 0.94,
        blending: AdditiveBlending,
      }),
    [],
  );

  const accentMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: stateProfiles.idle.accent,
        emissive: new Color(stateProfiles.idle.accent),
        emissiveIntensity: 0.72,
        metalness: 0.78,
        roughness: 0.16,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    if (aiState === "success" && previousState.current !== "success") successBurst.current = 1;
    previousState.current = aiState;
  }, [aiState]);

  useFrame((state, delta) => {
    const profile = stateProfiles[aiState];
    const elapsed = state.clock.elapsedTime;
    const burst = successBurst.current;
    const pulse = 1 + Math.sin(elapsed * profile.pulseSpeed) * profile.pulseDepth + burst * 0.48;
    const breathing = Math.sin(elapsed * 1.25) * 0.025;

    currentCore.current.lerp(new Color(profile.core), 1 - Math.exp(-delta * 5.5));
    currentAccent.current.lerp(new Color(profile.accent), 1 - Math.exp(-delta * 4));
    successBurst.current = Math.max(0, successBurst.current - delta * 1.8);
    look.current.lerp(new Vector3(state.pointer.x * 0.42, state.pointer.y * 0.22, 0), 1 - Math.exp(-delta * 6));

    if (root.current) {
      root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, look.current.x, 1 - Math.exp(-delta * 5));
      root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, -look.current.y * 0.45, 1 - Math.exp(-delta * 5));
      root.current.position.y = Math.sin(elapsed * 0.9) * 0.045;
    }

    if (head.current) {
      head.current.rotation.y = Math.sin(elapsed * 0.75) * 0.05 + look.current.x * 0.5;
      head.current.rotation.x = -look.current.y * 0.35;
    }

    if (torso.current) {
      torso.current.scale.set(1 + breathing, 1 + breathing * 0.65, 1 + breathing);
      torso.current.rotation.y = Math.sin(elapsed * 0.6) * 0.035;
    }

    if (leftArm.current && rightArm.current) {
      const gesture = aiState === "typing" ? Math.sin(elapsed * 4.2) * 0.12 : Math.sin(elapsed * 1.4) * 0.055;
      leftArm.current.rotation.z = 0.58 + gesture;
      rightArm.current.rotation.z = -0.72 - gesture * 0.8;
      rightArm.current.rotation.x = 0.5 + Math.sin(elapsed * 1.8) * 0.05;
    }

    if (leftHand.current && rightHand.current) {
      leftHand.current.scale.setScalar(1 + Math.sin(elapsed * 2.8) * 0.025);
      rightHand.current.scale.setScalar(1 + Math.sin(elapsed * 3.2) * 0.035);
    }

    if (chestCore.current) {
      chestCore.current.scale.setScalar(pulse);
      emissiveMaterial.emissive.copy(currentCore.current);
      emissiveMaterial.emissiveIntensity = profile.emission + burst * 7;
    }

    if (chestRing.current) {
      chestRing.current.rotation.z += delta * (profile.rotationSpeed + 0.45);
      chestRing.current.scale.setScalar(1 + Math.sin(elapsed * profile.pulseSpeed * 0.4) * 0.035 + burst * 0.08);
    }

    if (leftEye.current && rightEye.current) {
      leftEye.current.scale.setScalar(1 + Math.sin(elapsed * 5.2) * 0.08 + burst * 0.25);
      rightEye.current.scale.copy(leftEye.current.scale);
    }

    if (coreLight.current) {
      coreLight.current.color.copy(currentCore.current);
      coreLight.current.intensity = profile.emission * 3.4 + burst * 20;
    }

    accentMaterial.color.copy(currentAccent.current);
    accentMaterial.emissive.copy(currentAccent.current);
  });

  return (
    <group ref={root} position={[0.08, -0.26, 0]} rotation={[0.02, -0.24, -0.02]}>
      <pointLight ref={coreLight} position={[0, 0.4, 1.2]} intensity={6} distance={5} />

      <group ref={head} position={[0.02, 1.24, 0.06]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.25}
            chromaticAberration={0.075}
            color={stateProfiles[aiState].glass}
            distortion={0.18}
            distortionScale={0.2}
            ior={1.38}
            roughness={0.08}
            samples={8}
            temporalDistortion={0.1}
            thickness={0.46}
            transmission={0.9}
            transparent
          />
        </mesh>
        <mesh position={[-0.095, 0.035, 0.252]} ref={leftEye}>
          <sphereGeometry args={[0.036, 24, 24]} />
          <primitive object={emissiveMaterial} attach="material" />
        </mesh>
        <mesh position={[0.095, 0.035, 0.252]} ref={rightEye}>
          <sphereGeometry args={[0.036, 24, 24]} />
          <primitive object={emissiveMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.29, 0.01, 0.02]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.09, 0.018, 16, 48]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
        <mesh position={[0.29, 0.01, 0.02]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.09, 0.018, 16, 48]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      </group>

      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.11, 0.28, 28]} />
        <primitive object={darkMetal} attach="material" />
      </mesh>

      <group ref={torso} position={[0, 0.38, 0]}>
        <mesh scale={[0.58, 0.78, 0.34]} castShadow receiveShadow>
          <sphereGeometry args={[0.52, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.4}
            chromaticAberration={0.08}
            color={stateProfiles[aiState].glass}
            distortion={0.26}
            distortionScale={0.22}
            ior={1.36}
            roughness={0.1}
            samples={8}
            temporalDistortion={0.12}
            thickness={0.68}
            transmission={0.9}
            transparent
          />
        </mesh>
        <mesh ref={chestCore} position={[0, 0.1, 0.39]}>
          <sphereGeometry args={[0.13, 40, 40]} />
          <primitive object={emissiveMaterial} attach="material" />
        </mesh>
        <mesh ref={chestRing} position={[0, 0.1, 0.405]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.2, 0.012, 12, 80]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      </group>

      <mesh position={[0, -0.38, 0]} scale={[0.48, 0.34, 0.28]} castShadow>
        <sphereGeometry args={[0.45, 48, 48]} />
        <MeshTransmissionMaterial
          backside
          chromaticAberration={0.065}
          color={stateProfiles[aiState].glass}
          distortion={0.18}
          ior={1.34}
          roughness={0.12}
          thickness={0.42}
          transmission={0.84}
          transparent
        />
      </mesh>

      <group ref={leftArm} position={[-0.43, 0.56, 0.02]} rotation={[0.2, 0.02, 0.58]}>
        <Limb position={[0, -0.2, 0]} rotation={[0.12, 0, 0.08]} length={0.5} material={darkMetal} />
        <Limb position={[-0.08, -0.68, 0.1]} rotation={[0.4, 0.12, -0.16]} length={0.48} material={darkMetal} />
        <mesh ref={leftHand} position={[-0.18, -0.98, 0.2]} scale={[1.05, 0.78, 0.85]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      </group>

      <group ref={rightArm} position={[0.45, 0.54, 0.02]} rotation={[0.5, -0.08, -0.72]}>
        <Limb position={[0, -0.2, 0]} rotation={[0.08, 0, -0.04]} length={0.48} material={darkMetal} />
        <Limb position={[0.1, -0.64, 0.16]} rotation={[0.5, -0.08, 0.22]} length={0.46} material={darkMetal} />
        <mesh ref={rightHand} position={[0.24, -0.9, 0.3]} scale={[1.1, 0.72, 0.82]}>
          <sphereGeometry args={[0.085, 24, 24]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      </group>

      <mesh position={[-0.32, -0.79, 0.02]} rotation={[0.22, 0, 0.12]}>
        <cylinderGeometry args={[0.055, 0.075, 0.58, 24]} />
        <primitive object={darkMetal} attach="material" />
      </mesh>
      <mesh position={[0.31, -0.79, 0.02]} rotation={[0.22, 0, -0.12]}>
        <cylinderGeometry args={[0.055, 0.075, 0.58, 24]} />
        <primitive object={darkMetal} attach="material" />
      </mesh>

      <Sparkles
        color={stateProfiles[aiState].core}
        count={58}
        opacity={0.5}
        scale={[2.4, 2.8, 2.0]}
        size={1.35}
        speed={aiState === "processing" ? 1.8 : 0.58}
      />
    </group>
  );
}

function Scene({ aiState }: { aiState: AetherAiState }) {
  return (
    <>
      <ambientLight intensity={0.78} />
      <directionalLight position={[2.8, 4, 3.2]} intensity={2.4} />
      <directionalLight position={[-3, 1.2, 2]} intensity={0.9} color="#93c5fd" />
      <AetherRig aiState={aiState} />
      <ContactShadows blur={2.8} far={4} opacity={0.16} position={[0, -1.42, 0]} scale={4.5} />
      <Environment preset="city" />
    </>
  );
}

function Aether3D({ aiState = "idle", className, performanceDpr = [1, 1.55] }: Aether3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ fov: 31, position: [0.05, 0.3, 5.2] }}
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
