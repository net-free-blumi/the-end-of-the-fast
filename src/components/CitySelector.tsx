import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CITIES } from '../hebcalService';
import { MapPin, Search, ChevronDown, Check, Plus, Globe2, X } from 'lucide-react';

interface CitySelectorProps {
  selectedCity: string;
  onSelectCity: (cityKey: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onSelectCity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentCity = CITIES[selectedCity] || CITIES.jerusalem;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search on open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const allCityEntries = useMemo(() => Object.entries(CITIES), []);

  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      if (showAllCities) {
        return allCityEntries;
      }
      return allCityEntries.filter(([, meta]) => meta.popular);
    }
    return allCityEntries.filter(([, meta]) =>
      meta.displayName.toLowerCase().includes(q)
    );
  }, [searchQuery, showAllCities, allCityEntries]);

  const handleSelect = (key: string) => {
    onSelectCity(key);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative inline-block my-2" ref={containerRef} dir="rtl">
      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-between gap-3 bg-gradient-to-b from-slate-50 to-indigo-50/50 hover:from-white hover:to-indigo-50 border-2 border-indigo-900/20 hover:border-teal-500 rounded-2xl px-5 sm:px-7 py-2.5 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer min-w-[240px] sm:min-w-[300px]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-teal-500/15 text-teal-700 group-hover:bg-teal-500 group-hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-400 leading-none mb-0.5">
              עיר נוכחית:
            </span>
            <span className="text-base sm:text-xl font-black text-indigo-950">
              {currentCity.displayName}
            </span>
          </div>
        </div>

        <div className="p-1 rounded-lg text-indigo-800 bg-indigo-100/50 group-hover:bg-teal-100 transition">
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-700' : ''}`}
          />
        </div>
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 left-0 sm:left-auto sm:right-1/2 sm:translate-x-1/2 w-[92vw] sm:w-[380px] max-h-[440px] bg-white rounded-2xl shadow-2xl border border-indigo-100/80 z-50 flex flex-col p-3 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
          {/* Header & Search */}
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש עיר בישראל..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-8 py-2 text-sm font-semibold text-indigo-950 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Section Indicator */}
          <div className="flex items-center justify-between px-1 py-1 text-xs font-bold text-slate-400">
            <span>
              {searchQuery
                ? `תוצאות חיפוש (${filteredCities.length})`
                : showAllCities
                ? `כל ערי ישראל (${allCityEntries.length})`
                : 'ערים מרכזיות'}
            </span>
            {!searchQuery && !showAllCities && (
              <button
                type="button"
                onClick={() => setShowAllCities(true)}
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-extrabold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                הצג את כל הערים
              </button>
            )}
          </div>

          {/* Cities List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 pl-0.5 max-h-[290px] overscroll-contain">
            {filteredCities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm font-medium">
                לא נמצאה עיר תואמת ל-&quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredCities.map(([key, meta]) => {
                const isSelected = key === selectedCity;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-right cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                      <span>{meta.displayName}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Show More toggle button at bottom if collapsed */}
          {!searchQuery && !showAllCities && (
            <div className="pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => setShowAllCities(true)}
                className="w-full py-2 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                הצג עוד ערים ויישובים בישראל...
              </button>
            </div>
          )}

          {/* Show Less button if expanded */}
          {!searchQuery && showAllCities && (
            <div className="pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => setShowAllCities(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center cursor-pointer"
              >
                הצג רק ערים מרכזיות
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
