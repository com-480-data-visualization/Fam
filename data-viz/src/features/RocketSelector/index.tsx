/**
 * Rocket selection component for the space launch visualization.
 *
 * This component displays available rockets for the selected provider and era,
 * and allows users to select a specific rocket to see detailed information.
 *
 * @module features/RocketSelector
 */
import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Rocket } from "../../types";
import { historicalRocketsByEra } from "../../lib/data-loader";

/**
 * Props for the RocketSelector component.
 *
 * @interface RocketSelectorProps
 */
interface RocketSelectorProps {
  /** Reference to the rocket info section for smooth scrolling after selection */
  rocketInfoSectionRef: RefObject<HTMLDivElement | null>;
}

const rocketImages = import.meta.glob("../../assets/*.png", {
  eager: true,
  as: "url",
});

function getRocketImageUrl(rocketId: string): string | null {
  const entry = Object.entries(rocketImages).find(([path]) =>
    path.includes(`/${rocketId}.png`)
  );
  return entry?.[1] || null;
}

/**
 * Component that displays rockets and allows user selection.
 *
 * This component:
 * - Filters available rockets based on the selected era and provider
 * - Displays rockets in a grid with basic information
 * - Allows selection of a specific rocket
 * - Scrolls to the rocket info section when a rocket is selected
 *
 * @param {RocketSelectorProps} props - Component properties
 * @returns {JSX.Element} Rendered rocket selector component
 */
export default function RocketSelector({
  rocketInfoSectionRef,
}: RocketSelectorProps) {
  const { selectedRocket, setSelectedRocket, selectedProvider, selectedEra } =
    useSelection();
  const [availableRockets, setAvailableRockets] = useState<Rocket[]>([]);

  // Update available rockets when provider or era changes
  useEffect(() => {
    // Reset rocket selection if provider changes
    if (selectedRocket && selectedRocket.providerId !== selectedProvider?.id) {
      setSelectedRocket(null);
    }

    if (selectedEra && selectedProvider) {
      const eraId = selectedEra.id;
      const providerId = selectedProvider.id;

      // Get rockets for the selected era
      const eraRockets = historicalRocketsByEra[eraId] || [];

      // Filter to rockets from the selected provider
      const providerRockets = eraRockets.filter(
        (rocket) => rocket.providerId === providerId
      );

      setAvailableRockets(providerRockets);
    } else {
      setAvailableRockets([]);
    }
  }, [selectedProvider, selectedEra, selectedRocket, setSelectedRocket]);

  /**
   * Handles the selection of a rocket
   *
   * @param {Rocket} rocket - The selected rocket
   */
  const handleRocketClick = (rocket: Rocket) => {
    setSelectedRocket(rocket);

    // Scroll to the rocket info section after a small delay to ensure rendering
    setTimeout(() => {
      if (rocketInfoSectionRef.current) {
        rocketInfoSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  /*
  return (
    <section className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Select Rocket</h2>

        {selectedProvider ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
              {availableRockets.map((rocket) => (
                <div
                  key={rocket.id}
                  onClick={() => handleRocketClick(rocket)}
                  className={`
                    bg-card p-6 rounded-lg shadow-md cursor-pointer transition-all
                    ${
                      selectedRocket?.id === rocket.id
                        ? "ring-2 ring-primary"
                        : "hover:shadow-lg"
                    }
                  `}
                >
                  <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
                    {getRocketImageUrl(rocket.id) ? (
                      <img
                        src={getRocketImageUrl(rocket.id)!}
                        alt={rocket.name}
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <span className="text-muted-foreground">No Image</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{rocket.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {rocket.description}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Height: {rocket.specs?.height}</span>
                    <span>Weight: {rocket.specs?.weight}</span>
                  </div>
                </div>
              ))}
            </div>

            {availableRockets.length === 0 && (
              <div className="text-center p-12 bg-card rounded-lg shadow-md">
                <p className="text-lg text-muted-foreground">
                  No rockets found for {selectedProvider.name} in the{" "}
                  {selectedEra?.name || "selected"} era.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-12 bg-card rounded-lg shadow-md">
            <p className="text-lg text-muted-foreground">
              Please select a provider first to view available rockets.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

*/

  /* Removed height weight and description : */

  return (
    <section className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Select Rocket</h2>

        {selectedProvider ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
              {availableRockets.map((rocket) => (
                <div
                  key={rocket.id}
                  onClick={() => handleRocketClick(rocket)}
                  className={`
                  bg-card p-6 rounded-lg shadow-md cursor-pointer transition-all
                  ${
                    selectedRocket?.id === rocket.id
                      ? "ring-2 ring-primary"
                      : "hover:shadow-lg"
                  }
                `}
                >
                  <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
                    {getRocketImageUrl(rocket.id) ? (
                      <img
                        src={getRocketImageUrl(rocket.id)!}
                        alt={rocket.name}
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <span className="text-muted-foreground">No Image</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{rocket.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ))}
            </div>

            {availableRockets.length === 0 && (
              <div className="text-center p-12 bg-card rounded-lg shadow-md">
                <p className="text-lg text-muted-foreground">
                  No rockets found for {selectedProvider.name} in the{" "}
                  {selectedEra?.name || "selected"} era.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-12 bg-card rounded-lg shadow-md">
            <p className="text-lg text-muted-foreground">
              Please select a provider first to view available rockets.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
