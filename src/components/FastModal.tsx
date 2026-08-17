import React, { useEffect, useState } from 'react';
import { FastEvent } from '../types';
import { CITIES, formatGregDateDisplay, formatTime, getYearlyFasts } from '../hebcalService';
import { Calendar, X, Loader2, Sparkles, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-5 sm:p-8 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-950">כל זמני הצומות המדויקים</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                עיר: <span className="font-bold text-indigo-900">{cityName}</span> · מחושב לפי שכבה אסטרונומית ושיטות הפוסקים
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="סגור חלון"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls & Method Notice */}
        <div className="flex items-center justify-between gap-4 py-3 flex-wrap border-b border-slate-100/80">
          <div className="flex items-center gap-2">
            <label htmlFor="modal-year-select" className="text-sm font-bold text-indigo-950">
              בחר שנה:
            </label>
            <select
              id="modal-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-indigo-50/70 border border-indigo-200 text-indigo-950 font-bold text-sm sm:text-base rounded-xl px-3.5 py-1.5 outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>הפרדה מלאה בין עיקר הדין (גאונים / 2net) ורבנו תם (72 דק׳).</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-indigo-100 shadow-inner my-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-900 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <p className="text-base font-semibold">טוען זמני צומות...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-600 font-semibold">{error}</div>
          ) : fasts.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-medium">לא נמצאו צומות לשנה זו.</div>
          ) : (
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead className="sticky top-0 bg-indigo-50/95 backdrop-blur-md text-indigo-950 font-bold border-b border-indigo-200 text-[11px] sm:text-xs">
                <tr>
                  <th className="p-2.5 sm:p-3.5">שם הצום</th>
                  <th className="p-2.5 sm:p-3.5">תאריך</th>
                  <th className="p-2.5 sm:p-3.5">כניסה</th>
                  <th className="p-2.5 sm:p-3.5 bg-teal-50/60 text-teal-950 font-black">יציאה (ברירת מחדל)</th>
                  <th className="p-2.5 sm:p-3.5">רבנו תם (72ד׳)</th>
                  <th className="p-2.5 sm:p-3.5 text-center">פרטים</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fasts.map((f) => {
                  const tzid = f.tzid || CITIES[cityKey]?.tzid || 'Asia/Jerusalem';
                  const rowId = `${f.key}-${f.gregDate}`;
                  const isExpanded = expandedRow === rowId;

                  const shkiah = f.details?.sunsetGeometric;
                  const alos16 = f.details?.alos16Point1Deg;
                  const alos72f = f.details?.alos72Fixed;
                  const rt72f = f.details?.rabbeinuTam72Fixed;
                  const rt72z = f.details?.rabbeinuTam72Zmaniyot;

                  return (
                    <React.Fragment key={rowId}>
                      <tr
                        className={`hover:bg-teal-50/30 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-indigo-50/40' : ''
                        }`}
                        onClick={() => toggleRow(rowId)}
                      >
                        <td className="p-2.5 sm:p-3.5">
                          <div className="font-bold text-indigo-950 text-xs sm:text-sm">{f.title}</div>
                          {f.is25Hour && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                              ~25 שעות
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 sm:p-3.5 text-slate-700 font-medium">
                          <div>{f.dateDisplay || formatGregDateDisplay(f.gregDate)}</div>
                          <div className="text-[11px] text-slate-500">{f.hebrewDate || f.hdate}</div>
                        </td>
                        <td className="p-2.5 sm:p-3.5">
                          <div className="font-black text-slate-950 text-xs sm:text-sm">
                            {formatTime(f.start, tzid)}
                          </div>
                          {f.startLabel && (
                            <div className="text-[10px] text-slate-500 font-medium">{f.startLabel}</div>
                          )}
                        </td>
                        <td className="p-2.5 sm:p-3.5 bg-teal-50/30">
                          <div className="font-black text-teal-800 text-xs sm:text-sm">
                            {formatTime(f.end, tzid)}
                          </div>
                          <div className="text-[10px] text-teal-700 font-medium">
                            {f.fastType === 'yomkippur' ? 'מוצאי יו״כ (8.5°)' : 'צאת צום (6.45°)'}
                          </div>
                        </td>
                        <td className="p-2.5 sm:p-3.5 text-slate-700 font-semibold text-xs sm:text-sm">
                          <div>{formatTime(rt72f, tzid)}</div>
                          <div className="text-[10px] text-slate-500">זמניות: {formatTime(rt72z, tzid)}</div>
                        </td>
                        <td className="p-2.5 sm:p-3.5 text-center">
                          <button
                            type="button"
                            className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-700 transition cursor-pointer"
                            title="הצג פירוט שיטות מלא"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Halachic & Astronomical Layer Details */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-y border-indigo-100">
                          <td colSpan={6} className="p-3 sm:p-4 text-xs text-slate-700">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
                              <div>
                                <div className="font-bold text-indigo-950 flex items-center gap-1 mb-1">
                                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>שכבה אסטרונומית (מתחת לאופק):</span>
                                </div>
                                <ul className="space-y-0.5 text-slate-600">
                                  <li>
                                    • שקיעה מישורית: <span className="font-bold">{formatTime(shkiah, tzid)}</span>
                                  </li>
                                  <li>
                                    • שקיעת השמש 6.45°: <span className="font-bold">{formatTime(f.details?.tzeitFast2net6Pt45Deg, tzid)}</span>
                                  </li>
                                  <li>
                                    • שקיעת השמש 8.5°: <span className="font-bold">{formatTime(f.details?.tzeitYomKippur2net8Pt5Deg, tzid)}</span>
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <div className="font-bold text-indigo-950 mb-1">שיטות עלות השחר:</div>
                                <ul className="space-y-0.5 text-slate-600">
                                  <li>
                                    • 16.1° (72 דק׳ זמניות): <span className="font-bold">{formatTime(alos16, tzid)}</span>
                                  </li>
                                  <li>
                                    • 72 דקות קבועות: <span className="font-bold">{formatTime(alos72f, tzid)}</span>
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <div className="font-bold text-indigo-950 mb-1">יציאת הצום ושיטות הפוסקים:</div>
                                <ul className="space-y-0.5 text-slate-600">
                                  <li>
                                    • ברירת מחדל (לוח 2net): <span className="font-bold text-teal-700">{formatTime(f.end, tzid)}</span>
                                  </li>
                                  <li>
                                    • רבנו תם (72 דק׳ קבועות): <span className="font-bold">{formatTime(rt72f, tzid)}</span>
                                  </li>
                                  <li>
                                    • רבנו תם (72 דק׳ זמניות): <span className="font-bold">{formatTime(rt72z, tzid)}</span>
                                  </li>
                                </ul>
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
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <div>* לחץ על שורת צום כדי להציג את כל הזוויות והשיטות המדויקות</div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

