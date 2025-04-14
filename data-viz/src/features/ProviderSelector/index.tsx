import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Provider } from "../../types";
import HorizontalBarChart from "../../components/ui/horizontal-bar-chart";
import { fetchLaunchData, extractProviders } from "../../lib/data-loader";

interface ProviderSelectorProps {
  rocketSectionRef: RefObject<HTMLDivElement | null>;
}

export default function ProviderSelector({
  rocketSectionRef,
}: ProviderSelectorProps) {
  const { selectedProvider, setSelectedProvider, selectedEra } = useSelection();
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

    setTimeout(() => {
      if (rocketSectionRef.current) {
        rocketSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section className="min-h-screen bg-background/5 text-foreground py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Select Launch Provider</h2>

        {loading ? (
          <div className="text-center p-12 bg-card rounded-lg shadow-md">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading provider data...</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <HorizontalBarChart
              providers={providers}
              selectedProvider={selectedProvider}
              onProviderSelect={handleProviderClick}
            />

            {!selectedProvider && (
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <p className="text-muted-foreground">
                  Select a provider from the chart above to continue
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
