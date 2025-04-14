import { Launch } from "../../../types";
import { Launchpad } from "./types";

export function processLaunchData(
  launchData: Launch[]
): Record<string, Launchpad> {
  const launchpadCounts: Record<string, Launchpad> = {};

  launchData.forEach((launch) => {
    if (launch.lat !== null && launch.lon !== null) {
      const key = launch.LaunchPad;
      if (!launchpadCounts[key]) {
        launchpadCounts[key] = {
          key,
          name: launch.LaunchPad,
          lat: launch.lat,
          lon: launch.lon,
          count: 0,
          launches: [],
          statuses: {},
          primaryStatus: "default",
        };
      }
      launchpadCounts[key].count += 1;
      launchpadCounts[key].launches.push(launch);

      if (!launchpadCounts[key].statuses[launch.Status]) {
        launchpadCounts[key].statuses[launch.Status] = 0;
      }
      launchpadCounts[key].statuses[launch.Status]++;
    }
  });

  Object.values(launchpadCounts).forEach((launchpad) => {
    let maxCount = 0;
    let primaryStatus = "default";

    Object.entries(launchpad.statuses).forEach(([status, count]) => {
      if (count > maxCount) {
        maxCount = count;
        primaryStatus = status;
      }
    });

    launchpad.primaryStatus = primaryStatus;
  });

  return launchpadCounts;
}
