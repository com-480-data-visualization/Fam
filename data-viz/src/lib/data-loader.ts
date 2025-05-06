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



export const providerActors: Record<string, string> = {
  // 1957-1970
  "united-states-air-force": "USA Gov. Agencies",
  "us-navy": "USA Gov. Agencies",

  // 1970-1990
  "national-aeronautics-and-space-administration": "USA Gov. Agencies",
  "institute-of-space-and-astronautical-science": "Japan Gov. Agencies",
  "national-space-development-agency-of-japan": "Japan Gov. Agencies",
  "lockheed-space-operations-company": "USA Gov. Agencies",
  "united-space-alliance": "USA Gov. Agencies",

  // 1990-2010
  "khrunichev-state-research-and-production-space-center": "Russian Gov. Agencies",
  "russian-federal-space-agency-(roscosmos)": "Russian Gov. Agencies",
  "soviet-space-program": "Russian Gov. Agencies",
  "russian-space-forces": "Russian Gov. Agencies",
  "lockheed-martin": "USA Gov. Agencies",
  "production-corporation-polyot": "Russian Gov. Agencies",
  "progress-rocket-space-center": "Russian Gov. Agencies",
  "china-aerospace-science-and-technology-corporation": "China Gov. Agency",

  // 2010-Present
  "russian-aerospace-defence-forces": "Russian Gov. Agencies",
};






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
    const rawProviderId = launch.Provider.toLowerCase().replace(/\s+/g, "-");
    const actorName = providerActors[rawProviderId] || launch.Provider;
    const providerId = actorName.toLowerCase().replace(/\s+/g, "-");

    if (!providerMap.has(actorName)) {
      providerMap.set(actorName, {
        id: providerId,
        name: actorName,
        country: providerCountries[providerId] || "Unknown",
        foundingYear: providerFoundingYears[providerId],
        launchCount: 1,
      });
    } else {
      const provider = providerMap.get(actorName);
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
    
    // USA Gov. Agencies
    {
      id: "thor-slv-2a-agena-d",
      name: "Thor SLV-2A Agena D",
      providerId: "usa-gov.-agencies",
      description:
        "This vehicle combined the Thor intermediate-range ballistic missile with the reliable Agena D upper stage and was used extensively by the USAF and NASA for reconnaissance and scientific missions.",
      specs: { height: "31.0 m", thrust: "1571.0 kN", weight: "67.0 T", diameter :"2.44 m", stages:"3" },
      stats: { totalLaunches: "61", successRate: "0.93", firstLaunch :"1963"},
    },
    {
      id: "atlas-slv-3-agena-d",
      name: "Atlas SLV-3 Agena D",
      providerId: "usa-gov.-agencies",
      description:
        "An evolution of the Atlas ICBM, the SLV-3 variant paired with the Agena D upper stage became a workhorse for launching both classified military satellites and civilian payloads into orbit.",
      specs: { height: "36.0 m", thrust: "1340.0 kN", weight: "155.0 T", diameter :"3.0 m", stages :"3", payloadCapacity:"1000.0 kg" },
      stats: { totalLaunches: "48", successRate: "0.92", firstLaunch :"1964"},
    },
    {
      id: "thor-dm-21-agena-b",
      name: "Thor DM-21 Agena-B",
      providerId: "usa-gov.-agencies",
      description:
        "One of the earliest Thor-Agena combinations, the DM-21 Agena-B launched key early U.S. reconnaissance satellites and laid the groundwork for later, more powerful two-stage launchers.",
      specs: { height: "31.0 m", thrust: "placeholder", weight: "56.5 T", diameter :"2.44 m", stages :"2"},
      stats: { totalLaunches: "40", successRate: "0.80", firstLaunch :"1960"},
    },


    // Russian Gov. Agencies
    {
      id: "voskhod",
      name: "Voskhod",
      providerId: "russian-gov.-agencies",
      description:
        "The Voskhod rocket was a modified version of the R-7 ICBM used by the Soviet Union to launch the first multi-person crewed spacecraft, marking a key step in the space race.",
      specs: { height: "placeholder", thrust: "placeholder", weight: "5.7 T" },
      stats: { totalLaunches: "113", successRate: "0.96", firstLaunch :"1963"},
    },
    {
      id: "kosmos-11k63",
      name: "Kosmos 11K63",
      providerId: "russian-gov.-agencies",
      description:
        "Part of the broader Kosmos family, the 11K63 variant was employed by the USSR to launch military and scientific payloads into low Earth orbit during the Cold War era.",
      specs: { height: "31.0 m", thrust: "placeholder", weight: "48.0 T",diameter:"1.6 m", stages :"2", payloadCapacity:"300.0 kg (LEO)" },
      stats: { totalLaunches: "51", successRate: "0.96", firstLaunch :"1965"},
    },
    {
      id: "vostok-8a92",
      name: "Vostok 8A92",
      providerId: "russian-gov.-agencies",
      description:
        "A launch vehicle derived from the original Vostok design, the 8A92 was instrumental in launching reconnaissance satellites and represented the USSR’s early focus on orbital capability.",
      specs: { height: "30.84 m", thrust: "3996.0 kN", weight: "281.0 T",diameter:"2.99 m", stages :"2", payloadCapacity:"4730.0 kg" },
      stats: { totalLaunches: "44", successRate: "0.90", firstLaunch :"1962"},
    },

  ],

  "early-space-stations": [

        // Arianespace    
    {
      id: "ariane-3",
      name: "Ariane 3",
      providerId: "arianespace",
      description:
        "Ariane 3 was part of Europe's effort to build independent access to space, expanding on previous Ariane designs to support heavier payloads into geostationary transfer orbit.",
      specs: { height: "49.0 m", thrust: "5100.0 kN", weight: "	237.0 T", diameter: "3.8 m", stages: "3", payloadCapacity: "2,650 kg" },
      stats: { totalLaunches: "11", successRate: "0.91", firstLaunch: "1984" }
    },
    {
      id: "ariane-1",
      name: "Ariane 1",
      providerId: "arianespace",
      description:
        "Ariane 1 was Europe's first launcher developed by ESA and CNES, enabling independent access to space for European satellites.",
      specs: { height: "47.4 m", thrust: "2402.0 kN", weight: "210.0 T ", diameter: "3.8 m", stages: "3", payloadCapacity: "1,830 kg" },
      stats: { totalLaunches: "10", successRate: "0.80", firstLaunch: "1980" }
    },
    {
      id: "ariane-2",
      name: "Ariane 2",
      providerId: "arianespace",
      description:
        "Ariane 2 was an upgraded variant of Ariane 1, intended to deliver heavier payloads to geostationary transfer orbit with increased performance.",
      specs: { height: "49.0 m", thrust: "2580.0 kN", weight: "219.0 T", diameter: "3.8 m", stages: "3", payloadCapacity: "2,270 kg" },
      stats: { totalLaunches: "6", successRate: "0.83", firstLaunch: "1986" }
    },
    
    
    // Japan Gov. Agencies
    {
      id: "n-2",
      name: "N-2",
      providerId: "japan-gov.-agencies",
      description:
        "Japan's N-2 rocket was developed with American assistance and based on the Delta family, marking a step toward autonomous launch capabilities.",
      specs: { height: "35.0 m", thrust: "3196.0 kN", weight: "132.7 T", diameter: "2.44 m", stages: "3", payloadCapacity: "2,000 kg (LEO) / 730 kg (GTO)" },
      stats: { totalLaunches: "7", successRate: "1.00", firstLaunch: "1981" }
    },
    {
      id: "n-i",
      name: "N-I",
      providerId: "japan-gov.-agencies",
      description:
        "The N-I was Japan's first orbital launch vehicle based on American Delta rockets, marking the country's entry into orbital launches.",
      specs: { height: "34.0 m", thrust: "1643.0 kN", weight: "131.3 T", diameter: "2.44 m", stages: "3", payloadCapacity: "1,200 kg (LEO) / 360 kg (GTO)" },
      stats: { totalLaunches: "7", successRate: "0.86", firstLaunch: "1975" }
    },
    {
      id: "mu-3c",
      name: "Mu-3C",
      providerId: "japan-gov.-agencies",
      description:
        "Mu-3C was part of the solid-fueled Mu rocket series developed by Japan’s ISAS, used for scientific satellite launches.",
      specs: { height: "20.2 m", thrust: "1932.0 kN", weight: "41.0 T", diameter: "1.41 m", stages: "4", payloadCapacity: "195.0 kg (LEO)" },
      stats: { totalLaunches: "4", successRate: "0.75", firstLaunch: "1974" }
    },


    // Russian Gov. Agencies
    {
      id: "soyuz-u",
      name: "Soyuz U",
      providerId: "russian-gov.-agencies",
      description:
        "Soyuz U was one of the most reliable and longest-serving rockets in history, widely used for launching crewed and uncrewed missions to low Earth orbit.",
      specs: { height: "50.7 m", thrust: "4456.0 kN", weight: " 313.0 T", diameter: "3.0 m", stages: "3 or 4", payloadCapacity: " 6900.0 kg (LEO)" },
      stats: { totalLaunches: "776", successRate: "0.98", firstLaunch: "1973" }
    },
    {
      id: "kosmos-3m",
      name: "Kosmos-3M",
      providerId: "russian-gov.-agencies",
      description:
        "A workhorse of the Soviet space program, Kosmos-3M was a reliable launcher for small military and scientific payloads.",
      specs: { height: "32.4 m", thrust: "1485.0 kN", weight: "109.0 T", diameter: "2.4 m", stages: "2", payloadCapacity: "1,500 kg (LEO) / 775 kg (SSO)" },
      stats: { totalLaunches: "444", successRate: "0.96", firstLaunch: "1967" }
    },
    {
      id: "molniya-m",
      name: "Molniya-M",
      providerId: "russian-gov.-agencies",
      description:
        "The Molniya-M was used to place satellites into highly elliptical orbits, especially for communication and early warning systems.",
      specs: { height: "43.4 m", thrust: "placeholder", weight: "305.0 T", diameter: "2.95 m ", stages: "3", payloadCapacity: "placeholder" },
      stats: { totalLaunches: "297", successRate: "0.93", firstLaunch: "1965" }
    },


    // USA Gov. Agencies
    {
      id: "atlas-slv-3d-centaur",
      name: "Atlas SLV-3D Centaur",
      providerId: "usa-gov.-agencies",
      description:
        "This Atlas configuration was fitted with the Centaur upper stage for high-energy missions, notably interplanetary and geosynchronous satellite deployments.",
      specs: { height: "38.0 m", thrust: "1939.29 kN", weight: "148.4 T", diameter: "3.05 m", stages: "3", payloadCapacity: "1900 kg (GTO)" },
      stats: { totalLaunches: "30", successRate: "0.93", firstLaunch: "1973" }
    },
    {
      id: "delta-2914",
      name: "Delta 2914",
      providerId: "usa-gov.-agencies",
      description:
        "Part of the Delta family, the 2914 configuration supported a variety of missions including weather, navigation, and scientific satellites.",
      specs: { height: "35.0 m", thrust: "2287.50 kN", weight: "130.4 T", diameter: "2.44 m", stages: "4", payloadCapacity: "724 kg (GTO)" },
      stats: { totalLaunches: "30", successRate: "0.93", firstLaunch: "1974" }
    },
    {
      id: "space-shuttle",
      name: "Space Shuttle",
      providerId: "usa-gov.-agencies",
      description:
        "The Space Shuttle was NASA's reusable spacecraft system for crewed missions, deploying satellites, building the ISS, and conducting scientific research.",
      specs: { height: "56.00 m", thrust: "25751.60 kN", weight: "2030.0 T", diameter: "8.7 m", stages: "3", payloadCapacity: "27,500 kg (LEO) / 16,050 kg (ISS) / 4,940 kg (GTO) / 2,270 kg (GEO)" },
      stats: { totalLaunches: "135", successRate: "0.98", firstLaunch: "1981" }
    }

  ],

  "shuttle-era": [
    // ArianeSpace
    {
      id: "ariane-44l",
      name: "Ariane 44L",
      providerId: "arianespace",
      description:
        "The Ariane 44L was a variant of the Ariane 4 family, optimized for launching dual payloads to geostationary transfer orbit with liquid strap-on boosters.",
      specs: { height: "58.40 m", thrust: "5390.10 kN", weight: " 480.0 T", diameter: "3.80 m", stages: "3", payloadCapacity: "4950 kg (GTO)" },
      stats: { totalLaunches: "40", successRate: "0.97", firstLaunch: "1989" }
    },
    {
      id: "ariane-5-eca",
      name: "Ariane 5 ECA",
      providerId: "arianespace",
      description:
        "The Ariane 5 ECA is a heavy-lift launch vehicle designed to carry large payloads to geostationary transfer orbit, often used for commercial satellites.",
      specs: { height: "56 m", thrust: "15510 kN", weight: "780.0 T", diameter: "5.4 m", stages: "2", payloadCapacity: "21000 (LEO) / 10500 (GTO)" },
      stats: { totalLaunches: "23", successRate: "0.95", firstLaunch: "2002" }
    },
    {
      id: "ariane-44lp",
      name: "Ariane 44LP",
      providerId: "arianespace",
      description:
        "Ariane 44LP featured two liquid and two solid strap-on boosters, part of the versatile Ariane 4 family suited for medium to heavy payloads.",
      specs: { height: "58.40 m", thrust: "5250.0 kN", weight: "420.0 T", diameter: "3.80 m", stages: "4", payloadCapacity: "9100 kg (LEO) / 4290 kg (GTO)" },
      stats: { totalLaunches: "26", successRate: "0.96", firstLaunch: "1988" }
    },



    // Russian Gov. Agencies
    {
      id: "soyuz-u",
      name: "Soyuz U",
      providerId: "russian-gov.-agencies",
      description:
        "Soyuz U was one of the most reliable and longest-serving rockets in history, widely used for launching crewed and uncrewed missions to low Earth orbit.",
      specs: { height: "50.7 m", thrust: "4456.0 kN", weight: " 313.0 T", diameter: "3.0 m", stages: "3 or 4", payloadCapacity: " 6900.0 kg (LEO)" },
      stats: { totalLaunches: "776", successRate: "0.98", firstLaunch: "1973" }
    },
    {
      id: "kosmos-3m",
      name: "Kosmos-3M",
      providerId: "russian-gov.-agencies",
      description:
      "Kosmos-3M remained active in the post-Soviet period, launching various military and research satellites into low and medium Earth orbits.",
      specs: { height: "32.4 m", thrust: "1485.0 kN", weight: "109.0 T", diameter: "2.4 m", stages: "2", payloadCapacity: "1,500 kg (LEO) / 775 kg (SSO)" },
      stats: { totalLaunches: "444", successRate: "0.96", firstLaunch: "1967" }
    },
    {
      id: "proton",
      name: "Proton",
      providerId: "russian-gov.-agencies",
      description:
        "The Proton rocket family has served as Russia’s heavy-lift launch system, placing large payloads into orbit including interplanetary missions and modules of the ISS.",
      specs: { height: "57 m", thrust: "10561.85 kN", weight: "690.0 T", diameter: "	4.1 m", stages: "4", payloadCapacity: "21000 kg (LEO) / 3200 kg (GTO)" },
      stats: { totalLaunches: "78", successRate: "0.961538", firstLaunch: "1965" }
    },

    // USA Gov. Agencies
    {
      id: "delta-ii",
      name: "Delta II",
      providerId: "usa-gov.-agencies",
      description:
        "The Delta II rocket was a reliable medium-lift launcher used extensively by NASA for science missions and by the military for GPS satellites.",
      specs: { height: "39 m", thrust: "4822 kN", weight: "213.0 T", diameter: "2.44 m", stages: "3", payloadCapacity: "6100 kg (LEO)" },
      stats: { totalLaunches: "155", successRate: "0.98", firstLaunch: "1989" }
    },
    {
      id: "space-shuttle",
      name: "Space Shuttle",
      providerId: "usa-gov.-agencies",
      description:
        "The Space Shuttle was NASA's reusable spacecraft system for crewed missions, deploying satellites, building the ISS, and conducting scientific research.",
      specs: { height: "56.00 m", thrust: "25751.60 kN", weight: "2030.0 T", diameter: "8.7 m", stages: "3", payloadCapacity: "27,500 kg (LEO) / 16,050 kg (ISS) / 4,940 kg (GTO) / 2,270 kg (GEO)" },
      stats: { totalLaunches: "135", successRate: "0.98", firstLaunch: "1981" }
    },
    {
      id: "atlas-iias",
      name: "Atlas IIAS",
      providerId: "usa-gov.-agencies",
      description:
        "An advanced version of the Atlas II series, the Atlas IIAS added solid rocket boosters to enhance performance for launching communications satellites.",
      specs: { height: "47.54 m", thrust: "3546.30 kN", weight: "204.3 T", diameter: "3.04 m", stages: "2.5", payloadCapacity: "8610 kg (LEO) / 3630 kg (GTO)" },
      stats: { totalLaunches: "30", successRate: "1", firstLaunch: "1993" }
    },
  ],

  "commercial-space": [
    // China Gov. Agency
    {
      id: "long-march-3",
      name: "Long March 3",
      providerId: "china-gov.-agency",
      description:
        "The Long March 3 series continues to serve China's space program, launching satellites to geostationary orbits and supporting lunar missions.",
      specs: { height: "43.25 m", thrust: "2962 kN", weight: "204.0 T", diameter: "	3.35 m", stages: "3", payloadCapacity: "5000 kg (LEO) / 1500 kg (GTO)" },
      stats: { totalLaunches: "95", successRate: "0.95", firstLaunch: "2000" }
    },
    {
      id: "long-march-2d",
      name: "Long March 2D",
      providerId: "china-gov.-agency",
      description:
        "The Long March 2D is a two-stage orbital launch vehicle known for its high reliability, widely used for Earth observation satellite launches.",
      specs: { height: "41.0 m", thrust: "2962 kN", weight: "232.25 T", diameter: "3.35 m", stages: "2", payloadCapacity: "3500 kg (LEO) / 1300 kg (GTO)" },
      stats: { totalLaunches: "97", successRate: "0.99", firstLaunch: "1992" }
    },
    {
      id: "long-march-2",
      name: "Long March 2",
      providerId: "china-gov.-agency",
      description:
        "The Long March 2 family remains an integral part of China's launch strategy, often used for deploying satellites to low and medium Earth orbits.",
      specs: { height: "	39.925 m", thrust: "2962 kN", weight: "232.25 T", diameter: "	3,35 m", stages: "2", payloadCapacity: "3850 kg (LEO) / 1250 kg (GTO)" },
      stats: { totalLaunches: "78", successRate: "0.98", firstLaunch: "1982" }
    },

    // Russian Gov. Agencies
    {
      id: "soyuz-2.1a",
      name: "Soyuz 2.1a",
      providerId: "russian-gov.-agencies",
      description:
        "An upgraded version of the Soyuz rocket family, the 2.1a variant includes digital flight control systems and improved engines.",
      specs: { height: "46.3 m", thrust: " 4148.60 kN", weight: "312.0 T", diameter: "10.3 m", stages: "3 or 4", payloadCapacity: " 7500 kg (LEO)" },
      stats: { totalLaunches: "74", successRate: "0.96", firstLaunch: "2004" }
    },
    //{
    //  id: "soyuz-modern",
    //  name: "Soyuz",
    //  providerId: "russian-gov.-agencies",
    //  description:
    //    "The modern Soyuz variant continues Russia's legacy of dependable access to space, launching payloads for both government and commercial missions.",
    //  specs: { height: "10 m", thrust: "placeholder", weight: "7 T", diameter: "2,65 m", stages: "", payloadCapacity: "placeholder" },
    //  stats: { totalLaunches: "154", successRate: "0.97", firstLaunch: "1967" }
    //},
    {
      id: "soyuz-u",
      name: "Soyuz U",
      providerId: "russian-gov.-agencies",
      description:
      "The Soyuz U rocket remained in service in the early 2010s, primarily supporting ISS resupply missions and satellite deployments.",
      specs: { height: "50.7 m", thrust: "4456.0 kN", weight: " 313.0 T", diameter: "3.0 m", stages: "3 or 4", payloadCapacity: " 6900.0 kg (LEO)" },
      stats: { totalLaunches: "776", successRate: "0.98", firstLaunch: "1973" }
    },



    // SpaceX
    {
      id: "falcon-9",
      name: "Falcon 9",
      providerId: "spacex",
      description:
        "The Falcon 9 is SpaceX's flagship reusable rocket, revolutionizing spaceflight with cost-effective launches for satellites, cargo, and crew.",
      specs: { height: "70 m", thrust: "7561.9 kN", weight: "549.0 T", diameter: "3.7 m", stages: "2", payloadCapacity: "22800 kg (LEO) / 8300 kg (GTO)" },
      stats: { totalLaunches: "467", successRate: "0.9", firstLaunch: "2010" }
    },
    {
      id: "falcon-heavy",
      name: "Falcon Heavy",
      providerId: "spacex",
      description:
        "Falcon Heavy is the world's most powerful operational rocket, designed to carry heavy payloads to a variety of orbits, including interplanetary missions.",
      specs: { height: "70 m", thrust: "22800 kN", weight: "1420.8 T", diameter: "12.2 m", stages: "2", payloadCapacity: "63800 kg (LEO) / 26700 kg (GTO)" },
      stats: { totalLaunches: "19", successRate: "0.84", firstLaunch: "2018" }
    },
    {
      id: "starship-prototype",
      name: "Starship Prototype",
      providerId: "spacex",
      description:
        "Starship prototypes are early iterations of SpaceX's next-generation fully reusable launch system, aimed at deep space missions and Mars colonization.",
      specs: { height: "123 m", thrust: "76000 kN", weight: "4800 T", diameter: "9 m", stages: "2", payloadCapacity: "200000 kg" },
      stats: { totalLaunches: "9", successRate: "0.666667", firstLaunch: "2019" }
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
