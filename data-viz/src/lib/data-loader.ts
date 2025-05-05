/**
 * Data loading and processing utilities for rocket launch data.
 *
 * This file contains functions for:
 * - Fetching launch data from JSON sources
 * - Extracting and organizing provider information from launch data
 * - Extracting and organizing rocket information from launch data
 * - Managing historical eras and their associated rockets
 * - Filtering launch data based on various criteria
 *
 * @module lib/data-loader
 */
import { Launch, Provider, Rocket, Era } from "../types";

/**
 * Fetches rocket launch data from the provided JSON file.
 *
 * @async
 * @returns {Promise<Launch[]>} Promise resolving to an array of launch data
 * @throws {Error} If the data cannot be fetched or parsed
 */
export async function fetchLaunchData(): Promise<Launch[]> {
  try {
    const response = await fetch("/processed_rocket_launches.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch launch data: ${response.status}`);
    }
    const data: Launch[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading launch data:", error);
    return [];
  }
}

/**
 * Extracts and organizes provider information from launch data.
 *
 * This function:
 * 1. Groups launches by provider
 * 2. Counts launches per provider
 * 3. Adds additional metadata like country and founding year
 *
 * @param {Launch[]} launches - The source launch data
 * @returns {Provider[]} Array of unique providers with metadata
 */
export function extractProviders(launches: Launch[]): Provider[] {
  const providerMap = new Map<string, Provider>();

  // Provider founding years from historical data
  const providerFoundingYears: Record<string, number> = {
    nasa: 1958,
    roscosmos: 1992,
    spacex: 2002,
    esa: 1975,
    "european-space-agency": 1975,
    cnsa: 1993,
    "china-national-space-administration": 1993,
    "soviet-space-program": 1955,
    jaxa: 2003,
    isro: 1969,
    "rocket-lab": 2006,
    "blue-origin": 2000,
    arianespace: 1980,
    ula: 2006,
    "united-launch-alliance": 2006,
  };

  // Provider country mappings
  const providerCountries: Record<string, string> = {
    nasa: "USA",
    spacex: "USA",
    ula: "USA",
    "united-launch-alliance": "USA",
    "blue-origin": "USA",
    "rocket-lab": "USA/New Zealand",
    roscosmos: "Russia",
    "soviet-space-program": "USSR",
    esa: "Europe",
    "european-space-agency": "Europe",
    arianespace: "Europe",
    cnsa: "China",
    "china-national-space-administration": "China",
    isro: "India",
    jaxa: "Japan",
  };

  launches.forEach((launch) => {
    const providerId = launch.Provider.toLowerCase().replace(/\s+/g, "-");

    if (!providerMap.has(providerId)) {
      providerMap.set(providerId, {
        id: providerId,
        name: launch.Provider,
        country: providerCountries[providerId] || "Unknown",
        foundingYear: providerFoundingYears[providerId],
        launchCount: 1,
      });
    } else {
      const provider = providerMap.get(providerId);
      if (provider) {
        provider.launchCount = (provider.launchCount || 0) + 1;
      }
    }
  });

  return Array.from(providerMap.values());
}

/**
 * Extracts and organizes rocket information from launch data.
 *
 * @param {Launch[]} launches - The source launch data
 * @returns {Rocket[]} Array of unique rockets with metadata
 */
export function extractRockets(launches: Launch[]): Rocket[] {
  const rocketMap = new Map<string, Rocket>();

  launches.forEach((launch) => {
    const rocketId = launch.Rocket.toLowerCase().replace(/\s+/g, "-");
    const providerId = launch.Provider.toLowerCase().replace(/\s+/g, "-");

    if (!rocketMap.has(rocketId)) {
      rocketMap.set(rocketId, {
        id: rocketId,
        name: launch.Rocket,
        providerId: providerId,
      });
    }
  });

  return Array.from(rocketMap.values());
}

/**
 * Provides predefined historical eras for space exploration.
 *
 * @returns {Era[]} Array of historical era definitions
 */
export function getHistoricalEras(): Era[] {
  return [
    {
      id: "space-race",
      name: "Space Race",
      startDate: "1957",
      endDate: "1969",
      description:
        "The period of competition between the US and USSR in space exploration, from Sputnik to Apollo 11.",
    },
    {
      id: "early-space-stations",
      name: "Early Space Station Era",
      startDate: "1970",
      endDate: "1989",
      description:
        "Period marked by the first space stations like Skylab and Mir, and increasing international cooperation.",
    },
    {
      id: "shuttle-era",
      name: "Shuttle Era",
      startDate: "1990",
      endDate: "2011",
      description:
        "The Space Shuttle program dominated human spaceflight during this period, enabling deployment of Hubble and construction of ISS.",
    },
    {
      id: "commercial-space",
      name: "Commercial Space Era",
      startDate: "2012",
      endDate: "2023",
      description:
        "Rise of private companies in space exploration and commercialization, with SpaceX, Blue Origin, and others leading innovation.",
    },
  ];
}

// Historical data mapping rockets to their respective eras
export const historicalRocketsByEra: Record<string, Rocket[]> = {
  "space-race": [
    // United States Air Force
    {
      id: "thor-delta",
      name: "Thor-Delta",
      providerId: "united-states-air-force",
      description:
        "First orbital launch vehicle derived from the Thor IRBM missile",
      specs: { height: "34.5m", thrust: "760 kN", weight: "50,000 kg" },
    },
    {
      id: "atlas-d",
      name: "Atlas-D",
      providerId: "united-states-air-force",
      description:
        "First ICBM developed by the United States, later adapted for orbital launches",
      specs: { height: "23m", thrust: "1,600 kN", weight: "120,000 kg" },
    },

    // Soviet Space Program
    {
      id: "vostok-k",
      name: "Vostok-K",
      providerId: "soviet-space-program",
      description:
        "Launch vehicle used for the first human spaceflight (Yuri Gagarin)",
      specs: { height: "38m", thrust: "3,900 kN", weight: "287,000 kg" },
    },
    {
      id: "sputnik-8k74ps",
      name: "Sputnik 8K74PS",
      providerId: "soviet-space-program",
      description:
        "Modified R-7 rocket used to launch Sputnik 1, the first artificial satellite",
      specs: { height: "29.5m", thrust: "3,900 kN", weight: "267,000 kg" },
    },

    // NASA
    {
      id: "saturn-v",
      name: "Saturn V",
      providerId: "national-aeronautics-and-space-administration",
      description:
        "Super heavy-lift vehicle used by NASA for the Apollo program",
      specs: { height: "110.6m", thrust: "34,020 kN", weight: "2,970,000 kg" },
    },
    {
      id: "saturn-ib",
      name: "Saturn IB",
      providerId: "national-aeronautics-and-space-administration",
      description:
        "Used for Earth orbit Apollo testing and later Skylab missions",
      specs: { height: "68.3m", thrust: "7,100 kN", weight: "598,500 kg" },
    },

    // US Navy
    {
      id: "vanguard",
      name: "Vanguard",
      providerId: "us-navy",
      description: "One of the first American satellites launch vehicles",
      specs: { height: "23m", thrust: "120 kN", weight: "10,050 kg" },
    },
  ],

  "early-space-stations": [
    // Soviet Space Program
    {
      id: "proton-k",
      name: "Proton-K",
      providerId: "soviet-space-program",
      description:
        "Heavy-lift launch vehicle used for Salyut and Mir space stations",
      specs: { height: "44.3m", thrust: "8,600 kN", weight: "700,000 kg" },
    },
    {
      id: "soyuz-u",
      name: "Soyuz-U",
      providerId: "soviet-space-program",
      description: "Most frequently used variant of the Soyuz family",
      specs: { height: "49.3m", thrust: "4,020 kN", weight: "313,000 kg" },
    },

    // United States Air Force
    {
      id: "titan-iii",
      name: "Titan III",
      providerId: "united-states-air-force",
      description: "Modified ICBM used for heavy satellite launches",
      specs: { height: "47.3m", thrust: "10,200 kN", weight: "680,000 kg" },
    },
    {
      id: "atlas-centaur",
      name: "Atlas-Centaur",
      providerId: "united-states-air-force",
      description: "First US rocket to use liquid hydrogen as fuel",
      specs: { height: "35m", thrust: "3,340 kN", weight: "148,500 kg" },
    },

    // Arianespace
    {
      id: "ariane-1",
      name: "Ariane 1",
      providerId: "arianespace",
      description:
        "First rocket in the Ariane family, developed for European space independence",
      specs: { height: "50m", thrust: "2,460 kN", weight: "207,200 kg" },
    },
    {
      id: "ariane-3",
      name: "Ariane 3",
      providerId: "arianespace",
      description:
        "Improved version of the Ariane 2, with larger strap-on boosters",
      specs: { height: "49m", thrust: "3,460 kN", weight: "237,000 kg" },
    },

    // NASA
    {
      id: "space-shuttle",
      name: "Space Shuttle",
      providerId: "national-aeronautics-and-space-administration",
      description: "First partially reusable orbital spacecraft system",
      specs: { height: "56.1m", thrust: "30,160 kN", weight: "2,030,000 kg" },
    },
  ],

  "shuttle-era": [
    // Russian Federal Space Agency (ROSCOSMOS)
    {
      id: "soyuz-fg",
      name: "Soyuz-FG",
      providerId: "russian-federal-space-agency-roscosmos",
      description:
        "Used for crewed launches to the International Space Station",
      specs: { height: "49.5m", thrust: "4,146 kN", weight: "308,000 kg" },
    },
    {
      id: "proton-m",
      name: "Proton-M",
      providerId: "russian-federal-space-agency-(roscosmos)",
      description:
        "Heavy-lift launch vehicle used primarily for commercial and Russian government launches",
      specs: { height: "58.2m", thrust: "9,600 kN", weight: "705,000 kg" },
    },

    // United States Air Force
    {
      id: "delta-ii",
      name: "Delta II",
      providerId: "united-states-air-force",
      description:
        "Medium-lift launch vehicle used for GPS constellation and Mars missions",
      specs: { height: "38m", thrust: "3,480 kN", weight: "231,870 kg" },
    },
    {
      id: "titan-iv",
      name: "Titan IV",
      providerId: "united-states-air-force",
      description:
        "Heavy-lift launch vehicle primarily used for military and classified payloads",
      specs: { height: "62m", thrust: "15,600 kN", weight: "943,050 kg" },
    },

    // Arianespace
    {
      id: "ariane-4",
      name: "Ariane 4",
      providerId: "arianespace",
      description:
        "Highly successful commercial launcher with many configurations",
      specs: { height: "58.4m", thrust: "5,240 kN", weight: "490,000 kg" },
    },
    {
      id: "ariane-5",
      name: "Ariane 5",
      providerId: "arianespace",
      description:
        "European heavy-lift launch vehicle, used for ESA and commercial launches",
      specs: { height: "53m", thrust: "11,400 kN", weight: "777,000 kg" },
    },

    // Khrunichev State Research and Production Space Center
    {
      id: "rokot",
      name: "Rokot",
      providerId: "khrunichev-state-research-and-production-space-center",
      description: "Small-capacity launcher based on the UR-100N ICBM",
      specs: { height: "29m", thrust: "2,100 kN", weight: "107,000 kg" },
    },
    {
      id: "angara-a5",
      name: "Angara A5",
      providerId: "khrunichev-state-research-and-production-space-center",
      description:
        "Heavy-lift launch vehicle designed to replace the Proton rocket",
      specs: { height: "42.7m", thrust: "9,600 kN", weight: "773,000 kg" },
    },
  ],

  "commercial-space": [
    // China Aerospace Science and Technology Corporation
    {
      id: "long-march-5",
      name: "Long March 5",
      providerId: "china-aerospace-science-and-technology-corporation",
      description:
        "Chinese heavy-lift system used for space station and lunar missions",
      specs: { height: "57m", thrust: "10,620 kN", weight: "869,000 kg" },
    },
    {
      id: "long-march-7",
      name: "Long March 7",
      providerId: "china-aerospace-science-and-technology-corporation",
      description:
        "Medium-heavy lift vehicle designed for China's future space station resupply",
      specs: { height: "53.1m", thrust: "7,200 kN", weight: "595,000 kg" },
    },

    // SpaceX
    {
      id: "falcon-9",
      name: "Falcon 9",
      providerId: "spacex",
      description: "Partially reusable medium-lift launch vehicle",
      specs: { height: "70m", thrust: "7,607 kN", weight: "549,054 kg" },
    },
    {
      id: "falcon-heavy",
      name: "Falcon Heavy",
      providerId: "spacex",
      description:
        "Partially reusable heavy-lift launch vehicle, derived from Falcon 9",
      specs: { height: "70m", thrust: "22,819 kN", weight: "1,420,788 kg" },
    },

    // Arianespace
    {
      id: "ariane-6",
      name: "Ariane 6",
      providerId: "arianespace",
      description: "New generation European heavy-lift launch vehicle",
      specs: { height: "63m", thrust: "15,000 kN", weight: "860,000 kg" },
    },
    {
      id: "vega",
      name: "Vega",
      providerId: "arianespace",
      description:
        "Small-lift launch vehicle for smaller payloads and polar orbits",
      specs: { height: "30m", thrust: "2,261 kN", weight: "137,000 kg" },
    },

    // Russian Federal Space Agency (ROSCOSMOS)
    {
      id: "soyuz-2.1a",
      name: "Soyuz 2.1a",
      providerId: "russian-federal-space-agency-(roscosmos)",
      description:
        "Modernized version of the Soyuz rocket with improved control systems",
      specs: { height: "46.3m", thrust: "4,140 kN", weight: "312,000 kg" },
    },
    {
      id: "soyuz-2.1b-fregat-m",
      name: "Soyuz 2.1b/Fregat-M",
      providerId: "russian-federal-space-agency-(roscosmos)",
      description:
        "Enhanced version of Soyuz 2.1 featuring the Fregat upper stage for precise orbital insertions",
      specs: { height: "46.3m", thrust: "4,150 kN", weight: "313,000 kg" },
    },
  ],
};

/**
 * Filters launches to a specific date range.
 *
 * @param {Launch[]} launches - The launches to filter
 * @param {number} startYear - Start year (inclusive)
 * @param {number} endYear - End year (inclusive)
 * @returns {Launch[]} Filtered launches within the specified years
 */
export function filterLaunchesByYear(
  launches: Launch[],
  startYear: number,
  endYear: number
): Launch[] {
  return launches.filter(
    (launch) => launch.year >= startYear && launch.year <= endYear
  );
}

/**
 * Filters launches to a specific provider.
 *
 * @param {Launch[]} launches - The launches to filter
 * @param {string} providerId - Provider ID to filter by
 * @returns {Launch[]} Launches from the specified provider
 */
export function filterLaunchesByProvider(
  launches: Launch[],
  providerId: string
): Launch[] {
  const normalizedProviderId = providerId.toLowerCase().replace(/\s+/g, "-");
  return launches.filter(
    (launch) =>
      launch.Provider.toLowerCase().replace(/\s+/g, "-") ===
      normalizedProviderId
  );
}

/**
 * Filters launches to a specific rocket.
 *
 * @param {Launch[]} launches - The launches to filter
 * @param {string} rocketId - Rocket ID to filter by
 * @returns {Launch[]} Launches of the specified rocket
 */
export function filterLaunchesByRocket(
  launches: Launch[],
  rocketId: string
): Launch[] {
  const normalizedRocketId = rocketId.toLowerCase().replace(/\s+/g, "-");
  return launches.filter(
    (launch) =>
      launch.Rocket.toLowerCase().replace(/\s+/g, "-") === normalizedRocketId
  );
}
