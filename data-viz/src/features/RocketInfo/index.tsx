/**
 * RocketInfo component displays detailed information about the currently selected rocket.
 * This component renders specifications, launch history, and visualization placeholders
 * for the rocket selected through the SelectionContext.
 *
 * @module features/RocketInfo
 */

import { useSelection } from "../../contexts/SelectionContext";
import { useMemo } from "react";

// Load rocket images dynamically
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
 * RocketInfo component displays detailed information about the currently selected rocket.
 * Includes specifications, launch statistics, launch history table, and visual placeholders.
 *
 * @returns JSX element containing rocket details or a prompt to select a rocket
 */


/*
export default function RocketInfo() {
  const { selectedRocket } = useSelection();

  const imageUrl = useMemo(
    () => (selectedRocket ? getRocketImageUrl(selectedRocket.id) : null),
    [selectedRocket]
  );

  const launchCount = selectedRocket ? Math.floor(Math.random() * 50) + 5 : 0;
  const successRate = selectedRocket ? Math.floor(Math.random() * 20) + 80 : 0;

  return (
    <section
      id="rocket-info"
      className="min-h-screen bg-background/5 text-foreground py-12 px-6"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Rocket Details</h2>

        {selectedRocket ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-card p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold mb-4">
                  {selectedRocket.name}
                </h3>
                <p className="mb-6">{selectedRocket.description}</p>

                <h4 className="text-lg font-medium mb-4">Specifications</h4>
                <div className="grid grid-cols-3 gap-6 items-start mb-6">
  
                  <div className="space-y-4">
                    {Object.entries(selectedRocket.specs || {})
                      .filter((_, idx, arr) => idx < arr.length / 2)
                      .map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-xs text-muted-foreground capitalize">{key}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                  </div>


                  <div className="flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={selectedRocket.name}
                        className="max-h-72 object-contain"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground italic text-center">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {Object.entries(selectedRocket.specs || {})
                      .filter((_, idx, arr) => idx >= arr.length / 2)
                      .map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-xs text-muted-foreground capitalize">{key}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Total Launches
                    </span>
                    <span className="text-xl font-bold">{launchCount}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Success Rate
                    </span>
                    <span className="text-xl font-bold">{successRate}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      First Launch
                    </span>
                    <span className="text-xl font-bold">
                      {2000 + Math.floor(Math.random() * 20)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4">Launch History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-4 text-sm text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left py-2 px-4 text-sm text-muted-foreground">
                          Mission
                        </th>
                        <th className="text-left py-2 px-4 text-sm text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="py-2 px-4">
                            2023-{Math.floor(Math.random() * 12) + 1}-
                            {Math.floor(Math.random() * 28) + 1}
                          </td>
                          <td className="py-2 px-4">Example Mission {i}</td>
                          <td className="py-2 px-4">
                            <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                              Success
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

    
            <div>
              <div className="bg-card rounded-lg shadow-md mb-6 h-[400px] flex items-center justify-center">
                <span className="text-muted-foreground">
                  Interactive 3D Rocket Model Placeholder
                </span>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4">Launch Statistics</h4>
                <div className="h-[200px] bg-muted rounded flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">
                    Launch Statistics Chart Placeholder
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This rocket has completed {launchCount} missions since its
                  first launch, with a success rate of {successRate}%. The
                  visualization above shows launches by year and outcome.
                </p>
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

*/



export default function RocketInfo() {
  const { selectedRocket } = useSelection();

  const imageUrl = useMemo(
    () => (selectedRocket ? getRocketImageUrl(selectedRocket.id) : null),
    [selectedRocket]
  );

  const launchCount = selectedRocket ? Math.floor(Math.random() * 50) + 5 : 0;
  const successRate = selectedRocket ? Math.floor(Math.random() * 20) + 80 : 0;
  const firstLaunchYear = 2000 + Math.floor(Math.random() * 20);

  return (
    <section
      id="rocket-info"
      className="min-h-screen bg-background/5 text-foreground py-12 px-6"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Rocket Details</h2>

        {selectedRocket ? (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              {/* LEFT: Rocket Image */}
              <div className="w-full lg:w-[28%]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={selectedRocket.name}
                    className="w-full h-auto object-contain rounded"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    No image available
                  </div>
                )}
              </div>

              {/* RIGHT: Rocket Info */}
              <div className="w-full lg:w-[72%] text-left">
                <h3 className="text-2xl font-semibold mb-4">{selectedRocket.name}</h3>
                <p className="mb-6">{selectedRocket.description}</p>

                <h4 className="text-lg font-medium mb-4">Specifications</h4>

                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  {/* Specs */}
                  <div className="flex-1 space-y-4">
                    {Object.entries(selectedRocket.specs || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-muted-foreground capitalize">
                          {key}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="w-full md:w-1/3 space-y-6 ml-2">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        First Launch
                      </span>
                      <span className="text-xl font-bold">{firstLaunchYear}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Total Launches
                      </span>
                      <span className="text-xl font-bold">{launchCount}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Success Rate
                      </span>
                      <span className="text-xl font-bold">{successRate}%</span>
                    </div>
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