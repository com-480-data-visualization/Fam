import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Provider } from "../../types";
import ProviderBarChart from "../../components/ui/ProviderBarChart";
import { fetchLaunchData, extractProviders } from "../../lib/data-loader";

interface ProviderSelectorProps {
  rocketSectionRef: RefObject<HTMLDivElement | null>;
}

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
  const [hoveredProvider, setHoveredProvider] = useState<Provider | null>(null);

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
        const providers = extractProviders(
          filteredLaunches,
          selectedEra?.id || "default"
        );
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
    setShowRocketSelector(true);
    setSelectedRocket(null);

    setTimeout(() => {
      rocketSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const displayedProvider = hoveredProvider || selectedProvider;

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
          <div className="w-full mx-auto mt-12 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
              {/* Right: Horizontal Bar Chart */}
              <div className="md:w-1/2">
                <ProviderBarChart
                  providers={providers}
                  selectedProvider={selectedProvider}
                  onProviderSelect={handleProviderClick}
                  onProviderHover={setHoveredProvider}
                  onProviderHoverLeave={() => setHoveredProvider(null)}
                  era={selectedEra?.id ?? "default"}
                />
              </div>
              {/* Left: Description */}
              <div className="md:w-1/2 space-y-4 mt-6">
                {displayedProvider ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2">
                      {displayedProvider.name}
                    </h3>
                    {displayedProvider.foundingYear && (
                      <p className="text-muted-foreground mb-2">
                        Founded: {displayedProvider.foundingYear}
                      </p>
                    )}
                    <p className="font-bold mb-2">
                      {displayedProvider.descriptionTitle}
                    </p>
                    <p className="text-left sm:text-justify max-w-xl mx-auto text-sm sm:text-base">
                      {displayedProvider.description}
                    </p>
                    <p className="font-bold italic mt-4">
                      {displayedProvider.question}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic mt-6">
                    Hover over a provider to see its description
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
