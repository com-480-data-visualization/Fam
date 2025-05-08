/**
 * Provider selection component for space launch data visualization.
 *
 * This component displays available launch providers for the selected era
 * and allows users to select a provider to view more detailed data.
 *
 * @module features/ProviderSelector
 */
import { RefObject, useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Provider } from "../../types";
import HorizontalBarChart from "../../components/ui/horizontal-bar-chart";
import { fetchLaunchData, extractProviders } from "../../lib/data-loader";

/**
 * Props for the ProviderSelector component.
 *
 * @interface ProviderSelectorProps
 */
interface ProviderSelectorProps {
  /** Reference to the rocket section for smooth scrolling after selection */
  rocketSectionRef: RefObject<HTMLDivElement | null>;
}





/**
 * Component that displays launch providers and allows user selection.
 *
 * This component:
 * - Fetches and filters launch data based on the selected era
 * - Extracts provider information from the launch data
 * - Displays providers in a horizontal bar chart
 * - Allows selection of a provider
 * - Scrolls to the rocket section when a provider is selected
 *
 * @param {ProviderSelectorProps} props - Component properties
 * @returns {JSX.Element} Rendered provider selector component
 */
export default function ProviderSelector({
  rocketSectionRef,
}: ProviderSelectorProps) {
  const { selectedProvider, setSelectedProvider, selectedEra } = useSelection();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  // Load provider data when the selected era changes
  useEffect(() => {
    /**
     * Fetches launch data and extracts provider information
     */
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

  /**
   * Handles the selection of a provider
   *
   * @param {Provider} provider - The selected provider
   */
  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);

    // Scroll to the rocket section after a small delay to ensure rendering
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
