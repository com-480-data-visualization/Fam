import { useRef, useState } from "react";
import { useSelection } from "../../../contexts/SelectionContext";
import MainViz from "../../../features/MainViz";
import EraSelector from "../../../features/EraSelector";
import ProviderSelector from "../../../features/ProviderSelector";
import RocketSelector from "../../../features/RocketSelector";
import RocketInfo from "../../../features/RocketInfo";
import Footer from "../../../features/Footer";
import Earth3D from "../../../features/Earth3d";
import Astronaut from "../../../features/Astronaut";

export default function Layout() {
  const { selectedEra, selectedProvider, selectedRocket, showRocketSelector } = useSelection();

  const [showEraSelector, setShowEraSelector] = useState(false);

  const providerSectionRef = useRef<HTMLDivElement>(null);
  const rocketSectionRef = useRef<HTMLDivElement>(null);
  const rocketInfoSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section id="earth-3d">
          <Earth3D />
        </section>

        <section id="main-viz">
          <MainViz />
        </section>

        <section id="astronaut">
          <Astronaut onContinue={() => setShowEraSelector(true)} />
        </section>

        {/* SHOW ERA SELECTOR ONLY WHEN BUTTON CLICKED */}
        {showEraSelector && (
          <section id="era-selector">
            <EraSelector providerSectionRef={providerSectionRef} />
          </section>
        )}

        {selectedEra && (
          <section id="provider-selector" ref={providerSectionRef}>
            <ProviderSelector rocketSectionRef={rocketSectionRef} />
          </section>
        )}

        {selectedProvider && showRocketSelector && (
          <section id="rocket-selector" ref={rocketSectionRef}>
            <RocketSelector rocketInfoSectionRef={rocketInfoSectionRef} />
          </section>
        )}

        {selectedRocket && (
          <section id="rocket-info" ref={rocketInfoSectionRef}>
            <RocketInfo />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}