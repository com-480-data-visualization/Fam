import { useRef } from "react";
import { Provider } from "../../types";

interface HorizontalBarChartProps {
  providers: Provider[];
  selectedProvider?: Provider | null;
  onProviderSelect: (provider: Provider) => void;
}

export default function HorizontalBarChart({
  providers,
  selectedProvider,
  onProviderSelect,
}: HorizontalBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const topProviders: Provider[] = [];
  let othersLaunchCount = 0;

  const sortedProviders = [...providers].sort(
    (a, b) => (b.launchCount || 0) - (a.launchCount || 0)
  );

  sortedProviders.forEach((provider, index) => {
    if (index < 4) {
      topProviders.push(provider);
    } else {
      othersLaunchCount += provider.launchCount || 0;
    }
  });

  if (sortedProviders.length > 4) {
    topProviders.push({
      id: "others",
      name: "Others",
      launchCount: othersLaunchCount,
      country: "Various",
    });
  }

  const maxLaunchCount =
    topProviders.length > 0
      ? Math.max(...topProviders.map((p) => p.launchCount || 0))
      : 0;

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-2">Launch Count by Provider</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Click on a bar to select a provider
      </p>

      <div className="space-y-4" ref={chartRef}>
        {topProviders.map((provider) => {
          const barWidth =
            maxLaunchCount > 0
              ? `${((provider.launchCount || 0) / maxLaunchCount) * 100}%`
              : "0%";
          const isSelected = selectedProvider?.id === provider.id;

          return (
            <div
              key={provider.id}
              onClick={() =>
                provider.id !== "others" && onProviderSelect(provider)
              }
              className={`
                cursor-pointer transition-all duration-200
                ${provider.id !== "others" ? "hover:opacity-90" : ""}
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
