import { useSelection } from "../../contexts/SelectionContext";
import { useEffect, useState, useMemo } from "react";
import {
  fetchLaunchData,
  filterLaunchesByRocket,
  isLaunchSuccessful,
} from "../../lib/data-loader";
import {
  PayloadCapacityIcon,
  getSpecIcon,
} from "../../components/ui/icons/SpecIcons";
import SuccessFailureDonut from "../../components/ui/SuccessFailureDonut";

import RocketLaunchLineChart from "../../components/ui/RocketLaunchLineChart";

// Load dynamically
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

export default function RocketInfo() {
  const { selectedRocket } = useSelection();
  const [launchData, setLaunchData] = useState<
    { year: number; count: number; successRate?: number }[]
  >([]);
  const [_, setTotalLaunches] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  const imageUrl = useMemo(
    () => (selectedRocket ? getRocketImageUrl(selectedRocket.id) : null),
    [selectedRocket]
  );

  useEffect(() => {
    const loadLaunchData = async () => {
      const allLaunches = await fetchLaunchData();
      const rocketLaunches = filterLaunchesByRocket(
        allLaunches,
        selectedRocket?.id || ""
      );

      // Calculate successes and failures
      const successes = rocketLaunches.filter(isLaunchSuccessful).length;
      const failures = rocketLaunches.length - successes;

      setSuccessCount(successes);
      setFailureCount(failures);

      // Aggregate data by year with success rate
      const aggregatedData = aggregateLaunchesByYear(rocketLaunches);
      setLaunchData(aggregatedData);

      // Total launches
      setTotalLaunches(rocketLaunches.length);
    };

    if (selectedRocket) {
      loadLaunchData();
    }
  }, [selectedRocket]);

  const aggregateLaunchesByYear = (launches: any[]) => {
    const yearData: Record<number, { count: number; successes: number }> = {};

    launches.forEach((launch) => {
      const year = launch.year;
      const isSuccess = isLaunchSuccessful(launch);

      if (!yearData[year]) {
        yearData[year] = { count: 0, successes: 0 };
      }

      yearData[year].count += 1;
      if (isSuccess) {
        yearData[year].successes += 1;
      }
    });

    return Object.entries(yearData)
      .map(([year, data]) => ({
        year: Number(year),
        count: data.count,
        successRate: data.count > 0 ? (data.successes / data.count) * 100 : 0,
      }))
      .sort((a, b) => a.year - b.year);
  };

  const specOrder = ["height", "diameter", "weight", "thrust", "stages"];

  return (
    <section
      id="rocket-info"
      className="min-h-screen bg-background/5 text-foreground py-8 px-4"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center lg:text-left">
          Rocket Details
        </h2>

        {selectedRocket ? (
          <div className="bg-card p-4 rounded-lg shadow-md flex flex-col">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* LEFT: Rocket Image */}
              <div className="w-full lg:w-1/4 flex items-center justify-center lg:items-start">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={selectedRocket.name}
                    className="max-h-96 lg:max-h-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground italic flex items-center justify-center h-40 w-full">
                    No image available
                  </div>
                )}
              </div>
              {/* RIGHT: Rocket Info */}
              <div className="w-full lg:w-3/4 flex flex-col mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h3 className="text-2xl font-semibold">
                    {selectedRocket.name}
                  </h3>
                  {selectedRocket.stats?.firstLaunch && (
                    <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
                      First Launch:{" "}
                      <span className="font-medium">
                        {String(selectedRocket.stats.firstLaunch)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-left">
                  {selectedRocket.description}
                </p>
                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-12 md:col-span-2">
                    <h4 className="text-base text-left text-lg font-semibold mb-4">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-1 gap-y-3 mb-3">
                      {selectedRocket.specs &&
                        specOrder.map((key) => {
                          if (!selectedRocket.specs) return null;
                          const value = selectedRocket.specs[key];
                          if (!value) return null;
                          const IconComponent = getSpecIcon(key);
                          return (
                            <div
                              key={key}
                              className="flex items-center text-left"
                            >
                              {IconComponent && (
                                <div className="mr-2 text-muted-foreground">
                                  <IconComponent size={12} />
                                </div>
                              )}
                              <div>
                                <div className="text-xs text-muted-foreground leading-none mb-1 capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </div>
                                <div className="text-sm font-medium leading-tight">
                                  {String(value)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {selectedRocket.specs?.payloadCapacity && (
                      <div>
                        <div className="flex items-center text-left mb-1">
                          <div className="mr-2 text-muted-foreground">
                            <PayloadCapacityIcon size={12} />
                          </div>
                          <div className="text-xs text-muted-foreground leading-tight">
                            Payload Capacity
                          </div>
                        </div>
                        <div className="pl-5">
                          {typeof selectedRocket.specs.payloadCapacity ===
                          "string"
                            ? selectedRocket.specs.payloadCapacity
                                .split("\n")
                                .map((line, i) => {
                                  const orbitMatch =
                                    line.match(/(.*?)\s*\((.*)\)/);
                                  const capacity = orbitMatch
                                    ? orbitMatch[1].trim()
                                    : line.trim();
                                  const orbitType = orbitMatch
                                    ? orbitMatch[2].trim()
                                    : "";
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-baseline"
                                    >
                                      <span className="text-sm font-medium whitespace-nowrap leading-tight">
                                        {capacity}
                                      </span>
                                      {orbitType && (
                                        <span className="text-xs text-muted-foreground ml-1 whitespace-nowrap leading-tight">
                                          ({orbitType})
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                            : Object.entries(
                                selectedRocket.specs.payloadCapacity
                              ).map(([orbit, capacityValue]) => (
                                <div
                                  key={orbit}
                                  className="flex items-baseline"
                                >
                                  <span className="text-sm font-medium whitespace-nowrap leading-tight">
                                    {String(capacityValue)}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-1 whitespace-nowrap leading-tight">
                                    ({orbit.toUpperCase()})
                                  </span>
                                </div>
                              ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Launch Chart + Donut */}
                  <div className="col-span-12 md:col-span-7 flex items-center">
                    <RocketLaunchLineChart data={launchData} />
                  </div>
                  <div className="col-span-12 md:col-span-2 flex items-center">
                    <SuccessFailureDonut
                      success={successCount}
                      failure={failureCount}
                      size={85}
                      strokeWidth={7}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-card rounded-lg shadow-md">
            <p className="text-lg text-muted-foreground">
              Please select a rocket to view detailed information.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
