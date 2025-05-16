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
            <ambientLight intensity={0.3} />             {/* Soft ambient fill */}
            <directionalLight
                position={[10, 10, 10]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
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
