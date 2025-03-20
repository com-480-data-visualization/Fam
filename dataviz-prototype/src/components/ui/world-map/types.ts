export interface Launch {
  LaunchPad: string;
  Name: string;
  lat: number | null;
  lon: number | null;
  year?: number;
  date?: string;
  mission?: string;
  Status: string;
  datetime_iso: string;
}

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
}

export interface WorldMapProps {
  launchData: Launch[] | null;
  isLoading: boolean;
}

export interface StatusColorMap {
  [key: string]: string;
  default: string;
}
