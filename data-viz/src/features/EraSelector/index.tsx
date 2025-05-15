/**
 * Era selection component for the space exploration timeline.
 *
 * This component allows users to select a historical era of space exploration,
 * which then filters the available data throughout the application.
 *
 * @module features/EraSelector
 */
import { RefObject, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Era } from "../../types";
import { getHistoricalEras } from "../../lib/data-loader";

const mockEras: Era[] = getHistoricalEras();

/**
 * Props for the EraSelector component.
 *
 * @interface EraSelectorProps
 */
interface EraSelectorProps {
  /** Reference to the provider section for smooth scrolling after selection */
  providerSectionRef: RefObject<HTMLDivElement | null>;
}

/**
 * Component that displays a timeline of historical space eras and allows user selection.
 *
 * This component:
 * - Shows all available eras as clickable elements on a timeline with descriptions
 * - Highlights the currently selected era
 * - Scrolls to the provider section when an era is selected
 *
 * @param {EraSelectorProps} props - Component properties
 * @returns {JSX.Element} Rendered era selector component
 */
export default function EraSelector({ providerSectionRef }: EraSelectorProps) {
  const { selectedEra, setSelectedEra } = useSelection();
  const [hoveredEra, setHoveredEra] = useState<Era | null>(null);
  const { setSelectedProvider } = useSelection();

  /**
   * Handles a click on an era element
   *
   * @param {Era} era - The era that was clicked
   */
  const handleEraClick = (era: Era) => {
    setSelectedEra(era);
    setSelectedProvider(null); // <-- Reset selected provider here

    // Scroll to the provider section after a small delay to ensure rendering
    /*setTimeout(() => {
      if (providerSectionRef.current) {
        providerSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start"  });
      }
    }, 100);*/
    setTimeout(() => {
      if (providerSectionRef.current) {
        const top = providerSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
        const offset = 0; // or adjust if needed later

        window.scrollTo({
          top: top + offset,
          behavior: "smooth",
        });
      }
    }, 100);

  };

  // Display either the hovered era's description or the selected era's description
  const displayedEra = hoveredEra || selectedEra;

  return (
    <section
      id="era-selector"
      className="min-h-screen bg-background text-foreground py-12 px-6"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Choose Your Era</h2>

        <div className="w-full bg-card rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            {mockEras.map((era) => (
              <div
                key={era.id}
                onClick={() => handleEraClick(era)}
                onMouseEnter={() => setHoveredEra(era)}
                onMouseLeave={() => setHoveredEra(null)}
                className={`
                  flex flex-col justify-between items-center cursor-pointer px-4 py-2
                  transition-all duration-200 ease-in-out
                  ${
                    selectedEra?.id === era.id || hoveredEra?.id === era.id
                      ? "text-primary scale-110"
                      : "text-muted-foreground"
                  }
                `}
              >
                <span className="text-sm font-semibold">{era.name}</span>
                <div className="w-3 h-3 rounded-full bg-current mt-2"></div>
                <span className="text-xs mt-1">
                  {era.startDate}-{era.endDate}
                </span>
              </div>
            ))}
          </div>

          {/* Description area */}
          <div className="p-4 bg-card/50 rounded-md border border-muted min-h-[100px] transition-all duration-300 ease-in-out">
            {displayedEra ? (
              <>
                <h3 className="text-xl font-semibold mb-2">
                  {displayedEra.name}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {displayedEra.startDate} - {displayedEra.endDate}
                </p>
              
                <p className="font-bold mb-2">
                  {displayedEra.descriptionTitle}  
                </p>

                <p>{displayedEra.description}</p>

                <p className="font-bold italic mt-4">
                  {displayedEra.question}
                </p>

              </>
            ) : (
              <p className="text-muted-foreground italic text-center">
                Hover over an era to see its description
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
