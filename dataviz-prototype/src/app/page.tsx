"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useRef } from "react";

import { WorldMap } from "@/components/ui/world-map";
import { AnimationControls } from "@/components/ui/animation-controls";

const MIN_YEAR = 1957;
const MAX_YEAR = 2025;
const ANIMATION_SPEED = 800;

export default function Home() {
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const launchesByYear = useQuery(api.launches.getAllGroupedByYear) || {};

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    animationRef.current = setInterval(() => {
      setCurrentYear((prevYear) => {
        const nextYear = prevYear + 1;
        if (nextYear > MAX_YEAR) {
          clearInterval(animationRef.current);
          setIsPlaying(false);
          return prevYear;
        }
        return nextYear;
      });
    }, ANIMATION_SPEED);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying]);

  const currentYearLaunches = launchesByYear[currentYear] || [];

  const isLoading = !launchesByYear || Object.keys(launchesByYear).length === 0;

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(MIN_YEAR);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Space Launches</h1>

      <AnimationControls
        currentYear={currentYear}
        minYear={MIN_YEAR}
        maxYear={MAX_YEAR}
        isPlaying={isPlaying}
        isLoading={isLoading}
        onYearChange={handleYearChange}
        onPlayPause={togglePlayback}
        onReset={handleReset}
      />

      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <WorldMap launchData={currentYearLaunches} isLoading={isLoading} />
      </div>
    </main>
  );
}
