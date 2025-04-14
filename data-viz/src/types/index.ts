export interface Launch {
  Name: string;
  Status: string;
  Provider: string;
  Rocket: string;
  Mission: string;
  LaunchPad: string;
  lat: number;
  lon: number;
  datetime_iso: string;
  timestamp_days?: number;
  year: number;
}

export interface Provider {
  id: string;
  name: string;
  country?: string;
  foundingYear?: number;
  launchCount?: number;
}

export interface Rocket {
  id: string;
  name: string;
  providerId: string;
  imageUrl?: string;
  description?: string;
  specs?: {
    height?: string;
    thrust?: string;
    weight?: string;
    [key: string]: string | undefined;
  };
  modelUrl?: string;
}

export interface Era {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}
