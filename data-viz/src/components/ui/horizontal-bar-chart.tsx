/**
 * Horizontal bar chart component for visualizing launch provider data.
 *
 * This component renders a horizontal bar chart showing the launch counts
 * for different rocket launch providers, with interactive selection capabilities.
 *
 * @module components/ui/horizontal-bar-chart
 */
import { useRef } from "react";
import { Provider } from "../../types";
import { historicalProvidersByEra } from "../../lib/data-loader"; // adjust path if needed

/**
 * Props for the HorizontalBarChart component.
 *
 * @interface HorizontalBarChartProps
 */
interface HorizontalBarChartProps {
  /** Array of provider data to display in the chart */
  providers: Provider[];
  /** Currently selected provider (if any) */
  selectedProvider?: Provider | null;
  /** Callback function triggered when a provider is selected */
  onProviderSelect: (provider: Provider) => void;
  /** Callback function triggered when a provider is hovered */
  onProviderHover?: (provider: Provider) => void;
  /** Callback function triggered when hover leaves a provider */
  onProviderHoverLeave?: () => void;
  /*Era*/
  era: string; // 👈 Add this
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

/**
 * Renders a horizontal bar chart showing launch counts by provider.
 *
 * This component:
 * - Shows the top 4 providers with highest launch counts
 * - Groups remaining providers into an "Others" category
 * - Provides interactive selection of providers
 * - Highlights the currently selected provider
 *
 * @param {HorizontalBarChartProps} props - Component properties
 * @returns {JSX.Element} Rendered horizontal bar chart component
 */
export default function HorizontalBarChart({
  providers,
  selectedProvider,
  onProviderSelect,
  onProviderHover,
  onProviderHoverLeave,
  era,
}: HorizontalBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);



  // Initialize arrays and counters for data processing
  const topProviders: Provider[] = [];
  let othersLaunchCount = 0;

  // Sort providers by launch count (descending)
  const sortedProviders = [...providers].sort(
    (a, b) => (b.launchCount || 0) - (a.launchCount || 0)
  );


  const totalLaunches = sortedProviders.reduce((sum, p) => sum + (p.launchCount || 0), 0);

  // Step 3: Include providers up to treshold of total, group others
  const threshold = getThresholdForEra(era ?? "default")

  let accumulated = 0;
  for (const provider of sortedProviders) {
    if (accumulated / totalLaunches < threshold) {
      topProviders.push(provider);
      accumulated += provider.launchCount || 0;
    } else {
      othersLaunchCount += provider.launchCount || 0;
    }
  }

  if (othersLaunchCount > 0) {
    const othersData = historicalProvidersByEra[era]?.["others"];
    topProviders.push({
      ...othersData,
    id: "others", // Ensure this stays consistent
    launchCount: othersLaunchCount, // ✅ override only the count
  });
  }




  // Calculate maximum launch count for scaling bars
  const maxLaunchCount =
    topProviders.length > 0
      ? Math.max(...topProviders.map((p) => p.launchCount || 0))
      : 0;


  return (
    <div className="bg-card p-6 rounded-lg mb-8">
      <h3 className="text-xl font-semibold mb-2">Launch Count by Provider</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Click on a bar to select a provider
      </p>

      <div className="space-y-4" ref={chartRef}>
        {topProviders.map((provider, index) => {
          const barWidth =
            maxLaunchCount > 0
              ? `${((provider.launchCount || 0) / maxLaunchCount) * 100}%`
              : "0%";
          const isSelected = selectedProvider?.id === provider.id;

          return (
            <div
              key={provider.id}
              onClick={() =>
                 index < 3 && onProviderSelect(provider) // Can change by provider.id !== "others"
              }
              onMouseEnter={() =>
                onProviderHover?.(provider)
              }
              onMouseLeave={() =>
                onProviderHoverLeave?.()
              }/*
              className={`
                cursor-pointer transition-all duration-200
                ${provider.id !== "others" ? "hover:opacity-90" : ""}
                ${isSelected ? "opacity-100" : "opacity-80"}
              `}*/
              className={`
                transition-all duration-200
                ${index < 3 ? "cursor-pointer hover:opacity-90" : "cursor-default"}
                ${isSelected ? "opacity-100" : "opacity-80"}
              `}

            >
              <div className="flex justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-primary font-semibold" : ""
                  }`}
                >
                  {provider.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {provider.launchCount} launches
                </span>
              </div>
              <div
                className={`
                h-8 w-full bg-muted rounded-sm overflow-hidden
                ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
              `}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isSelected ? "bg-primary" : "bg-primary/70"
                  } ${provider.id === "others" ? "bg-gray-400" : ""}`}
                  style={{ width: barWidth }}
                  aria-label={`${provider.name}: ${provider.launchCount} launches`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
