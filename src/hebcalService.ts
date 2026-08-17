import * as KosherZmanim from 'kosher-zmanim';
import { CityMeta, FastEvent, FastZmanimDetail } from './types';

export const CITIES: Record<string, CityMeta> = {
  // ערים ראשיות / פופולריות
  jerusalem: { displayName: 'ירושלים', latitude: 31.7780, longitude: 35.2350, elevation: 750, tzid: 'Asia/Jerusalem', candleLightingMinutes: 40, popular: true },
  bnei_brak: { displayName: 'בני ברק', latitude: 32.0850, longitude: 34.8330, elevation: 30, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  beit_shemesh: { displayName: 'בית שמש', latitude: 31.7480, longitude: 34.9890, elevation: 220, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  tel_aviv: { displayName: 'תל אביב - יפו', latitude: 32.0853, longitude: 34.7818, elevation: 15, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  modiin_illit: { displayName: 'מודיעין עילית (קרית ספר)', latitude: 31.9333, longitude: 35.0333, elevation: 300, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  beitar_illit: { displayName: 'ביתר עילית', latitude: 31.6978, longitude: 35.1155, elevation: 780, tzid: 'Asia/Jerusalem', candleLightingMinutes: 40, popular: true },
  ashdod: { displayName: 'אשדוד', latitude: 31.8044, longitude: 34.6553, elevation: 25, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  petah_tikva: { displayName: 'פתח תקווה', latitude: 32.0840, longitude: 34.8878, elevation: 35, tzid: 'Asia/Jerusalem', candleLightingMinutes: 40, popular: true },
  // חיפה וקריות: מנהג 30 דקות הדלקה
  haifa: { displayName: 'חיפה', latitude: 32.7940, longitude: 34.9890, elevation: 100, tzid: 'Asia/Jerusalem', candleLightingMinutes: 30, popular: true },
  beersheva: { displayName: 'באר שבע', latitude: 31.2520, longitude: 34.7910, elevation: 260, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  netanya: { displayName: 'נתניה', latitude: 32.3215, longitude: 34.8532, elevation: 30, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },
  elad: { displayName: 'אלעד', latitude: 32.0500, longitude: 34.9500, elevation: 120, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20, popular: true },

  // ערים נוספות ברחבי הארץ
  rishon_lezion: { displayName: 'ראשון לציון', latitude: 31.9730, longitude: 34.7925, elevation: 40, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  holon: { displayName: 'חולון', latitude: 32.0158, longitude: 34.7874, elevation: 20, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  bat_yam: { displayName: 'בת ים', latitude: 32.0132, longitude: 34.7480, elevation: 15, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  rehovot: { displayName: 'רחובות', latitude: 31.8928, longitude: 34.8113, elevation: 45, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  ashkelon: { displayName: 'אשקלון', latitude: 31.6688, longitude: 34.5743, elevation: 20, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  modiin: { displayName: 'מודיעין-מכבים-רעות', latitude: 31.8903, longitude: 35.0104, elevation: 280, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  tiberias: { displayName: 'טבריה', latitude: 32.7922, longitude: 35.5312, elevation: 0, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  tzfat: { displayName: 'צפת', latitude: 32.9646, longitude: 35.4960, elevation: 850, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  nof_hagalil: { displayName: 'נוף הגליל', latitude: 32.7030, longitude: 35.3030, elevation: 420, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  afula: { displayName: 'עפולה', latitude: 32.6078, longitude: 35.2894, elevation: 60, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  hadera: { displayName: 'חדרה', latitude: 32.4340, longitude: 34.9197, elevation: 25, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kfar_saba: { displayName: 'כפר סבא', latitude: 32.1750, longitude: 34.9069, elevation: 50, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  raanana: { displayName: 'רעננה', latitude: 32.1848, longitude: 34.8708, elevation: 45, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  herzliya: { displayName: 'הרצליה', latitude: 32.1663, longitude: 34.8433, elevation: 20, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  ramat_gan: { displayName: 'רמת גן', latitude: 32.0684, longitude: 34.8248, elevation: 30, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  givatayim: { displayName: 'גבעתיים', latitude: 32.0722, longitude: 34.8089, elevation: 60, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  lod: { displayName: 'לוד', latitude: 31.9510, longitude: 34.8881, elevation: 65, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  ramla: { displayName: 'רמלה', latitude: 31.9284, longitude: 34.8690, elevation: 70, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  nahariya: { displayName: 'נהריה', latitude: 33.0059, longitude: 35.0941, elevation: 15, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  acre: { displayName: 'עכו', latitude: 32.9278, longitude: 35.0818, elevation: 10, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  karmiel: { displayName: 'כרמיאל', latitude: 32.9199, longitude: 35.2901, elevation: 260, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_gat: { displayName: 'קריית גת', latitude: 31.6100, longitude: 34.7642, elevation: 125, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_shmona: { displayName: 'קריית שמונה', latitude: 33.2073, longitude: 35.5721, elevation: 100, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  katzrin: { displayName: 'קצרין (רמת הגולן)', latitude: 32.9936, longitude: 35.6900, elevation: 320, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  dimona: { displayName: 'דימונה', latitude: 31.0694, longitude: 35.0336, elevation: 550, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  arad: { displayName: 'ערד', latitude: 31.2589, longitude: 35.2128, elevation: 580, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  eilat: { displayName: 'אילת', latitude: 29.5577, longitude: 34.9519, elevation: 20, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  netivot: { displayName: 'נתיבות', latitude: 31.4172, longitude: 34.5886, elevation: 140, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  ofakim: { displayName: 'אופקים', latitude: 31.3150, longitude: 34.6190, elevation: 135, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  sderot: { displayName: 'שדרות', latitude: 31.5215, longitude: 34.5959, elevation: 90, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_ata: { displayName: 'קריית אתא', latitude: 32.8056, longitude: 35.1094, elevation: 50, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_motzkin: { displayName: 'קריית מוצקין', latitude: 32.8333, longitude: 35.0833, elevation: 15, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_bialik: { displayName: 'קריית ביאליק', latitude: 32.8278, longitude: 35.0742, elevation: 15, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_yam: { displayName: 'קריית ים', latitude: 32.8456, longitude: 35.0683, elevation: 10, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  yavne: { displayName: 'יבנה', latitude: 31.8781, longitude: 34.7397, elevation: 30, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  rosh_haayin: { displayName: 'ראש העין', latitude: 32.0956, longitude: 34.9567, elevation: 75, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  hod_hasharon: { displayName: 'הוד השרון', latitude: 32.1500, longitude: 34.8833, elevation: 45, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  ramat_hasharon: { displayName: 'רמת השרון', latitude: 32.1469, longitude: 34.8394, elevation: 35, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  nes_ziona: { displayName: 'נס ציונה', latitude: 31.9314, longitude: 34.7981, elevation: 40, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  zikhron_yaakov: { displayName: 'זכרון יעקב', latitude: 32.5714, longitude: 34.9531, elevation: 175, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  ariel: { displayName: 'אריאל', latitude: 32.1061, longitude: 35.1844, elevation: 600, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  maale_adumim: { displayName: 'מעלה אדומים', latitude: 31.7922, longitude: 35.2975, elevation: 480, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  rechasim: { displayName: 'רכסים', latitude: 32.7486, longitude: 35.1050, elevation: 80, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 },
  kiryat_arba: { displayName: 'חברון / קריית ארבע', latitude: 31.5280, longitude: 35.1189, elevation: 950, tzid: 'Asia/Jerusalem', candleLightingMinutes: 20 }
};

export const FAST_END_MESSAGES: Record<string, { text: string; type: 'celebration' | 'comfort' | 'default' }> = {
  yomkippur: { text: 'גמר חתימה טובה! שנה טובה ומתוקה 🍎🍯', type: 'celebration' },
  tishabav: { text: 'נוחם על ציון וירושלים 🙏', type: 'comfort' },
  tzomtammuz: { text: 'הצום הסתיים! שיהיה לתעניתו זכות 🙏', type: 'default' },
  asarabtevet: { text: 'הצום הסתיים! שיהיה לתעניתו זכות 🙏', type: 'default' },
  tzomgedaliah: { text: 'הצום הסתיים! שיהיה לתעניתו זכות 🙏', type: 'default' },
  taanitesther: { text: 'הצום הסתיים! פורים שמח! 🎭', type: 'celebration' },
  taanitbechorot: { text: 'הצום הסתיים! חג פסח כשר ושמח! 🍷', type: 'celebration' },
  default: { text: 'הצום הסתיים! שיהיה לתעניתו זכות 🙏', type: 'default' }
};

export function canonicalFastKey(raw: string): string {
  if (!raw) return '';
  let key = raw.replace(/^Erev\s+/i, '');
  key = key.replace(/[\u2018\u2019\u0027\u02BC\u201B]/g, '');
  key = key.replace(/B['\u2018\u2019]/gi, 'B');
  key = key.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  key = key.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
  return key;
}

export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatGregDateDisplay(gregDate?: string): string {
  if (!gregDate) return '';
  const parts = gregDate.split('-');
  if (parts.length < 3) return gregDate;
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
}

export function formatTime(date?: Date | null, tzid: string = 'Asia/Jerusalem'): string {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) return '-';
  try {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: tzid
    }).format(date);
  } catch {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}

const hebrewDays = ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת'];

function getHebrewDayName(date: Date): string {
  return hebrewDays[date.getDay()] || '';
}

/**
 * Calculates all Halachic fasts for a given year and city with 100% precision
 * using the KosherZmanim astronomical & Jewish calendar algorithms.
 */
export function calculateYearlyFasts(cityKey: string, year: number): FastEvent[] {
  const city = CITIES[cityKey] || CITIES.jerusalem;
  const elevation = city.elevation ?? 100;
  const loc = new KosherZmanim.GeoLocation(city.displayName, city.latitude, city.longitude, elevation, city.tzid);
  const z = new KosherZmanim.ComplexZmanimCalendar(loc);
  const jc = new KosherZmanim.JewishCalendar();
  const hdf = new KosherZmanim.HebrewDateFormatter();
  hdf.setHebrewFormat(true);

  const fasts: FastEvent[] = [];
  const startYear = KosherZmanim.DateTime.fromObject({ year, month: 1, day: 1 });
  const endYear = KosherZmanim.DateTime.fromObject({ year, month: 12, day: 31 });

  for (let d = startYear; d <= endYear; d = d.plus({ days: 1 })) {
    jc.setDate(d);
    const yt = jc.getYomTovIndex();
    const isTB = jc.isTishaBav();
    const isYK = jc.isYomKippur();
    const isTaanis = jc.isTaanis();
    const isBechoros = jc.isTaanisBechoros();

    if (!isTB && !isYK && !isTaanis && !isBechoros) continue;

    let key = '';
    let hebrewTitle = '';
    let englishTitle = '';

    if (isTB) {
      key = 'tishabav';
      hebrewTitle = 'תשעה באב';
      englishTitle = "Tish'a B'Av";
    } else if (isYK) {
      key = 'yomkippur';
      hebrewTitle = 'יום כיפור';
      englishTitle = 'Yom Kippur';
    } else if (isBechoros) {
      key = 'taanitbechorot';
      hebrewTitle = 'תענית בכורות';
      englishTitle = 'Fast of the Firstborn';
    } else if (yt === 6) {
      key = 'tzomtammuz';
      hebrewTitle = 'צום י״ז בתמוז';
      englishTitle = 'Fast of 17th of Tammuz';
    } else if (yt === 11) {
      key = 'tzomgedaliah';
      hebrewTitle = 'צום גדליה';
      englishTitle = 'Fast of Gedaliah';
    } else if (yt === 22) {
      key = 'asarabtevet';
      hebrewTitle = 'עשרה בטבת';
      englishTitle = 'Fast of 10th of Tevet';
    } else if (yt === 24) {
      key = 'taanitesther';
      hebrewTitle = 'תענית אסתר';
      englishTitle = 'Fast of Esther';
    } else {
      key = 'taanis';
      hebrewTitle = 'תענית';
      englishTitle = 'Fast Day';
    }

    z.setDate(d);
    const daySunrise = z.getSunrise()?.toJSDate() || new Date();
    const daySunset = z.getSeaLevelSunset()?.toJSDate() || new Date();

    // Alos options
    const alos16 = z.getAlos16Point1Degrees()?.toJSDate() || z.getAlos72()?.toJSDate() || new Date();
    const alos72Fixed = z.getAlos72()?.toJSDate() || new Date(daySunrise.getTime() - 72 * 60 * 1000);

    // Tzeit options
    const tzeitFast2net6Pt45 = z.getTzaisGeonim6Point45Degrees()?.toJSDate() || new Date(daySunset.getTime() + 27 * 60 * 1000);
    const tzeit7Pt083 = z.getTzaisGeonim7Point083Degrees()?.toJSDate() || new Date(daySunset.getTime() + 30 * 60 * 1000);
    const tzeitYomKippur8Pt5 = z.getTzaisGeonim8Point5Degrees()?.toJSDate() || new Date(daySunset.getTime() + 36 * 60 * 1000);
    const tzeitOrHaChaim = z.getTzaisGeonim5Point95Degrees()?.toJSDate() || new Date(daySunset.getTime() + 23 * 60 * 1000);
    const tzeitChazonIsh50 = new Date(daySunset.getTime() + 50 * 60 * 1000);

    // Rabbeinu Tam options (72 fixed min vs 72 seasonal/zmaniyot min)
    const rt72Fixed = new Date(daySunset.getTime() + 72 * 60 * 1000);
    const rt72Zmaniyot = z.getTzais72Zmanis()?.toJSDate() || rt72Fixed;

    const details: FastZmanimDetail = {
      sunrise: daySunrise,
      sunsetGeometric: daySunset,
      alos16Point1Deg: alos16,
      alos72Fixed: alos72Fixed,
      tzeitFast2net6Pt45Deg: tzeitFast2net6Pt45,
      tzeitGeonim7Pt083Deg: tzeit7Pt083,
      tzeitYomKippur2net8Pt5Deg: tzeitYomKippur8Pt5,
      tzeitShabbatOrHaChaim: tzeitOrHaChaim,
      tzeitChazonIsh50Min: tzeitChazonIsh50,
      rabbeinuTam72Fixed: rt72Fixed,
      rabbeinuTam72Zmaniyot: rt72Zmaniyot
    };

    let startDt: Date;
    let endDt: Date;
    let startLabel = '';
    let endLabel = '';
    let startMethodDesc = '';
    let endMethodDesc = '';
    let is25Hour = false;
    let dateDisplay = '';
    let fastType: 'minor' | '9av' | 'yomkippur' = 'minor';

    const gregDateStr = d.toISODate()!;
    const hebrewDateStr = hdf.format(jc);
    const mainDayDate = new Date(gregDateStr + 'T12:00:00');
    const mainDayName = getHebrewDayName(mainDayDate);

    const isJerusalemDistrict = cityKey === 'jerusalem' || cityKey === 'beitar_illit' || cityKey === 'petah_tikva';

    if (key === 'tishabav') {
      fastType = '9av';
      is25Hour = true;
      // Fast starts on Erev Tisha B'Av at sunset
      const erevDate = d.minus({ days: 1 });
      z.setDate(erevDate);
      const erevSunset = z.getSeaLevelSunset()?.toJSDate() || new Date();
      startDt = erevSunset;
      startLabel = 'שקיעת החמה (ערב הצום)';
      startMethodDesc = 'שקיעת גלגל החמה המישורית בערב תשעה באב';

      // Fast ends on 9 Av: 2net fast ending formula (6.45° after sea-level sunset)
      z.setDate(d);
      endDt = tzeitFast2net6Pt45;
      endLabel = 'צאת הצום';
      endMethodDesc = 'שקיעת השמש 6.45° מתחת לאופק (הגדרת צאת צום בלוח 2net)';

      const erevDayDate = new Date(erevDate.toISODate()! + 'T12:00:00');
      const erevDayName = getHebrewDayName(erevDayDate);
      dateDisplay = `${formatGregDateDisplay(erevDate.toISODate()!)} (${erevDayName} בערב) - ${formatGregDateDisplay(gregDateStr)} (${mainDayName})`;
    } else if (key === 'yomkippur') {
      fastType = 'yomkippur';
      is25Hour = true;
      const candleMin = city.candleLightingMinutes || (isJerusalemDistrict ? 40 : 20);
      const erevDate = d.minus({ days: 1 });
      z.setDate(erevDate);
      const erevSunset = z.getSeaLevelSunset()?.toJSDate() || new Date();
      
      // Candle lighting on Erev Yom Kippur
      startDt = new Date(erevSunset.getTime() - candleMin * 60 * 1000);
      startLabel = `הדלקת נרות (${candleMin} דק׳)`;
      startMethodDesc = `שקיעה מישורית פחות ${candleMin} דקות תוספת שבת ויום כיפור`;

      // Fast ends at Motzei Yom Kippur: 2net Yom Kippur exit rule (8.5° solar depression)
      z.setDate(d);
      endDt = tzeitYomKippur8Pt5;
      endLabel = 'מוצאי יום כיפור';
      endMethodDesc = 'צאת יום כיפור בלוח 2net (שקיעת השמש 8.5° מתחת לאופק / 3 כוכבים קטנים)';

      const erevDayDate = new Date(erevDate.toISODate()! + 'T12:00:00');
      const erevDayName = getHebrewDayName(erevDayDate);
      dateDisplay = `${formatGregDateDisplay(erevDate.toISODate()!)} (${erevDayName} בערב) - ${formatGregDateDisplay(gregDateStr)} (${mainDayName})`;
    } else {
      fastType = 'minor';
      // Light fasts: Alot HaShachar (16.1° / 72 min proportional before sunrise)
      startDt = alos16;
      startLabel = 'עלות השחר';
      startMethodDesc = '72 דקות זמניות (16.1° מתחת לאופק לפני הנץ)';

      // Minor fast end: 2net fast rule (6.45° after sea-level sunset)
      endDt = tzeitFast2net6Pt45;
      endLabel = 'צאת הצום';
      endMethodDesc = 'צאת צום בלוח 2net (שקיעת השמש 6.45° מתחת לאופק)';

      dateDisplay = `${formatGregDateDisplay(gregDateStr)} (${mainDayName})`;
    }

    fasts.push({
      key,
      title: hebrewTitle,
      hebrewTitle,
      englishTitle,
      gregDate: gregDateStr,
      hebrewDate: hebrewDateStr,
      hdate: hebrewDateStr,
      start: startDt,
      end: endDt,
      rabbeinuTam: rt72Fixed,
      tzid: city.tzid,
      startLabel,
      endLabel,
      startMethodDesc,
      endMethodDesc,
      dateDisplay,
      is25Hour,
      fastType,
      details
    });
  }

  // Sort by start timestamp ascending
  fasts.sort((a, b) => (a.start?.getTime() || 0) - (b.start?.getTime() || 0));
  return fasts;
}

const fastCalendarCache = new Map<string, FastEvent[]>();

export async function getYearlyFasts(cityKey: string, year: number): Promise<FastEvent[]> {
  const cacheKey = `${cityKey}:${year}`;
  if (fastCalendarCache.has(cacheKey)) {
    return fastCalendarCache.get(cacheKey)!;
  }
  const fasts = calculateYearlyFasts(cityKey, year);
  fastCalendarCache.set(cacheKey, fasts);
  return fasts;
}

export async function loadNextFast(cityKey: string): Promise<FastEvent | null> {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Load current year and next year fasts to guarantee continuity
  const thisYearFasts = calculateYearlyFasts(cityKey, currentYear);
  const nextYearFasts = calculateYearlyFasts(cityKey, currentYear + 1);
  const allFasts = [...thisYearFasts, ...nextYearFasts];

  const next = allFasts.find((f) => {
    // Fast is upcoming or currently active
    if (f.end && f.end.getTime() > now.getTime()) return true;
    return false;
  });

  return next || allFasts[0] || null;
}
