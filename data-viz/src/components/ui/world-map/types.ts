import { Launch } from "../../../types";

export interface Launchpad {
  key: string;
  name: string;
  lat: number;
  lon: number;
  count: number;
  launches: Launch[];
  statuses: Record<string, number>;
  primaryStatus: string;
  x?: number;
  y?: number;
  originalX?: number;
  originalY?: number;
  inMicroLayout?: boolean;
}

export interface WorldMapProps {
  launchData: Launch[] | null;
  isLoading: boolean;
  width?: number;
  height?: number;
}

export interface StatusColorMap {
  [key: string]: string;
  default: string;
}

export interface SpaceTweet {
  id: number;
  year: number;
  author: string;
  content: string;
  importance?: number;
}
