import * as KosherZmanim from 'kosher-zmanim';
import { CITIES } from './hebcalService';

function runExactDebugForCity(cityKey: string) {
  const city = CITIES[cityKey];
  const loc = new KosherZmanim.GeoLocation(city.displayName, city.latitude, city.longitude, city.elevation || 0, city.tzid);
  const z = new KosherZmanim.ComplexZmanimCalendar(loc);

  const dates = [
    { name: 'צום גדליה', date: '2026-09-14' },
    { name: 'יום כיפור', date: '2026-09-21' }
  ];

  console.log(`========================================================================`);
  console.log(`>>> ${city.displayName} (Lat: ${city.latitude}, Lng: ${city.longitude}, Elevation: ${city.elevation || 0}m) <<<`);
  console.log(`========================================================================`);

  for (const item of dates) {
    const dt = KosherZmanim.DateTime.fromISO(`${item.date}T12:00:00`, { zone: city.tzid });
    z.setDate(dt);

    const sunset = z.getSeaLevelSunset().toJSDate();
    const tzeit595 = z.getTzaisGeonim5Point95Degrees()?.toJSDate();
    const tzeit645 = z.getTzaisGeonim6Point45Degrees()?.toJSDate();
    const tzeit7083 = z.getTzaisGeonim7Point083Degrees()?.toJSDate();
    const tzeit85 = z.getTzaisGeonim8Point5Degrees()?.toJSDate();
    const ci50 = new Date(sunset.getTime() + 50 * 60000);
    const rt72 = new Date(sunset.getTime() + 72 * 60000);

    const fmtLocal = (d: Date | undefined) => {
      if (!d) return 'N/A';
      return new Intl.DateTimeFormat('he-IL', {
        timeZone: city.tzid,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(d) + '.' + String(d.getMilliseconds()).padStart(3, '0');
    };

    const deltaSec = (d1: Date, d2: Date) => ((d2.getTime() - d1.getTime()) / 1000).toFixed(1);
    const deltaMin = (d1: Date, d2: Date) => ((d2.getTime() - d1.getTime()) / 60000).toFixed(3);

    console.log(`\n📅 ${item.name} (${item.date}):`);
    console.log(`   • שקיעה מישורית:         ${fmtLocal(sunset)} (UTC: ${sunset.toISOString()})`);
    console.log(`   • 5.95° (אור החיים/שבת):  ${fmtLocal(tzeit595)} [דלתא: +${deltaMin(sunset, tzeit595!)} דק׳ / +${deltaSec(sunset, tzeit595!)} שנ׳]`);
    console.log(`   • 6.45° (צאת צום 2net):   ${fmtLocal(tzeit645)} [דלתא: +${deltaMin(sunset, tzeit645!)} דק׳ / +${deltaSec(sunset, tzeit645!)} שנ׳]`);
    console.log(`   • 7.083° (3 כוכבים):      ${fmtLocal(tzeit7083)} [דלתא: +${deltaMin(sunset, tzeit7083!)} דק׳ / +${deltaSec(sunset, tzeit7083!)} שנ׳]`);
    console.log(`   • 8.50° (מוצאי יו״כ 2net): ${fmtLocal(tzeit85)} [דלתא: +${deltaMin(sunset, tzeit85!)} דק׳ / +${deltaSec(sunset, tzeit85!)} שנ׳]`);
    console.log(`   • חזון איש (שקיעה+50ד׳):  ${fmtLocal(ci50)}`);
    console.log(`   • רבנו תם (שקיעה+72ד׳):   ${fmtLocal(rt72)}`);
  }
  console.log('\n');
}

runExactDebugForCity('beit_shemesh');
runExactDebugForCity('jerusalem');
