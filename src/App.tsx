import React, { useEffect, useState, useMemo } from 'react';
import { FastEvent, FastPhase, CountdownTime } from './types';
import {
  CITIES,
  FAST_END_MESSAGES,
  canonicalFastKey,
  formatGregDateDisplay,
  formatTime,
  loadNextFast
} from './hebcalService';
import { FastModal } from './components/FastModal';
import { CitySelector } from './components/CitySelector';
import { Calendar, Loader2, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const CITY_STORAGE_KEY = 'fast-countdown-city';
const SITE_URL = 'https://the-end-of-the-fast.netlify.app/';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CITY_STORAGE_KEY);
      return saved && CITIES[saved] ? saved : 'jerusalem';
    } catch {
      return 'jerusalem';
    }
  });

  const [currentFast, setCurrentFast] = useState<FastEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHalachicDetails, setShowHalachicDetails] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: '0',
    hours: '--',
    minutes: '--',
    seconds: '--',
    totalDays: 0
  });
  const [phase, setPhase] = useState<FastPhase>('idle');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Load Fast Data when selectedCity changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setErrorMsg(null);

    loadNextFast(selectedCity)
      .then((fast) => {
        if (isCancelled) return;
        if (!fast) {
          setErrorMsg('לא נמצאו צומות קרובים');
          setCurrentFast(null);
        } else {
          setCurrentFast(fast);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error fetching fast data:', err);
        setErrorMsg('שגיאה בחיבור לזמני הצום. אנא נסה שוב.');
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  // Save selected city
  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey);
    try {
      localStorage.setItem(CITY_STORAGE_KEY, cityKey);
    } catch {
      // ignore
    }
  };

  // Determine current phase and tick countdown
  useEffect(() => {
    const updateCountdown = () => {
      if (!currentFast || !currentFast.start || !currentFast.end) {
        setTimeLeft({ days: '0', hours: '--', minutes: '--', seconds: '--', totalDays: 0 });
        setPhase('idle');
        return;
      }

      const now = new Date();
      let currentPhase: FastPhase = 'idle';

      if (now < currentFast.start) {
        currentPhase = 'before';
      } else if (now < currentFast.end) {
        currentPhase = 'during';
      } else {
        currentPhase = 'after';
      }

      setPhase(currentPhase);

      if (currentPhase === 'after') {
        setTimeLeft({ days: '0', hours: '00', minutes: '00', seconds: '00', totalDays: 0 });
        return;
      }

      const targetTime = currentPhase === 'before' ? currentFast.start : currentFast.end;
      let diff = targetTime.getTime() - now.getTime();
      if (diff < 0) diff = 0;

      const totalSeconds = Math.floor(diff / 1000);
      const totalDays = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        days: String(totalDays),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        totalDays
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentFast]);

  // Dynamic status banner & subtitle
  const { subtitle, bannerText, bannerType } = useMemo(() => {
    if (!currentFast) {
      return { subtitle: '', bannerText: null, bannerType: 'default' as const };
    }

    if (phase === 'before') {
      return {
        subtitle: 'ספירה לאחור לכניסת הצום',
        bannerText: null,
        bannerType: 'default' as const
      };
    }

    if (phase === 'during') {
      return {
        subtitle: 'ספירה לאחור ליציאת הצום',
        bannerText: 'צום קל ומועיל! 🙏',
        bannerType: 'during' as const
      };
    }

    if (phase === 'after') {
      const fastKey = currentFast.key || canonicalFastKey(currentFast.englishTitle || currentFast.title);
      const endMsg = FAST_END_MESSAGES[fastKey] || FAST_END_MESSAGES.default;
      return {
        subtitle: '',
        bannerText: endMsg.text,
        bannerType: endMsg.type
      };
    }

    return { subtitle: '', bannerText: null, bannerType: 'default' as const };
  }, [currentFast, phase]);

  const cityName = CITIES[selectedCity]?.displayName || 'ירושלים';
  const tzid = currentFast?.tzid || CITIES[selectedCity]?.tzid || 'Asia/Jerusalem';

  const fastTitle = currentFast?.title || 'הצום הבא';
  const fastHebrewDate = currentFast?.hebrewDate || currentFast?.hdate || '';
  const fastGregDate = currentFast ? formatGregDateDisplay(currentFast.gregDate) : '';

  const details = currentFast?.details;
  const ci50 = details?.tzeitChazonIsh50Min;
  const rt72f = details?.rabbeinuTam72Fixed;
  const rt72z = details?.rabbeinuTam72Zmaniyot;

  // Share message
  const generateShareText = () => {
    const lines = [
      `⏳ ספירה לאחור ל${fastTitle}`,
      phase === 'during' ? 'הצום בעיצומו — צום קל! 🙏' : phase === 'after' ? bannerText : '',
      `📍 עיר: ${cityName}`,
      fastHebrewDate ? `📅 תאריך: ${fastHebrewDate} (${fastGregDate})` : `📅 תאריך: ${fastGregDate}`,
      `🌅 כניסת הצום: ${formatTime(currentFast?.start, tzid)} (${currentFast?.startLabel || 'עלות השחר'})`,
      `🌙 יציאת הצום: ${formatTime(currentFast?.end, tzid)}`,
      ci50 ? `📖 חזון איש (50 דק׳): ${formatTime(ci50, tzid)}` : '',
      rt72f ? `🕯️ רבנו תם (72 דק׳): ${formatTime(rt72f, tzid)}` : '',
      `🔗 ${SITE_URL}`
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${text}`,
      '_blank'
    );
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-3 sm:p-6 md:p-8 pb-14 sm:pb-16 relative bg-slate-950 text-slate-100 overflow-x-hidden select-none"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 15%, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)`
      }}
      dir="rtl"
    >
      {/* Decorative ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Center Main Stage / Hero Card */}
      <main className="relative z-10 w-full max-w-3xl my-auto flex flex-col items-center justify-center pt-2 sm:pt-4">
        <div className="w-full bg-white rounded-3xl sm:rounded-[36px] shadow-2xl shadow-black/60 p-5 sm:p-10 md:p-12 text-center text-slate-800 border border-white/40 backdrop-blur-xl transition-all">
          {/* Fast Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-indigo-950 tracking-tight mb-2 font-['Varela_Round']">
            {isLoading ? 'טוען זמני צום...' : phase === 'after' ? `${fastTitle} הסתיים` : fastTitle}
          </h1>

          {/* Subtitle / City & Date */}
          <p className="text-sm sm:text-lg text-slate-500 font-medium mb-3">
            {isLoading ? 'רגע אחד...' : `${cityName} · ${fastHebrewDate || fastGregDate}`}
          </p>

          {/* Status Subtitle banner */}
          {subtitle && (
            <div className="inline-block text-base sm:text-2xl font-black text-teal-700 mb-3 tracking-wide">
              {subtitle}
            </div>
          )}

          {/* Alert / Celebration Banner */}
          {bannerText && (
            <div
              className={`w-full p-3 sm:p-4 rounded-2xl font-bold text-base sm:text-lg mb-4 sm:mb-6 transition-all ${
                bannerType === 'celebration'
                  ? 'bg-amber-100/90 text-amber-950 border-2 border-amber-300 shadow-sm'
                  : bannerType === 'during'
                  ? 'bg-teal-50 text-teal-900 border-2 border-teal-300 shadow-sm'
                  : 'bg-indigo-50 text-indigo-950 border-2 border-indigo-200 shadow-sm'
              }`}
            >
              {bannerText}
            </div>
          )}

          {/* Date Tag */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-semibold text-slate-600 mb-4 bg-slate-100/90 py-1.5 px-4 rounded-full w-fit mx-auto border border-slate-200 shadow-sm">
            <span className="font-bold text-indigo-950">{fastHebrewDate || '—'}</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-700">
              {currentFast?.dateDisplay || fastGregDate || '—'}
            </span>
          </div>

          {/* Center Custom City Selector */}
          <div className="mb-4 flex flex-col items-center justify-center">
            <CitySelector selectedCity={selectedCity} onSelectCity={handleCityChange} />
          </div>

          {/* Main State Handler */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
              <span className="text-slate-600 font-semibold text-base">מחשב זמנים הלכתיים מדויקים...</span>
            </div>
          ) : errorMsg ? (
            <div className="py-8 text-red-600 font-bold text-lg">{errorMsg}</div>
          ) : (
            <>
              {/* Massive Modern Countdown Display */}
              {phase !== 'after' && (
                <div
                  className="flex items-center justify-center gap-1.5 sm:gap-3 my-3 sm:my-6 text-indigo-950 select-none flex-wrap"
                  dir="ltr"
                >
                  {/* Days (if > 0) */}
                  {timeLeft.totalDays > 0 && (
                    <>
                      <div className="flex flex-col items-center bg-indigo-50/60 hover:bg-indigo-50 transition p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-indigo-100/80 min-w-[64px] sm:min-w-[100px] md:min-w-[120px]">
                        <span className="text-3xl sm:text-6xl md:text-7xl tracking-tight font-black bg-gradient-to-b from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                          {timeLeft.days}
                        </span>
                        <span className="text-[11px] sm:text-sm font-bold text-slate-500 mt-1 uppercase">ימים</span>
                      </div>
                      <span className="text-xl sm:text-4xl md:text-5xl text-teal-600 -translate-y-2 sm:-translate-y-3 font-bold select-none">:</span>
                    </>
                  )}

                  {/* Hours */}
                  <div className="flex flex-col items-center bg-indigo-50/60 hover:bg-indigo-50 transition p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-indigo-100/80 min-w-[64px] sm:min-w-[100px] md:min-w-[120px]">
                    <span className="text-3xl sm:text-6xl md:text-7xl tracking-tight font-black bg-gradient-to-b from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-500 mt-1 uppercase">שעות</span>
                  </div>

                  <span className="text-xl sm:text-4xl md:text-5xl text-teal-600 -translate-y-2 sm:-translate-y-3 font-bold select-none">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center bg-indigo-50/60 hover:bg-indigo-50 transition p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-indigo-100/80 min-w-[64px] sm:min-w-[100px] md:min-w-[120px]">
                    <span className="text-3xl sm:text-6xl md:text-7xl tracking-tight font-black bg-gradient-to-b from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-500 mt-1 uppercase">דקות</span>
                  </div>

                  <span className="text-xl sm:text-4xl md:text-5xl text-teal-600 -translate-y-2 sm:-translate-y-3 font-bold select-none">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center bg-indigo-50/60 hover:bg-indigo-50 transition p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-indigo-100/80 min-w-[64px] sm:min-w-[100px] md:min-w-[120px]">
                    <span className="text-3xl sm:text-6xl md:text-7xl tracking-tight font-black text-teal-600">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-500 mt-1 uppercase">שניות</span>
                  </div>
                </div>
              )}

              {/* Structured Halachic Times: 3 distinct clear cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 bg-gradient-to-br from-indigo-50/90 via-white/80 to-teal-50/60 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-indigo-100/90 my-4 sm:my-5 shadow-sm">
                {/* 1. Fast Start */}
                <div className="p-2 sm:p-2.5 flex flex-col items-center justify-center bg-white/70 rounded-xl border border-slate-200/50">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 mb-0.5">כניסת הצום</span>
                  <strong className="text-base sm:text-xl text-indigo-950 font-black">
                    {formatTime(currentFast?.start, tzid)}
                  </strong>
                  <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                    {currentFast?.startLabel || 'עלות השחר'}
                  </span>
                </div>

                {/* 2. Fast End (Default) */}
                <div className="p-2 sm:p-2.5 flex flex-col items-center justify-center bg-teal-50/80 rounded-xl border-2 border-teal-400/80 shadow-sm">
                  <span className="text-[11px] sm:text-xs font-black text-teal-950 mb-0.5">יציאת הצום (ברירת מחדל)</span>
                  <strong className="text-xl sm:text-2xl text-teal-700 font-black">
                    {formatTime(currentFast?.end, tzid)}
                  </strong>
                  <span className="text-[10px] font-bold text-teal-700 mt-0.5">
                    {currentFast?.fastType === 'yomkippur' ? 'מוצאי יו״כ (8.5°)' : 'גאונים (6.45°)'}
                  </span>
                </div>

                {/* 3. Rabbeinu Tam (72 min) */}
                <div className="p-2 sm:p-2.5 flex flex-col items-center justify-center bg-white/70 rounded-xl border border-slate-200/50">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-600 mb-0.5">רבנו תם</span>
                  <strong className="text-base sm:text-xl text-indigo-950 font-black">
                    {formatTime(rt72f, tzid)}
                  </strong>
                  <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                    (72 דק׳ קבועות)
                  </span>
                </div>
              </div>

              {/* Collapsible Halachic & Astronomical Layer Details */}
              <div className="mb-4 text-right">
                <button
                  type="button"
                  onClick={() => setShowHalachicDetails(!showHalachicDetails)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 hover:bg-indigo-50/60 rounded-xl text-xs font-bold text-indigo-950 border border-indigo-100/80 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-600" />
                    <span>פירוט שיטות החישוב והשכבה האסטרונומית לצום זה</span>
                  </div>
                  {showHalachicDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showHalachicDetails && (
                  <div className="mt-2 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-indigo-100 text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                    <div>
                      <div className="font-bold text-indigo-950 mb-1">שכבה אסטרונומית (מתחת לאופק):</div>
                      <p className="text-slate-600 leading-relaxed">
                        • שקיעה מישורית: <strong>{formatTime(details?.sunsetGeometric, tzid)}</strong><br />
                        • שקיעת השמש 6.45° (צאת צום 2net): <strong>{formatTime(details?.tzeitFast2net6Pt45Deg, tzid)}</strong><br />
                        • שקיעת השמש 8.5° (מוצאי יו״כ 2net): <strong>{formatTime(details?.tzeitYomKippur2net8Pt5Deg, tzid)}</strong><br />
                        • שיטת אור החיים: <strong>{formatTime(details?.tzeitShabbatOrHaChaim, tzid)}</strong>
                      </p>
                    </div>

                    <div>
                      <div className="font-bold text-indigo-950 mb-1">כניסת הצום:</div>
                      <p className="text-slate-600 leading-relaxed">
                        • הגדרה: <strong>{currentFast?.startLabel}</strong><br />
                        • נוסחה: <strong>{currentFast?.startMethodDesc}</strong><br />
                        • 16.1° (זמניות): <strong>{formatTime(details?.alos16Point1Deg, tzid)}</strong><br />
                        • 72 דק׳ קבועות: <strong>{formatTime(details?.alos72Fixed, tzid)}</strong>
                      </p>
                    </div>

                    <div>
                      <div className="font-bold text-indigo-950 mb-1">יציאת הצום וחומרות:</div>
                      <p className="text-slate-600 leading-relaxed">
                        • עיקר הדין (ברירת מחדל): <strong>{formatTime(currentFast?.end, tzid)}</strong><br />
                        • ר״ת 72ד׳ קבועות: <strong>{formatTime(rt72f, tzid)}</strong><br />
                        • ר״ת 72ד׳ זמניות: <strong>{formatTime(rt72z, tzid)}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Full calendar & Shares */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-teal-600 to-indigo-900 hover:from-teal-500 hover:to-indigo-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-950/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  כל זמני הצומות
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 sm:flex-none px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="שתף בוואטסאפ"
                  >
                    <span>📱</span>
                    שתף בוואטסאפ
                  </button>
                  <button
                    onClick={handleShareFacebook}
                    className="flex-1 sm:flex-none px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="שתף בפייסבוק"
                  >
                    <span>📘</span>
                    שתף בפייסבוק
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Yearly Fast Modal */}
      <FastModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cityKey={selectedCity}
        initialYear={currentFast?.end ? currentFast.end.getFullYear() : new Date().getFullYear()}
      />

      {/* Fixed Clean Footer */}
      <footer className="w-full fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs sm:text-sm font-medium py-2 text-center border-t border-slate-800 z-40 flex items-center justify-center gap-2 sm:gap-3">
        <span>קרדיט: מ בלומי</span>
        <span className="text-slate-600">|</span>
        <a href="tel:0515157166" className="text-slate-200 hover:text-teal-300 transition">
          0515157166
        </a>
        <span className="text-slate-600">|</span>
        <a
          href="https://m-blumi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-400 hover:text-teal-300 font-bold hover:underline"
        >
          m-blumi.com
        </a>
      </footer>
    </div>
  );
}

