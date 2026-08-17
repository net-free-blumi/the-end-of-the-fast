import * as KosherZmanim from 'kosher-zmanim';
import { CITIES } from './hebcalService';

function debugFastExact(cityName: string, dateIso: string, ruleName: string) {
  const city = CITIES[cityName];
  const loc = new KosherZmanim.GeoLocation(city.displayName, city.latitude, city.longitude, city.elevation || 0, city.tzid);
  const z = new KosherZmanim.ComplexZmanimCalendar(loc);
  const dt = new KosherZmanim.DateTime(dateIso + 'T12:00:00+03:00');
  z.setDate(dt);

  const sunset = z.getSeaLevelSunset().toJSDate();
  const tzeit645 = z.getTzaisGeonim6Point45Degrees()?.toJSDate();
  const tzeit85 = z.getTzaisGeonim8Point5Degrees()?.toJSDate();
  const tzeit595 = z.getTzaisGeonim5Point95Degrees()?.toJSDate();
  const tzeit7083 = z.getTzaisGeonim7Point083Degrees()?.toJSDate();
  const chazonIsh = new Date(sunset.getTime() + 50 * 60000);
  const rt72 = new Date(sunset.getTime() + 72 * 60000);

  const fmtExact = (d: Date | undefined) => d ? d.toISOString() : 'N/A';
  const fmtLocalExact = (d: Date | undefined) => {
    if (!d) return 'N/A';
    return new Intl.DateTimeFormat('he-IL', {
      timeZone: city.tzid,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(d) + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };

  const deltaMin = (d1: Date, d2: Date) => ((d2.getTime() - d1.getTime()) / 60000).toFixed(3);
  const deltaSec = (d1: Date, d2: Date) => ((d2.getTime() - d1.getTime()) / 1000).toFixed(1);

  return {
    city: city.displayName,
    date: dateIso,
    rule: ruleName,
    sunset: {
      local: fmtLocalExact(sunset),
      utc: fmtExact(sunset)
    },
    tzeit645: {
      local: fmtLocalExact(tzeit645),
      deltaMinutes: tzeit645 ? deltaMin(sunset, tzeit645) : 'N/A',
      deltaSeconds: tzeit645 ? deltaSec(sunset, tzeit645) : 'N/A'
    },
    tzeit85: {
      local: fmtLocalExact(tzeit85),
      deltaMinutes: tzeit85 ? deltaMin(sunset, tzeit85) : 'N/A',
      deltaSeconds: tzeit85 ? deltaSec(sunset, tzeit85) : 'N/A'
    },
    tzeit595: {
      local: fmtLocalExact(tzeit595),
      deltaMinutes: tzeit595 ? deltaMin(sunset, tzeit595) : 'N/A'
    },
    tzeit7083: {
      local: fmtLocalExact(tzeit7083),
      deltaMinutes: tzeit7083 ? deltaMin(sunset, tzeit7083) : 'N/A'
    },
    chazonIsh: {
      local: fmtLocalExact(chazonIsh)
    },
    rt72: {
      local: fmtLocalExact(rt72)
    }
  };
}

console.log('================================================================');
console.log('EXACT TIMESTAMP & DELTA DEBUG: BEIT SHEMESH & JERUSALEM 2026');
console.log('================================================================\n');

const cases = [
  { city: 'beit_shemesh', date: '2026-09-14', name: 'צום גדליה' },
  { city: 'beit_shemesh', date: '2026-09-21', name: 'יום כיפור' },
  { city: 'jerusalem', date: '2026-09-14', name: 'צום גדליה' },
  { city: 'jerusalem', date: '2026-09-21', name: 'יום כיפור' },
  { city: 'beit_shemesh', date: '2026-07-02', name: 'יז בתמוז' },
  { city: 'beit_shemesh', date: '2026-12-20', name: 'עשרה בטבת' }
];

for (const c of cases) {
  const res = debugFastExact(c.city, c.date, c.name);
  console.log(`>>> ${res.city} - ${res.rule} (${res.date}) <<<`);
  console.log(`  • שקיעה מישורית מדויקת:  ${res.sunset.local} (UTC: ${res.sunset.utc})`);
  console.log(`  • 6.45° (צאת צום 2net):    ${res.tzeit645.local} | דלתא: +${res.tzeit645.deltaMinutes} דקות (+${res.tzeit645.deltaSeconds} שניות)`);
  console.log(`  • 8.50° (מוצאי יו״כ 2net):   ${res.tzeit85.local} | דלתא: +${res.tzeit85.deltaMinutes} דקות (+${res.tzeit85.deltaSeconds} שניות)`);
  console.log(`  • 5.95° (אור החיים/שבת):   ${res.tzeit595.local} | דלתא: +${res.tzeit595.deltaMinutes} דקות`);
  console.log(`  • 7.083° (3 כוכבים):       ${res.tzeit7083.local} | דלתא: +${res.tzeit7083.deltaMinutes} דקות`);
  console.log(`  • חזון איש (+50ד):         ${res.chazonIsh.local}`);
  console.log(`  • רבנו תם (+72ד):          ${res.rt72.local}`);
  console.log('');
}
