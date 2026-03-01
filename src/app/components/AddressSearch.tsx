import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressSearchProps {
  label: string;
  value: string;
  onChange: (value: string, coords?: { lat: number; lon: number }) => void;
  placeholder?: string;
}

export function AddressSearch({ label, value, onChange, placeholder }: AddressSearchProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external value if it changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 3 || query === value) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
          { headers: { 'User-Agent': 'MooveApp/1.0' } }
        );
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Address search error:', error);
        // Silent fail or toast if needed, but keeping it clean for now
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (suggestion: Suggestion) => {
    const address = suggestion.display_name;
    const coords = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
    
    setQuery(address);
    setShowSuggestions(false);
    onChange(address, coords);
  };

  const handleClear = () => {
    setQuery('');
    onChange('', undefined);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-xs text-zinc-400 font-medium mb-1.5 block ml-1">{label}</label>
      <div className="relative group">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // If user clears input manually
            if (e.target.value === '') {
                onChange('', undefined);
            }
          }}
          onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder || "Search address..."}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
        />

        {loading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
        ) : query ? (
            <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        ) : null}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto divide-y divide-zinc-800/50">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors flex items-start gap-3 group/item"
              >
                <MapPin className="w-4 h-4 text-zinc-600 mt-0.5 group-hover/item:text-amber-500 transition-colors shrink-0" />
                <span className="text-sm text-zinc-300 line-clamp-2">
                  {suggestion.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
