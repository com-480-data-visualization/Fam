import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSelection } from "../../contexts/SelectionContext";

interface AstronautProps {
  eraSectionRef: React.RefObject<HTMLDivElement | null>;
}

function AstronautModel() {
  const { scene } = useGLTF('/models/astronaut1.glb');
  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

export default function Astronaut({ eraSectionRef }: AstronautProps) {
  const { setShowEraSelector } = useSelection();

  const handleClick = () => {
    setShowEraSelector(true);
    setTimeout(() => {
      if (eraSectionRef.current) {
        const top = eraSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
<div className="flex w-screen h-[600px] bg-black">
  {/* Left: 3D Canvas */}
  <div className="flex-1 flex justify-center items-center mt-10 mb-14">
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[1, 2, 3]} intensity={1} />
      <OrbitControls autoRotate autoRotateSpeed={5} enableZoom={false} enablePan={false} />
      <AstronautModel />
    </Canvas>
  </div>

  {/* Right: Text + Button */}
  <div className="flex-1 flex flex-col justify-center items-start p-10 text-left">
    <h1 className="text-xl md:text-4xl font-bold leading-tight mb-6">
      Explore space history with us
    </h1>
    <p className="text-base md:text-lm mb-6 pr-10">
      Explore the milestones of space exploration — from the first Moon landings to the latest missions. Discover the science, challenges, and achievements that have shaped humanity's journey beyond Earth.
    </p>
    <button
      onClick={handleClick}
      className="px-10 py-2.5 text-base font-bold bg-slate-800 text-white rounded-md border-none cursor-pointer"
    >
      Start Exploring →
    </button>
  </div>
</div>

  );
}
