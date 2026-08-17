import { calculateYearlyFasts, formatTime } from './hebcalService';

/**
 * Golden Test Suite for Zmanim Engine
 * Validates dynamic mathematical outputs from astronomical coordinates
 * against documented target cases (e.g. Beit Shemesh 2026 / 5787)
 */
export function runGoldenTests() {
  const results: { test: string; passed: boolean; details: string }[] = [];

  const fasts2026 = calculateYearlyFasts('beit_shemesh', 2026);
  
  // 1. Tzom Gedaliah 2026-09-14: 2net fast exit should be 19:14 (6.45° after sea-level sunset)
  const tg = fasts2026.find(f => f.key === 'tzomgedaliah');
  if (tg) {
    const endStr = formatTime(tg.end, tg.tzid);
    const pass = endStr === '19:14';
    results.push({
      test: 'צום גדליה תשפ״ז בית שמש (צאת צום 6.45° = 19:14)',
      passed: pass,
      details: `תוצאה מחושבת: ${endStr}`
    });
  }

  // 2. Yom Kippur 2026-09-21: 2net fast exit should be 19:14-19:15 (8.5° solar depression)
  const yk = fasts2026.find(f => f.key === 'yomkippur');
  if (yk) {
    const endStr = formatTime(yk.end, yk.tzid);
    const ciStr = formatTime(yk.details?.tzeitChazonIsh50Min, yk.tzid);
    const pass = (endStr === '19:14' || endStr === '19:15') && ciStr === '19:28';
    results.push({
      test: 'יום כיפור תשפ״ז בית שמש (מוצאי יו״כ 8.5° = 19:14-19:15 | חזו״א 50ד = 19:28)',
      passed: pass,
      details: `תוצאה מחושבת צאת צום: ${endStr}, חזון איש: ${ciStr}`
    });
  }

  // 3. 17 Tammuz 2026-07-02: 2net fast exit should be 20:19 (6.45°)
  const tammuz = fasts2026.find(f => f.key === 'tzomtammuz');
  if (tammuz) {
    const endStr = formatTime(tammuz.end, tammuz.tzid);
    const pass = endStr === '20:19' || endStr === '20:20';
    results.push({
      test: 'י״ז בתמוז תשפ״ו בית שמש (צאת צום 6.45° = 20:19)',
      passed: pass,
      details: `תוצאה מחושבת: ${endStr}`
    });
  }

  // 4. 10 Tevet 2026-12-20: 2net fast exit should be 17:08-17:09 (6.45°)
  const tevet = fasts2026.find(f => f.key === 'asarabtevet');
  if (tevet) {
    const endStr = formatTime(tevet.end, tevet.tzid);
    const pass = endStr === '17:08' || endStr === '17:09';
    results.push({
      test: 'עשרה בטבת תשפ״ז בית שמש (צאת צום 6.45° = 17:08-17:09)',
      passed: pass,
      details: `תוצאה מחושבת: ${endStr}`
    });
  }

  // 5. Rabbeinu Tam 72 fixed min: Taanit Esther 2026-03-02 (Sunset 17:38 + 72m = 18:50)
  const esther = fasts2026.find(f => f.key === 'taanitesther');
  if (esther) {
    const rtFixedStr = formatTime(esther.details?.rabbeinuTam72Fixed, esther.tzid);
    const pass = rtFixedStr === '18:50';
    results.push({
      test: 'תענית אסתר תשפ״ו בית שמש (רבנו תם 72 דק׳ קבועות = 18:50)',
      passed: pass,
      details: `תוצאה מחושבת: ${rtFixedStr}`
    });
  }

  return results;
}
