import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Provider } from "../../types";
import HorizontalBarChart from "../../components/ui/horizontal-bar-chart";
import { fetchLaunchData, extractProviders } from "../../lib/data-loader";

interface ProviderSelectorProps {
  rocketSectionRef: RefObject<HTMLDivElement | null>;
}

/*

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
        const filteredLaunches = selectedEra
          ? launches.filter(
              (launch) =>
                launch.year >= parseInt(selectedEra.startDate) &&
                launch.year <= parseInt(selectedEra.endDate)
            )
          : launches;

        const providers = extractProviders(filteredLaunches);
        setProviders(providers);
      } catch (error) {
        console.error("Error loading provider data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedEra]);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowRocketSelector(false);
    setSelectedRocket(null);

    // Scroll down to the description box
    setTimeout(() => {
      const descriptionBox = document.getElementById("provider-description");
      if (descriptionBox) {
        descriptionBox.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Delay to ensure the state is updated first
  };

  const handleContinueClick = () => {
    if (!selectedProvider) return;

    setShowRocketSelector(true);

    setTimeout(() => {
      rocketSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="min-h-screen bg-background/5 text-foreground py-12 px-6">
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
            />

            {selectedProvider && (
              <div
                id="provider-description"
                className="bg-card p-6 rounded-lg shadow-md space-y-4 mt-12 mb-12" // Added mb-12 for more space after description box
              >
                <h3 className="text-xl font-semibold">
                  {selectedProvider.descriptionTitle}
                </h3>
                <p className="text-base text-muted-foreground whitespace-pre-line">
                  {selectedProvider.description}
                </p>
                <p className="text-sm italic text-muted-foreground">
                  {selectedProvider.question}
                </p>
                <div className="flex flex-col items-center mt-4 space-y-2">
                  <button
                    className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                    onClick={handleContinueClick}
                  >
                    Continue to Rocket Selection
                  </button>
                </div>
              </div>
            )}

            {!selectedProvider && (
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <p className="text-muted-foreground">
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

*/

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
        const filteredLaunches = selectedEra
          ? launches.filter(
              (launch) =>
                launch.year >= parseInt(selectedEra.startDate) &&
                launch.year <= parseInt(selectedEra.endDate)
            )
          : launches;

        const providers = extractProviders(filteredLaunches);
        setProviders(providers);
      } catch (error) {
        console.error("Error loading provider data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedEra]);

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