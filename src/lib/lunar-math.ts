export type LandingSite = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  elevation: number;
  illumination: number;
  earthBase: number;
  sunlightOffset: number;
};

export const landingSites = [
  {
    id: "nobile-rim",
    name: "Nobile Rim 01",
    region: "Shackleton · south pole",
    latitude: -85.21,
    longitude: 31.44,
    elevation: 620,
    illumination: 82,
    earthBase: 11.8,
    sunlightOffset: 1.8,
  },
  {
    id: "de-gerlache",
    name: "De Gerlache Rim",
    region: "De Gerlache · near side",
    latitude: -88.34,
    longitude: 270.2,
    elevation: 410,
    illumination: 76,
    earthBase: 8.6,
    sunlightOffset: -0.3,
  },
  {
    id: "haworth",
    name: "Haworth Plateau",
    region: "Haworth · highlands",
    latitude: -87.54,
    longitude: 203.2,
    elevation: 685,
    illumination: 68,
    earthBase: 13.2,
    sunlightOffset: -2.1,
  },
] as const satisfies readonly LandingSite[];

export type Ephemeris = {
  solarElevation: number;
  solarAzimuth: number;
  earthElevation: number;
  earthAzimuth: number;
  illumination: number;
  batteryEstimate: number;
  earthVisible: boolean;
};

/** Clearly labeled, repeatable illustrative values; not a validated ephemeris. */
export function calculateIllustrativeEphemeris(
  site: LandingSite,
  minuteOfDay: number,
  date: string,
): Ephemeris {
  const hours = minuteOfDay / 60;
  const dayOfYear = Math.max(1, new Date(`${date}T12:00:00Z`).getUTCDate());
  const sunWave = Math.sin(((hours - 4.5) / 24) * Math.PI * 2);
  const solarElevation = Number(
    Math.max(-4.2, 11.2 * sunWave + site.sunlightOffset).toFixed(1),
  );
  const solarAzimuth = Math.round((hours * 15 + site.longitude + 19) % 360);
  const earthElevation = Number(
    (site.earthBase + Math.sin((hours / 24) * Math.PI * 2) * 1.3).toFixed(1),
  );
  const earthAzimuth = Math.round((156 + hours * 4 + site.latitude + 90) % 360);
  const illumination = Math.max(
    38,
    Math.min(
      96,
      Math.round(site.illumination + Math.max(0, solarElevation) * 0.68 - (dayOfYear % 9)),
    ),
  );
  return {
    solarElevation,
    solarAzimuth,
    earthElevation,
    earthAzimuth,
    illumination,
    batteryEstimate: Math.min(100, Math.max(12, Math.round(illumination * 0.9))),
    earthVisible: earthElevation > 0,
  };
}

export const missionDates = [
  { value: "2026-10-02", label: "02 OCT 2026" },
  { value: "2026-10-03", label: "03 OCT 2026" },
  { value: "2026-10-04", label: "04 OCT 2026" },
];

export const telemetrySeries = Array.from({ length: 25 }, (_, hour) => {
  const wave = Math.sin(((hour - 4.5) / 24) * Math.PI * 2);
  const solar = Number(Math.max(-4.2, 11.2 * wave + 1.8).toFixed(1));
  return {
    time: `${String(hour).padStart(2, "0")}:00`,
    hour,
    solar,
    illumination: Math.round(Math.max(30, Math.min(94, 82 + Math.max(0, solar) * 0.68 - 5))),
    earth: Number((11.8 + Math.sin((hour / 24) * Math.PI * 2) * 1.3).toFixed(1)),
  };
});