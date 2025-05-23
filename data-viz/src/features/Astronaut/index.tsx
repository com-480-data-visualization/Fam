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
    <div style={{ display: 'flex', width: '100vw', height: '600px', background: 'black' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', marginBottom: '60px' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[1, 2, 3]} intensity={1} />
          <OrbitControls autoRotate autoRotateSpeed={5} enableZoom={false} enablePan={false} />
          <AstronautModel />
        </Canvas>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '40px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Come explore space history with us.</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          Explore the milestones of space exploration — from the first Moon landings to the latest missions. Discover the science, challenges, and achievements that have shaped humanity's journey beyond Earth.
        </p>
        <button
          onClick={handleClick}
          style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Start Exploring →
        </button>
      </div>
    </div>
  );
}
