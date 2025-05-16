import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { useRef } from 'react';

function EarthModel() {
  const ref = useRef(null);
  const scrollY = useRef(0); // Store scroll offset

  const { scene } = useGLTF('/models/earth.glb');

  // Listen to scroll
  React.useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      // Move Earth up as you scroll down (adjust sensitivity here)
      ref.current.position.y = -1 + scrollY.current * 0.005;
    }
  });

  return <primitive ref={ref} object={scene} scale={2} position={[1, -1, 0]} />;
}


export default function Earth3D() {
  return (
    <div className="w-full h-screen bg-black text-white flex">
      {/* Left side: Big Title */}
      <div className="flex-1 flex items-center justify-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Explore the Global Launch Landscape
        </h1>
      </div>

      {/* Right side: 3D Earth */}
      <div className="flex-1">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ background: "black" }}>
            {/* Subtle ambient blue light for shadows */}
          <ambientLight intensity={3} color="#446688" />

            {/* Fixed warm directional light (sun) from top-left */}
            <directionalLight
              position={[-5, 5, -5]}
              intensity={2}
              color="#ffe3b5"
              castShadow
            />
            <pointLight position={[-10, 0, 10]} intensity={0.8} />   {/* Adds warmth from another angle */}
            <OrbitControls  enableZoom={false} 
                            enablePan={false}/>
            <EarthModel />
        </Canvas>
      </div>
    </div>

    
  );
}
