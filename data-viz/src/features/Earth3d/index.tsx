import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React, { useRef, useEffect, useState } from "react";
import { Mesh } from "three";
import gsap from "gsap";



function EarthModel() {
  const ref = useRef<Mesh>(null);
  const scrollY = useRef(0); // Store scroll offset

  const { scene } = useGLTF("/models/earth.glb");
  const [visible, setVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Listen to scroll
  React.useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  if (ref.current) {
    // Initial position & scale
    ref.current.scale.set(0.1, 0.1, 0.1);
    ref.current.position.set(5, 15, 0);

    const handleScroll = () => {
      scrollY.current = window.scrollY;
      setHasScrolled(true); // mark scroll started
    };
    window.addEventListener("scroll", handleScroll);

    const timeout = setTimeout(() => {
      setVisible(true);

      // Animate to visible position and scale
      gsap.to(ref.current!.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 1.5,
        ease: "power2.out",
      });

      gsap.to(ref.current!.position, {
        x: 1,
        y: -1,
        duration: 1.5,
        ease: "power2.out",
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }
}, []);

  useFrame(() => {
  if (ref.current && visible) {
    ref.current.rotation.y += 0.002;

    if (hasScrolled) {
      ref.current.position.y = -1 + scrollY.current * 0.005;

      const newScale = Math.max(0.5, 2 - scrollY.current * 0.0025);
      ref.current.scale.set(newScale, newScale, newScale);
    }
  }
});


  return <primitive ref={ref} object={scene} visible={visible} />;
}

export default function Earth3D() {
  return (
    <div className="w-full h-screen text-white flex">
      {/* Left side: Big Title */}
      <div className="flex-1 flex flex-col items-start justify-center text-left pl-8 space-y-6 bg-black/30">
        <h1 className="text-5xl md:text-8xl font-bold leading-tight">
          Beyond Earth
        </h1>
        <p className="text-base md:text-sm max-w-xl">
          From Cold War rocket races to Mars-bound missions, navigate the
          incredible journey of spaceflight. Explore timelines, launch
          providers, and iconic rockets — all through an interactive space atlas
          built for the curious and the bold.
        </p>
      </div>

      {/* Right side: 3D Earth */}
      <div className="flex-1">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: "black" }}
        >
          {/* Subtle ambient blue light for shadows */}
          <ambientLight intensity={3} color="#446688" />
          {/* Fixed warm directional light (sun) from top-left */}
          <directionalLight
            position={[-5, 5, -5]}
            intensity={2}
            color="#ffe3b5"
            castShadow
          />
          <pointLight position={[-10, 0, 10]} intensity={0.8} />{" "}
          {/* Adds warmth from another angle */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
          <EarthModel />
        </Canvas>
      </div>
    </div>
  );
}
