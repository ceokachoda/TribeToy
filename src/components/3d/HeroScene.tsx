"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles, SpotLight, Text } from "@react-three/drei";
import * as THREE from "three";

// Generate a heart shape for the Heart Lamp placeholder
const heartShape = new THREE.Shape();
heartShape.moveTo(0, 0.5);
heartShape.bezierCurveTo(0.5, 1, 1.5, 1, 1.5, 0);
heartShape.bezierCurveTo(1.5, -1, 0, -1.5, 0, -2.5);
heartShape.bezierCurveTo(0, -1.5, -1.5, -1, -1.5, 0);
heartShape.bezierCurveTo(-1.5, 1, -0.5, 1, 0, 0.5);

const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };

function HeartLamp({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = active ? 1.2 : 0;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} visible={targetScale > 0.01}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshPhysicalMaterial color="#FF0055" emissive="#FF0055" emissiveIntensity={0.5} roughness={0.2} metalness={0.1} clearcoat={1} />
    </mesh>
  );
}

function DragonFigure({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = active ? 1.5 : 0;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} visible={targetScale > 0.01}>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhysicalMaterial color="#7000FF" emissive="#3000aa" emissiveIntensity={0.2} roughness={0.1} metalness={0.8} clearcoat={1} wireframe />
    </mesh>
  );
}

function HoneycombShelf({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = active ? 1 : 0;
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} visible={targetScale > 0.01}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 6]} />
        <meshPhysicalMaterial color="#00F0FF" roughness={0.4} metalness={0.6} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 6]} />
        <meshPhysicalMaterial color="#00F0FF" roughness={0.4} metalness={0.6} clearcoat={0.5} />
      </mesh>
      <mesh position={[1.5, 0.9, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 6]} />
        <meshPhysicalMaterial color="#00F0FF" roughness={0.4} metalness={0.6} clearcoat={0.5} />
      </mesh>
    </group>
  );
}

function ShowcaseManager() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
      <group position={[0, 0, 0]}>
        <HeartLamp active={activeIndex === 0} />
        <DragonFigure active={activeIndex === 1} />
        <HoneycombShelf active={activeIndex === 2} />
      </group>
      
      {/* Base Pedestal */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[2.5, 3, 0.2, 64]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 64]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1} />
      </mesh>
    </Float>
  );
}

function CinematicBackground() {
  const cubes = useMemo(() => Array.from({ length: 20 }).map(() => ({
    pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 10] as [number, number, number],
    scale: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? "#FF0055" : (Math.random() > 0.5 ? "#00F0FF" : "#7000FF"),
  })), []);

  return (
    <>
      <Sparkles count={300} scale={20} size={1.5} speed={0.2} opacity={0.4} color="#ffffff" />
      {cubes.map((cube, i) => (
        <Float key={i} speed={1} floatIntensity={2} rotationIntensity={2}>
          <mesh position={cube.pos} scale={cube.scale}>
            <boxGeometry />
            <meshStandardMaterial color={cube.color} emissive={cube.color} emissiveIntensity={0.5} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const vec = new THREE.Vector3();
  
  useFrame(() => {
    // Parallax based on mouse
    camera.position.lerp(vec.set(pointer.x * 1, pointer.y * 1, 8), 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} shadows>
      <color attach="background" args={["#030305"]} />
      <fog attach="fog" args={["#030305", 5, 20]} />
      
      <ambientLight intensity={0.2} />
      
      {/* Volumetric-like Spotlights */}
      <SpotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={5} color="#FF0055" castShadow />
      <SpotLight position={[-5, 5, 5]} angle={0.5} penumbra={1} intensity={5} color="#00F0FF" />
      <SpotLight position={[0, -5, -5]} angle={0.5} penumbra={1} intensity={3} color="#7000FF" />

      <ShowcaseManager />
      <CinematicBackground />
      <Rig />
      
      <Environment preset="night" />
    </Canvas>
  );
}
