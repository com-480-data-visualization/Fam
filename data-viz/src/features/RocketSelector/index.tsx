import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Rocket } from "../../types";
import { historicalRocketsByEra } from "../../lib/data-loader";

interface RocketSelectorProps {
  rocketInfoSectionRef: RefObject<HTMLDivElement | null>;
}

export default function RocketSelector({
  rocketInfoSectionRef,
}: RocketSelectorProps) {
  const { selectedRocket, setSelectedRocket, selectedProvider, selectedEra } =
    useSelection();
  const [availableRockets, setAvailableRockets] = useState<Rocket[]>([]);

  useEffect(() => {
    if (selectedRocket && selectedRocket.providerId !== selectedProvider?.id) {
      setSelectedRocket(null);
    }

    if (selectedEra && selectedProvider) {
      const eraId = selectedEra.id;
      const providerId = selectedProvider.id;

      const eraRockets = historicalRocketsByEra[eraId] || [];

      const providerRockets = eraRockets.filter(
        (rocket) => rocket.providerId === providerId
      );

      setAvailableRockets(providerRockets);
    } else {
      setAvailableRockets([]);
    }
  }, [selectedProvider, selectedEra, selectedRocket, setSelectedRocket]);

  const handleRocketClick = (rocket: Rocket) => {
    setSelectedRocket(rocket);

    setTimeout(() => {
      if (rocketInfoSectionRef.current) {
        rocketInfoSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Select Rocket</h2>

        {selectedProvider ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
                    <span className="text-muted-foreground">
                      Rocket Image Placeholder
                    </span>
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
