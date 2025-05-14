import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Provider } from "../../types";
import HorizontalBarChart from "../../components/ui/horizontal-bar-chart";
import { fetchLaunchData, extractProviders } from "../../lib/data-loader";

interface ProviderSelectorProps {
  rocketSectionRef: RefObject<HTMLDivElement | null>;
}


const getThresholdForEra = (era: string) => {
  switch (era) {
    case "space-race":
      return 0.97;
    case "early-space-stations":
      return 0.97;
    case "shuttle-era":
      return 0.8;
    case "commercial-space":
      return 0.8;
    default:
      return 0.8;
  }
};


export default function ProviderSelector({
  rocketSectionRef,
}: ProviderSelectorProps) {
  const {
    selectedProvider,
    setSelectedProvider,
    selectedEra,
    setSelectedRocket,
    setShowRocketSelector,
  } = useSelection();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const launches = await fetchLaunchData();

        // Filter launches based on the selected era
        const filteredLaunches = selectedEra
          ? launches.filter(
              (launch) =>
                launch.year >= parseInt(selectedEra.startDate) &&
                launch.year <= parseInt(selectedEra.endDate)
            )
          : launches;

        // Pass era to extractProviders to get providers within that era
        const providers = extractProviders(filteredLaunches, selectedEra?.id || "default");
        setProviders(providers);
      } catch (error) {
        console.error("Error loading provider data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedEra]); // Re-run when selectedEra changes

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowRocketSelector(false);
    setSelectedRocket(null);

    setTimeout(() => {
      const descriptionBox = document.getElementById("provider-description");
      if (descriptionBox) {
        descriptionBox.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleContinueClick = () => {
    if (!selectedProvider) return;

    setShowRocketSelector(true);

    setTimeout(() => {
      rocketSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Select Launch Provider</h2>

        {loading ? (
          <div className="text-center p-12 bg-card rounded-lg shadow-md">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-lg">Loading provider data...</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <HorizontalBarChart
              providers={providers}
              selectedProvider={selectedProvider}
              onProviderSelect={handleProviderClick}
              percentageThreshold={getThresholdForEra(selectedEra?.id ?? "default")}
            />
            
            {selectedProvider ? (
              <div
                id="provider-description"
                className="bg-card p-6 rounded-lg shadow-md space-y-4 mt-12 mb-12"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {selectedProvider.name}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {selectedProvider.foundingYear
                    ? `Founded: ${selectedProvider.foundingYear}`
                    : null}
                </p>
                <p className="font-bold mb-2">
                  {selectedProvider.descriptionTitle}
                </p>
                <p>{selectedProvider.description}</p>
                <p className="font-bold italic mt-4">
                  {selectedProvider.question}
                </p>

                <div className="flex justify-center mt-6">
                  <button
                    className="px-8 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                    onClick={handleContinueClick}
                  >
                    Continue to Rocket Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <p className="text-muted-foreground italic">
                  Select a provider from the chart above to see its description
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}