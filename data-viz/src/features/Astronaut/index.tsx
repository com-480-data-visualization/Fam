import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function AstronautModel() {
  const { scene } = useGLTF('/models/astronaut.glb');
  return <primitive object={scene} scale={0.5} />;
}

export default function Earth3D() {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 3]} />
        <OrbitControls  enableZoom={false} 
                        enablePan={false}   
                        autoRotate autoRotateSpeed={1} />
        <AstronautModel />
      </Canvas>
    </div>
  );
}
