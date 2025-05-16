import { useRef } from "react";
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
  const { selectedEra, selectedProvider, selectedRocket, showRocketSelector } =
    useSelection();

  // Refs for scroll behavior
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
          <Astronaut />
        </section>

        <section id="era-selector">
          <EraSelector providerSectionRef={providerSectionRef} />
        </section>

        {/* Only show Provider Selector when an era is selected */}
        {selectedEra && (
          <section id="provider-selector" ref={providerSectionRef}>
            <ProviderSelector rocketSectionRef={rocketSectionRef} />
          </section>
        )}

        {/* Only show Rocket Selector when a provider is selected AND showRocketSelector is true */}
        {selectedProvider && showRocketSelector && (
          <section id="rocket-selector" ref={rocketSectionRef}>
            <RocketSelector rocketInfoSectionRef={rocketInfoSectionRef} />
          </section>
        )}

        {/* Only show Rocket Info when a rocket is selected */}
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
