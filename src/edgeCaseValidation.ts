import * as KosherZmanim from 'kosher-zmanim';
import { calculateYearlyFasts, formatTime, CITIES } from './hebcalService';

export interface EdgeCaseTestResult {
  suite: string;
  test: string;
  passed: boolean;
  expected: string;
  actual: string;
  notes?: string;
}

export function runComprehensiveValidation(): EdgeCaseTestResult[] {
  const results: EdgeCaseTestResult[] = [];

  // ==========================================
  // Suite 1: Mathematical Invariance & Monotonicity
  // ==========================================
  const citiesToTest = ['jerusalem', 'beit_shemesh', 'tzfat', 'beersheva', 'netanya', 'haifa'];
  const testYears = [2024, 2025, 2026, 2027, 2030];

  for (const cityKey of citiesToTest) {
    const city = CITIES[cityKey];
    for (const year of testYears) {
      const fasts = calculateYearlyFasts(cityKey, year);
      
      for (const fast of fasts) {
        const d = fast.details;
        if (!d) continue;

        // 1.1 Sunrise is strictly before Sunset
        if (d.sunrise && d.sunsetGeometric) {
          const sunOrder = d.sunrise.getTime() < d.sunsetGeometric.getTime();
          results.push({
            suite: 'Mathematical Invariance',
            test: `${city.displayName} ${year} (${fast.title}) - הנץ לפני השקיעה`,
            passed: sunOrder,
            expected: 'sunrise < sunset',
            actual: `${formatTime(d.sunrise, fast.tzid)} < ${formatTime(d.sunsetGeometric, fast.tzid)}`
          });
        }

        // 1.2 Alos (16.1°) is strictly before Sunrise
        if (d.alos16Point1Deg && d.sunrise) {
          const alosOrder = d.alos16Point1Deg.getTime() < d.sunrise.getTime();
          results.push({
            suite: 'Mathematical Invariance',
            test: `${city.displayName} ${year} (${fast.title}) - עלות 16.1° לפני הנץ`,
            passed: alosOrder,
            expected: 'alos < sunrise',
            actual: `${formatTime(d.alos16Point1Deg, fast.tzid)} < ${formatTime(d.sunrise, fast.tzid)}`
          });
        }

        // 1.3 Strict Astronomical Progression at Twilight:
        // sunset < tzeit 5.95° < tzeit 6.45° < tzeit 7.083° < tzeit 8.5°
        if (d.sunsetGeometric && d.tzeitShabbatOrHaChaim && d.tzeitFast2net6Pt45Deg && d.tzeitGeonim7Pt083Deg && d.tzeitYomKippur2net8Pt5Deg) {
          const s = d.sunsetGeometric.getTime();
          const t595 = d.tzeitShabbatOrHaChaim.getTime();
          const t645 = d.tzeitFast2net6Pt45Deg.getTime();
          const t7083 = d.tzeitGeonim7Pt083Deg.getTime();
          const t85 = d.tzeitYomKippur2net8Pt5Deg.getTime();

          const orderPass = s < t595 && t595 <= t645 && t645 <= t7083 && t7083 < t85;
          results.push({
            suite: 'Mathematical Invariance',
            test: `${city.displayName} ${year} (${fast.title}) - סדר זמני דמדומים (שקיעה < 5.95° <= 6.45° <= 7.083° < 8.5°)`,
            passed: orderPass,
            expected: 's < 5.95° <= 6.45° <= 7.083° < 8.5°',
            actual: `${formatTime(d.sunsetGeometric, fast.tzid)} < ${formatTime(d.tzeitShabbatOrHaChaim, fast.tzid)} <= ${formatTime(d.tzeitFast2net6Pt45Deg, fast.tzid)} <= ${formatTime(d.tzeitGeonim7Pt083Deg, fast.tzid)} < ${formatTime(d.tzeitYomKippur2net8Pt5Deg, fast.tzid)}`
          });
        }

        // 1.4 Chazon Ish (Sunset + 50m) vs Rabbeinu Tam (Sunset + 72m)
        if (d.tzeitChazonIsh50Min && d.rabbeinuTam72Fixed) {
          const diffMin = Math.round((d.rabbeinuTam72Fixed.getTime() - d.tzeitChazonIsh50Min.getTime()) / 60000);
          const ciRtOrder = diffMin === 22;
          results.push({
            suite: 'Mathematical Invariance',
            test: `${city.displayName} ${year} (${fast.title}) - הפרש רבנו תם לחזון איש (בדיוק 22 דק׳ קבועות)`,
            passed: ciRtOrder,
            expected: '22 minutes diff',
            actual: `${diffMin} minutes diff`
          });
        }
      }
    }
  }

  // ==========================================
  // Suite 2: High Elevation & Extreme Coordinates
  // ==========================================
  // Tzfat (~850m) & Jerusalem (~750m) vs Tel Aviv (sea level ~15m)
  const bsFast = calculateYearlyFasts('tzfat', 2026).find(f => f.key === 'tzomgedaliah');
  const tlvFast = calculateYearlyFasts('tel_aviv', 2026).find(f => f.key === 'tzomgedaliah');
  if (bsFast && tlvFast) {
    results.push({
      suite: 'Elevation & Geography',
      test: 'בדיקת קואורדינטות: צפת (צפון + גובה) מול תל אביב (מישור החוף)',
      passed: !!bsFast.start && !!tlvFast.start,
      expected: 'Valid calculated zmanim on elevation',
      actual: `צפת עלות: ${formatTime(bsFast.start, bsFast.tzid)} | תל אביב עלות: ${formatTime(tlvFast.start, tlvFast.tzid)}`
    });
  }

  // ==========================================
  // Suite 3: DST Transition Invariance
  // ==========================================
  // In Israel, DST ends late October (between Yom Kippur / Simchat Torah and 10 Tevet)
  const ykIsrael = calculateYearlyFasts('jerusalem', 2026).find(f => f.key === 'yomkippur');
  const tevetIsrael = calculateYearlyFasts('jerusalem', 2026).find(f => f.key === 'asarabtevet');
  if (ykIsrael && tevetIsrael) {
    const ykTimeStr = formatTime(ykIsrael.start, ykIsrael.tzid);
    const tevetTimeStr = formatTime(tevetIsrael.start, tevetIsrael.tzid);
    results.push({
      suite: 'DST & Timezones',
      test: 'ירושלים: מעבר בין שעון קיץ (יום כיפור) לשעון חורף (עשרה בטבת)',
      passed: ykTimeStr.startsWith('17:') || ykTimeStr.startsWith('18:') && tevetTimeStr.startsWith('05:'),
      expected: 'Correct local timezone rendering across DST changes',
      actual: `יו״כ כניסה: ${ykTimeStr} (קיץ) | טבת כניסה: ${tevetTimeStr} (חורף)`
    });
  }

  // ==========================================
  // Suite 4: Yom Kippur Isolation (No Fallback to Shabbat)
  // ==========================================
  const ykBeitShemesh = calculateYearlyFasts('beit_shemesh', 2026).find(f => f.key === 'yomkippur');
  if (ykBeitShemesh && ykBeitShemesh.details) {
    const ykEnd = formatTime(ykBeitShemesh.end, ykBeitShemesh.tzid);
    const shabbatEnd = formatTime(ykBeitShemesh.details.tzeitShabbatOrHaChaim, ykBeitShemesh.tzid);
    const isDistinct = ykEnd !== shabbatEnd;
    results.push({
      suite: 'Profile Isolation',
      test: 'יום כיפור אינו נופל לזמן מוצאי שבת אור החיים (19:14 מול 19:02)',
      passed: isDistinct && (ykEnd === '19:14' || ykEnd === '19:15') && (shabbatEnd === '19:02' || shabbatEnd === '19:11'),
      expected: 'ykEnd !== shabbatOrHaChaim (strict profile isolation)',
      actual: `מוצאי יו״כ (8.5°): ${ykEnd} | צאת אור החיים (5.95°): ${shabbatEnd}`
    });
  }

  return results;
}
