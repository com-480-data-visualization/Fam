import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function EarthModel() {
  const { scene } = useGLTF('/models/earth.glb');
  return <primitive object={scene} scale={1.25} />;
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
                            enablePan={false}   
                            autoRotate autoRotateSpeed={1} />
            <EarthModel />
        </Canvas>
      </div>
    </div>

    
  );
}
