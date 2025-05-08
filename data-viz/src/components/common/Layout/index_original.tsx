/**
 * Main layout component that structures the application.
 *
 * This component provides the overall page structure and conditionally renders
 * different sections based on the user's current selection state.
 * The component follows a progressive disclosure pattern where:
 * 1. Main visualization is always shown
 * 2. Era selector is always shown
 * 3. Provider selector is shown only when an era is selected
 * 4. Rocket selector is shown only when a provider is selected
 * 5. Rocket info is shown only when a rocket is selected
 *
 * @module components/common/Layout
 */
import { useRef } from "react";
import { useSelection } from "../../../contexts/SelectionContext";

import MainViz from "../../../features/MainViz";
import EraSelector from "../../../features/EraSelector";
import ProviderSelector from "../../../features/ProviderSelector";
import RocketSelector from "../../../features/RocketSelector";
import RocketInfo from "../../../features/RocketInfo";
import Footer from "../../../features/Footer";

/**
 * Layout component that provides the main application structure.
 *
 * This component manages section references for smooth scrolling and
 * conditionally renders components based on the current selection state.
 *
 * @returns {JSX.Element} The structured application layout
 */
export default function Layout() {
  const { selectedEra, selectedProvider, selectedRocket } = useSelection();

  // References for scroll behavior
  const providerSectionRef = useRef<HTMLDivElement>(null);
  const rocketSectionRef = useRef<HTMLDivElement>(null);
  const rocketInfoSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section id="main-viz">
          <MainViz />
        </section>

        <section id="era-selector">
          <EraSelector providerSectionRef={providerSectionRef} />
        </section>

        {selectedEra && (
          <section id="provider-selector" ref={providerSectionRef}>
            <ProviderSelector rocketSectionRef={rocketSectionRef} />
          </section>
        )}

        {selectedProvider && (
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
