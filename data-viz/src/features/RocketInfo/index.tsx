/**
 * RocketInfo component displays detailed information about the currently selected rocket.
 * This component renders specifications, launch history, and visualization placeholders
 * for the rocket selected through the SelectionContext.
 *
 * @module features/RocketInfo
 */

import { useSelection } from "../../contexts/SelectionContext";

/**
 * RocketInfo component displays detailed information about the currently selected rocket.
 * Includes specifications, launch statistics, launch history table, and visual placeholders.
 *
 * @returns JSX element containing rocket details or a prompt to select a rocket
 */
export default function RocketInfo() {
  const { selectedRocket } = useSelection();

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

                <h4 className="text-lg font-medium mb-2">Specifications</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(selectedRocket.specs || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-muted-foreground capitalize">
                          {key}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    )
                  )}
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
