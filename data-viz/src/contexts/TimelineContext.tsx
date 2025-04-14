import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Launch } from "../types";

interface TimelineContextType {
  currentTimeValue: number;
  currentYear: number;
  currentMonth: number;
  isPlaying: boolean;
  playbackSpeed: number;
  allLaunchData: Launch[];
  currentMonthLaunches: Launch[];
  isLoading: boolean;
  minTimeValue: number;
  maxTimeValue: number;
  setTimeValue: (timeValue: number) => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: number) => void;
  resetTimeline: () => void;
  formatTimeDisplay: () => string;
}

const MIN_YEAR = 1957;
const MIN_MONTH = 10;
const MAX_YEAR = 2025;
const MAX_MONTH = 5;
const MIN_TIME_VALUE = MIN_YEAR * 100 + MIN_MONTH;
const MAX_TIME_VALUE = MAX_YEAR * 100 + MAX_MONTH;
const DEFAULT_PLAYBACK_SPEED = 300;

const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

function normalizeTimeValue(timeValue: number): number {
  let year = Math.floor(timeValue / 100);
  let month = timeValue % 100;

  if (month < 1) {
    month = 1;
  } else if (month > 12) {
    month = 12;
    if (timeValue % 100 > 12) {
      year += 1;
      month = 1;
    }
  }

  if (year < MIN_YEAR || (year === MIN_YEAR && month < MIN_MONTH)) {
    year = MIN_YEAR;
    month = MIN_MONTH;
  }

  if (year > MAX_YEAR || (year === MAX_YEAR && month > MAX_MONTH)) {
    year = MAX_YEAR;
    month = MAX_MONTH;
  }

  return year * 100 + month;
}

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [currentTimeValue, setCurrentTimeValue] = useState(MIN_TIME_VALUE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [allLaunchData, setAllLaunchData] = useState<Launch[]>([]);
  const [launchesByYearMonth, setLaunchesByYearMonth] = useState<
    Record<number, Launch[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const normalizedTimeValue = normalizeTimeValue(currentTimeValue);
  const currentYear = Math.floor(normalizedTimeValue / 100);
  const currentMonth = normalizedTimeValue % 100;

  useEffect(() => {
    if (currentTimeValue !== normalizedTimeValue) {
      setCurrentTimeValue(normalizedTimeValue);
    }
  }, [currentTimeValue, normalizedTimeValue]);

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
    return `${monthNames[currentMonth - 1]} ${currentYear}`;
  };

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

        const byYearMonth: Record<number, Launch[]> = {};
        data.forEach((launch) => {
          if (!launch.datetime_iso) return;

          const date = new Date(launch.datetime_iso);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const timeValue = year * 100 + month;

          if (!byYearMonth[timeValue]) {
            byYearMonth[timeValue] = [];
          }
          byYearMonth[timeValue].push(launch);
        });
        setLaunchesByYearMonth(byYearMonth);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading rocket launch data:", error);
        setIsLoading(false);
      }
    }

    loadLaunchData();
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    animationRef.current = setInterval(() => {
      setCurrentTimeValue((prevTimeValue) => {
        let nextMonth = (prevTimeValue % 100) + 1;
        let nextYear = Math.floor(prevTimeValue / 100);

        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear += 1;
        }

        const nextTimeValue = nextYear * 100 + nextMonth;

        if (nextTimeValue > MAX_TIME_VALUE) {
          clearInterval(animationRef.current);
          setIsPlaying(false);
          return prevTimeValue;
        }

        return nextTimeValue;
      });
    }, DEFAULT_PLAYBACK_SPEED / playbackSpeed);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const currentMonthLaunches = launchesByYearMonth[normalizedTimeValue] || [];

  const setTimeValue = (timeValue: number) => {
    setCurrentTimeValue(normalizeTimeValue(timeValue));
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const resetTimeline = () => {
    setIsPlaying(false);
    setCurrentTimeValue(MIN_TIME_VALUE);
  };

  return (
    <TimelineContext.Provider
      value={{
        currentTimeValue: normalizedTimeValue,
        currentYear,
        currentMonth,
        isPlaying,
        playbackSpeed,
        allLaunchData,
        currentMonthLaunches,
        isLoading,
        minTimeValue: MIN_TIME_VALUE,
        maxTimeValue: MAX_TIME_VALUE,
        setTimeValue,
        togglePlayback,
        setPlaybackSpeed,
        resetTimeline,
        formatTimeDisplay,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
