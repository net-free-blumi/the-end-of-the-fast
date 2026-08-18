import React, { useEffect, useState } from 'react';
import { FastEvent } from '../types';
import { CITIES, formatGregDateDisplay, formatTime, getYearlyFasts } from '../hebcalService';
import { Calendar, X, Loader2, Sparkles, ChevronDown, ChevronUp, Info, Clock } from 'lucide-react';

interface FastModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityKey: string;
  initialYear: number;
}

export const FastModal: React.FC<FastModalProps> = ({ isOpen, onClose, cityKey, initialYear }) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [fasts, setFasts] = useState<FastEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const cityName = CITIES[cityKey]?.displayName || 'ירושלים';

  useEffect(() => {
    if (isOpen) {
      setSelectedYear(initialYear);
    }
  }, [isOpen, initialYear]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    getYearlyFasts(cityKey, selectedYear)
      .then((data) => {
        if (isMounted) {
          setFasts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('שגיאה בטעינת נתוני הצומות לשנה זו');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, cityKey, selectedYear]);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = [];
  for (let y = currentYear - 2; y <= currentYear + 20; y++) {
    yearOptions.push(y);
  }

  const toggleRow = (key: string) => {
    setExpandedRow((prev) => (prev === key ? null : key));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative w-full max-w-4xl max-h-[94vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col p-3.5 sm:p-6 md:p-7 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl sm:rounded-2xl">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-indigo-950">לוח כל הצומות</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                עיר: <span className="font-bold text-indigo-900">{cityName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="סגור חלון"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Controls & Method Notice */}
        <div className="flex items-center justify-between gap-2 py-2.5 flex-wrap border-b border-slate-100">
          <div className="flex items-center gap-2">
            <label htmlFor="modal-year-select" className="text-xs sm:text-sm font-bold text-indigo-950">
              שנה:
            </label>
            <select
              id="modal-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl px-2.5 py-1 outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-600 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
            <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
            <span>הפרדה מלאה בין עיקר הדין (גאונים) ורבנו תם (72 דק׳).</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-indigo-100 shadow-inner my-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-indigo-900 gap-2.5">
              <Loader2 className="w-7 h-7 animate-spin text-teal-500" />
              <p className="text-sm font-semibold">טוען זמני צומות...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 font-semibold text-sm">{error}</div>
          ) : fasts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-medium text-sm">לא נמצאו צומות לשנה זו.</div>
          ) : (
            <>
              {/* Mobile Card-Based View (Optimized for Phones) */}
              <div className="block md:hidden p-2 space-y-2.5">
                {fasts.map((f) => {
                  const tzid = f.tzid || CITIES[cityKey]?.tzid || 'Asia/Jerusalem';
                  const rowId = `${f.key}-${f.gregDate}`;
                  const isExpanded = expandedRow === rowId;
                  const rt72f = f.details?.rabbeinuTam72Fixed;

                  return (
                    <div
                      key={rowId}
                      className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 shadow-sm"
                    >
                      {/* Fast Title & Dates */}
                      <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                        <div>
                          <h3 className="text-sm font-black text-indigo-950">{f.title}</h3>
                          <div className="text-[11px] font-semibold text-indigo-800 mt-0.5">
                            {f.hebrewDate}
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {formatGregDateDisplay(f.gregDate)}
                        </span>
                      </div>

                      {/* 3 Clear Fast Times */}
                      <div className="grid grid-cols-3 gap-1.5 text-center my-2">
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                          <span className="block text-[9px] font-bold text-slate-500">כניסה</span>
                          <strong className="text-xs font-black text-indigo-950">
                            {formatTime(f.start, tzid)}
                          </strong>
                        </div>

                        <div className="bg-teal-50 p-1.5 rounded-lg border-2 border-teal-400">
                          <span className="block text-[9px] font-black text-teal-900">יציאה</span>
                          <strong className="text-xs font-black text-teal-700">
                            {formatTime(f.end, tzid)}
                          </strong>
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                          <span className="block text-[9px] font-bold text-slate-600">רבנו תם</span>
                          <strong className="text-xs font-black text-indigo-950">
                            {formatTime(rt72f, tzid)}
                          </strong>
                        </div>
                      </div>

                      {/* Halachic Expansion Button */}
                      <button
                        type="button"
                        onClick={() => toggleRow(rowId)}
                        className="w-full mt-1.5 py-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center justify-center gap-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
                      >
                        <Info className="w-3 h-3 text-teal-600" />
                        <span>{isExpanded ? 'הסתר פירוט אסטרונומי' : 'הצג פירוט שיטות הלכתיות'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && f.details && (
                        <div className="mt-2 p-2 bg-indigo-50/70 rounded-lg text-[10px] text-slate-700 leading-relaxed border border-indigo-100">
                          <div className="font-bold text-indigo-950 mb-0.5">• כניסה: {f.startLabel} ({f.startMethodDesc})</div>
                          <div className="font-bold text-teal-950 mb-0.5">• שקיעה: {formatTime(f.details.sunsetGeometric, tzid)} | צאת צום (6.45°): {formatTime(f.details.tzeitFast2net6Pt45Deg, tzid)}</div>
                          <div className="text-slate-600">• ר״ת 72ד׳ קבועות: {formatTime(f.details.rabbeinuTam72Fixed, tzid)} | ר״ת זמניות: {formatTime(f.details.rabbeinuTam72Zmaniyot, tzid)}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Full Table View */}
              <table className="hidden md:table w-full text-right border-collapse text-xs">
                <thead className="sticky top-0 bg-indigo-50/95 backdrop-blur-md text-indigo-950 font-bold border-b border-indigo-200">
                  <tr>
                    <th className="p-3">שם הצום</th>
                    <th className="p-3">תאריך עברי / לועזי</th>
                    <th className="p-3">כניסה</th>
                    <th className="p-3 bg-teal-50 text-teal-950 font-black">יציאה (ברירת מחדל)</th>
                    <th className="p-3">רבנו תם (72ד׳)</th>
                    <th className="p-3 text-center">פרטים</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fasts.map((f) => {
                    const tzid = f.tzid || CITIES[cityKey]?.tzid || 'Asia/Jerusalem';
                    const rowId = `${f.key}-${f.gregDate}`;
                    const isExpanded = expandedRow === rowId;
                    const rt72f = f.details?.rabbeinuTam72Fixed;

                    return (
                      <React.Fragment key={rowId}>
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-bold text-indigo-950">{f.title}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{f.hebrewDate}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {formatGregDateDisplay(f.gregDate)}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-indigo-900">
                            {formatTime(f.start, tzid)}
                            <div className="text-[10px] text-slate-500 font-normal">{f.startLabel}</div>
                          </td>
                          <td className="p-3 bg-teal-50/50 font-black text-teal-700 text-sm">
                            {formatTime(f.end, tzid)}
                            <div className="text-[10px] text-teal-800 font-normal">{f.endLabel}</div>
                          </td>
                          <td className="p-3 font-bold text-indigo-950">
                            {formatTime(rt72f, tzid)}
                            <div className="text-[10px] text-slate-500 font-normal">72 דק׳ קבועות</div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleRow(rowId)}
                              className="p-1 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                              title="הצג פירוט שיטות חישוב"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && f.details && (
                          <tr className="bg-indigo-50/40">
                            <td colSpan={6} className="p-3">
                              <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-700 p-2 bg-white rounded-xl border border-indigo-100">
                                <div>
                                  <div className="font-bold text-indigo-950">שקיעה ואופק:</div>
                                  <div>שקיעה: <strong>{formatTime(f.details.sunsetGeometric, tzid)}</strong></div>
                                  <div>שקיעה 6.45° (2net): <strong>{formatTime(f.details.tzeitFast2net6Pt45Deg, tzid)}</strong></div>
                                </div>
                                <div>
                                  <div className="font-bold text-indigo-950">כניסת הצום:</div>
                                  <div>נוסחה: {f.startMethodDesc}</div>
                                  <div>עלות 16.1°: <strong>{formatTime(f.details.alos16Point1Deg, tzid)}</strong></div>
                                </div>
                                <div>
                                  <div className="font-bold text-indigo-950">רבנו תם:</div>
                                  <div>72ד׳ קבועות: <strong>{formatTime(f.details.rabbeinuTam72Fixed, tzid)}</strong></div>
                                  <div>72ד׳ זמניות: <strong>{formatTime(f.details.rabbeinuTam72Zmaniyot, tzid)}</strong></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
