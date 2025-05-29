/**
 * Timeline Context for managing time-related state and data.
 *
 * This context provides functionality for:
 * - Navigation through historical launch data using a timeline
 * - Managing playback controls for animating through time periods
 * - Filtering launch data based on selected time periods
 * - Loading and organizing rocket launch data
 * - Controlling animation speed and timeline scale (year/month)
 *
 * @module contexts/TimelineContext
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Launch } from "../types";

/**
 * Timeline view mode type
 * - 'month': Shows data by individual months
 * - 'year': Aggregates data by entire years
 */
export type TimelineViewMode = "month" | "year";

/**
 * Interface defining available properties and methods in the TimelineContext.
 *
 * @interface TimelineContextType
 */
interface TimelineContextType {
  /** Current timeline position expressed as absolute month count */
  currentMonthIndex: number;
  /** Current year in the timeline */
  currentYear: number;
  /** Current month in the timeline (1-12) */
  currentMonth: number;
  /** Whether the timeline animation is currently playing */
  isPlaying: boolean;
  /** Current playback speed multiplier */
  playbackSpeed: number;
  /** Current timeline view mode (month or year) */
  viewMode: TimelineViewMode;
  /** Complete dataset of all available launch data */
  allLaunchData: Launch[];
  /** Filtered dataset showing only launches from the current month/year */
  currentMonthLaunches: Launch[];
  /** Filtered dataset showing launches aggregated by year */
  currentYearLaunches: Launch[];
  /** Whether data is currently being loaded */
  isLoading: boolean;
  /** Minimum month index for the timeline (earliest available data) */
  minMonthIndex: number;
  /** Maximum month index for the timeline (latest available data) */
  maxMonthIndex: number;
  /** Sets the current position in the timeline using month index */
  setMonthIndex: (monthIndex: number) => void;
  /** Toggles the playback state between playing and paused */
  togglePlayback: () => void;
  /** Sets the animation speed multiplier */
  setPlaybackSpeed: (speed: number) => void;
  /** Sets the timeline view mode (month or year) */
  setViewMode: (mode: TimelineViewMode) => void;
  /** Resets the timeline to the beginning */
  resetTimeline: () => void;
  /** Formats the current time as a display string (e.g., "Oct 1957" or "1957" based on view mode) */
  formatTimeDisplay: () => string;
  /** Gets the total number of months in the timeline */
  totalMonthCount: number;
}

// Constants for timeline boundaries and default values
// Default playback interval in milliseconds
const DEFAULT_MONTHLY_PLAYBACK_SPEED = 300;
const DEFAULT_YEARLY_PLAYBACK_SPEED = 600; // Slower playback for yearly view

// Initial values for timeline boundaries (used before data is loaded)
const INITIAL_MIN_YEAR = 1957; // First Space Age year (Sputnik)
const INITIAL_MIN_MONTH = 10; // October (Sputnik launch)

/**
 * Calculate the absolute month index from year and month
 * @param year The year (e.g. 1957)
 * @param month The month (1-12)
 * @param baseYear The base year to calculate from
 * @param baseMonth The base month to calculate from
 * @returns The absolute month count since baseYear/baseMonth
 */
function calculateMonthIndex(
  year: number,
  month: number,
  baseYear: number,
  baseMonth: number
): number {
  const yearDiff = year - baseYear;
  const monthDiff = month - baseMonth;
  return yearDiff * 12 + monthDiff;
}

/**
 * Calculate the year and month from an absolute month index
 * @param monthIndex The absolute month count since baseYear/baseMonth
 * @param baseYear The base year to calculate from
 * @param baseMonth The base month to calculate from
 * @returns An object with year and month properties
 */
function calculateYearAndMonth(
  monthIndex: number,
  baseYear: number,
  baseMonth: number
): {
  year: number;
  month: number;
} {
  const totalMonths = monthIndex + (baseMonth - 1);
  const yearOffset = Math.floor(totalMonths / 12);
  let monthValue = (totalMonths % 12) + 1;

  if (monthValue === 0) {
    monthValue = 12;
  }

  return {
    year: baseYear + yearOffset,
    month: monthValue,
  };
}

/**
 * React Context for timeline state management
 */
const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

/**
 * Provider component for the TimelineContext.
 *
 * Manages the timeline state, data loading, and animation functionality
 * for navigating through rocket launch history.
 *
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to the context
 * @returns {JSX.Element} The provider component
 */
