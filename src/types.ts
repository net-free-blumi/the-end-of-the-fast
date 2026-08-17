export interface CityMeta {
  displayName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  tzid: string;
  candleLightingMinutes?: number;
  popular?: boolean;
}

export interface FastZmanimDetail {
  // Astronomical Layer
  sunsetGeometric?: Date | null;
  sunsetVisible?: Date | null;
  sunrise?: Date | null;

  // Halachic Layer: Alos options
  alos16Point1Deg?: Date | null; // 72 proportional/zmaniyot minutes (16.1° depression)
  alos72Fixed?: Date | null; // 72 standard fixed minutes before sunrise

  // Halachic Layer: Fast-ending & Tzeit options
  tzeitFast2net6Pt45Deg?: Date | null; // 2net minor fasts & 9Av formula: 6.45° depression after sea-level sunset
  tzeitGeonim7Pt083Deg?: Date | null; // 3 medium stars (7.083° depression)
  tzeitYomKippur2net8Pt5Deg?: Date | null; // 2net Yom Kippur exit: 8.5° depression (3 small stars)
  tzeitShabbatOrHaChaim?: Date | null; // Or HaChaim calendar method (~5.95° depression)
  tzeitChazonIsh50Min?: Date | null; // Chazon Ish stringency: fixed 50 min after sunset

  // Halachic Layer: Rabbeinu Tam options
  rabbeinuTam72Fixed?: Date | null; // Fixed 72 minutes after sea-level sunset
  rabbeinuTam72Zmaniyot?: Date | null; // Seasonal/zmaniyot 72 minutes after sea-level sunset
}

export interface FastEvent {
  key: string;
  englishTitle: string;
  hebrewTitle: string;
  title: string;
  gregDate: string;
  hebrewDate?: string;
  hdate?: string;
  start: Date | null;
  end: Date | null;
  rabbeinuTam?: Date | null;
  tzid?: string;
  startLabel?: string;
  endLabel?: string;
  startMethodDesc?: string;
  endMethodDesc?: string;
  dateDisplay?: string;
  is25Hour?: boolean;
  fastType: 'minor' | '9av' | 'yomkippur';
  details?: FastZmanimDetail;
}

export type FastPhase = 'idle' | 'before' | 'during' | 'after';

export interface CountdownTime {
  days?: string;
  hours: string;
  minutes: string;
  seconds: string;
  totalDays: number;
}

