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
    <div className="relative w-full max-w-[270px] sm:max-w-xs mx-auto" ref={containerRef} dir="rtl">
      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group relative flex items-center justify-between gap-2.5 bg-gradient-to-b from-slate-50 to-indigo-50/50 hover:from-white hover:to-indigo-50 border-2 border-indigo-900/15 hover:border-teal-500 rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-1.5 sm:py-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-teal-500/15 text-teal-700 group-hover:bg-teal-500 group-hover:text-white transition-colors">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-slate-400 leading-none mb-0.5">
              עיר:
            </span>
            <span className="text-sm sm:text-base font-black text-indigo-950">
              {currentCity.displayName}
            </span>
          </div>
        </div>

        <div className="p-0.5 rounded-md text-indigo-800 bg-indigo-100/50 group-hover:bg-teal-100 transition">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-700' : ''}`}
          />
        </div>
      </button>

      {/* Floating Centered Dropdown Panel - Perfectly positioned without shifting layout */}
      {isOpen && (
        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-[90vw] max-w-[340px] max-h-[380px] sm:max-h-[420px] bg-white rounded-2xl shadow-2xl border border-indigo-100/90 z-50 flex flex-col p-2.5 sm:p-3 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
          {/* Header & Search */}
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש עיר בישראל..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-8 py-2 text-xs sm:text-sm font-semibold text-indigo-950 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Section Indicator */}
          <div className="flex items-center justify-between px-1 py-1 text-[11px] font-bold text-slate-400">
            <span>
              {searchQuery
                ? `תוצאות (${filteredCities.length})`
                : showAllCities
                ? `כל הערים (${allCityEntries.length})`
                : 'ערים מרכזיות'}
            </span>
            {!searchQuery && !showAllCities && (
              <button
                type="button"
                onClick={() => setShowAllCities(true)}
                className="text-teal-700 hover:text-teal-900 flex items-center gap-0.5 font-extrabold hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                כל ערי ישראל
              </button>
            )}
          </div>

          {/* Cities List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 pl-0.5 max-h-[240px] overscroll-contain">
            {filteredCities.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-right cursor-pointer min-h-[38px] ${
                      isSelected
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{meta.displayName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                        {meta.elevationM} מ׳
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom Show More / Less button */}
          {!searchQuery && !showAllCities && (
            <div className="pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => setShowAllCities(true)}
                className="w-full py-1.5 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Globe2 className="w-3 h-3 text-teal-600" />
                הצג עוד ערים ויישובים בישראל...
              </button>
            </div>
          )}

          {!searchQuery && showAllCities && (
            <div className="pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => setShowAllCities(false)}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center cursor-pointer"
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