export function TimelineProvider({ children }: { children: ReactNode }) {
  // Use refs for timeline boundary values - they don't change after initialization
  const minYearRef = useRef<number>(INITIAL_MIN_YEAR);
  const minMonthRef = useRef<number>(INITIAL_MIN_MONTH);
  const minMonthIndexRef = useRef<number>(0);
  const maxMonthIndexRef = useRef<number>(0);
  const totalMonthCountRef = useRef<number>(0);

  // Initialize at the minimum month index
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    minMonthIndexRef.current
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<TimelineViewMode>("month");
  const [allLaunchData, setAllLaunchData] = useState<Launch[]>([]);
  const [launchesByYearMonth, setLaunchesByYearMonth] = useState<
    Record<number, Launch[]>
  >({});
  const [launchesByYear, setLaunchesByYear] = useState<
    Record<number, Launch[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Calculate year and month from currentMonthIndex
  const { year: currentYear, month: currentMonth } = calculateYearAndMonth(
    currentMonthIndex,
    minYearRef.current,
    minMonthRef.current
  );

  /**
   * Sets the current position in the timeline using month index
   */
  const handleSetMonthIndex = (monthIndex: number): void => {
    const boundedIndex = Math.max(
      minMonthIndexRef.current,
      Math.min(monthIndex, maxMonthIndexRef.current)
    );
    setCurrentMonthIndex(boundedIndex);
  };

  /**
   * Formats the current timeline position as a human-readable string
   * based on current view mode
   * @returns {string} Formatted date string (e.g., "Oct 1957" or "1957")
   */
  const formatTimeDisplay = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return viewMode === "month"
      ? `${monthNames[currentMonth - 1]} ${currentYear}`
      : `${currentYear}`;
  };

  // Load launch data on component mount
  useEffect(() => {
    async function loadLaunchData() {
      try {
        setIsLoading(true);
        const response = await fetch("/processed_rocket_launches.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch launch data: ${response.status}`);
        }
        const data: Launch[] = await response.json();
        setAllLaunchData(data);

        // Organize launches by year and month for efficient filtering
        const byYearMonth: Record<number, Launch[]> = {};
        const byYear: Record<number, Launch[]> = {};

        data.forEach((launch) => {
          if (!launch.datetime_iso) return;

          const date = new Date(launch.datetime_iso);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const timeValue = year * 100 + month;

          // Group by year-month
          if (!byYearMonth[timeValue]) {
            byYearMonth[timeValue] = [];
          }
          byYearMonth[timeValue].push(launch);

          // Group by year
          if (!byYear[year]) {
            byYear[year] = [];
          }
          byYear[year].push(launch);
        });
        setLaunchesByYearMonth(byYearMonth);
        setLaunchesByYear(byYear);

        // Find both the earliest and latest launch dates to set timeline boundaries
        let earliestYear = 3000; // Set to a future date to ensure it gets updated
        let earliestMonth = 12;
        let latestYear = 1000; // Set to a past date to ensure it gets updated
        let latestMonth = 1;

        data.forEach((launch) => {
          if (launch.datetime_iso) {
            const date = new Date(launch.datetime_iso);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            // Update earliest date if this launch is older
            if (
              year < earliestYear ||
              (year === earliestYear && month < earliestMonth)
            ) {
              earliestYear = year;
              earliestMonth = month;
            }

            // Update latest date if this launch is more recent
            if (
              year > latestYear ||
              (year === latestYear && month > latestMonth)
            ) {
              latestYear = year;
              latestMonth = month;
            }
          }
        });

        // Update the refs with the calculated bounds - we only need to do this once
        minYearRef.current = earliestYear;
        minMonthRef.current = earliestMonth;
        minMonthIndexRef.current = 0; // Always start at 0 for relative indexing

        // Calculate the maximum timeline index based on the data
        const calculatedMaxMonthIndex = calculateMonthIndex(
          latestYear,
          latestMonth,
          earliestYear,
          earliestMonth
        );

        maxMonthIndexRef.current = calculatedMaxMonthIndex;
        totalMonthCountRef.current = calculatedMaxMonthIndex + 1;

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading rocket launch data:", error);
        setIsLoading(false);
      }
    }

    loadLaunchData();
  }, []);

  // Handle timeline animation playback
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    // Calculate the actual interval based on playback speed and view mode
    const basePlaybackSpeed =
      viewMode === "month"
        ? DEFAULT_MONTHLY_PLAYBACK_SPEED
        : DEFAULT_YEARLY_PLAYBACK_SPEED;

    const interval = basePlaybackSpeed / playbackSpeed;

    animationRef.current = setInterval(() => {
      setCurrentMonthIndex((prevIndex) => {
        let nextIndex = prevIndex;

        // Advance based on view mode
        if (viewMode === "month") {
          // In month view, advance by 1 month
          nextIndex += 1;
        } else {
          // In year view, advance by 12 months (1 year)
          nextIndex += 12;
        }

        // Stop playback if we reach the end
        if (nextIndex > maxMonthIndexRef.current) {
          clearInterval(animationRef.current);
          setIsPlaying(false);
          return prevIndex;
        }

        return nextIndex;
      });
    }, interval);

    // Clean up interval on unmount or when playback state changes
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, viewMode]);

  // Current time value in YYYYMM format for data lookup
  const timeValue = currentYear * 100 + currentMonth;

  // Get relevant launches for the current time
  const currentMonthLaunches = launchesByYearMonth[timeValue] || [];
  const currentYearLaunches = launchesByYear[currentYear] || [];

  // Get the appropriate launches based on view mode
  const displayLaunches =
    viewMode === "month" ? currentMonthLaunches : currentYearLaunches;

  /**
   * Toggles playback state between playing and paused
   */
  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  /**
   * Resets the timeline to the beginning
   */
  const resetTimeline = () => {
    setIsPlaying(false);
    setCurrentMonthIndex(minMonthIndexRef.current);
  };

  /**
   * Updates the timeline view mode
   * @param {TimelineViewMode} mode - New view mode ('month' or 'year')
   */
  const handleSetViewMode = (mode: TimelineViewMode) => {
    setViewMode(mode);
  };

  return (
    <TimelineContext.Provider
      value={{
        currentMonthIndex,
        currentYear,
        currentMonth,
        isPlaying,
        playbackSpeed,
        viewMode,
        allLaunchData,
        currentMonthLaunches: displayLaunches,
        currentYearLaunches,
        isLoading,
        minMonthIndex: minMonthIndexRef.current,
        maxMonthIndex: maxMonthIndexRef.current,
        setMonthIndex: handleSetMonthIndex,
        togglePlayback,
        setPlaybackSpeed,
        setViewMode: handleSetViewMode,
        resetTimeline,
        formatTimeDisplay,
        totalMonthCount: totalMonthCountRef.current,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

/**
 * Custom hook for accessing the TimelineContext.
 *
 * @example
 * ```tsx
 * const { currentYear, isPlaying, togglePlayback } = useTimeline();
 * ```
 *
 * @returns {TimelineContextType} The timeline context value
 * @throws {Error} If used outside of a TimelineProvider
 */
export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
