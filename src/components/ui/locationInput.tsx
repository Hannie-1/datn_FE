"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "./input";

export interface LocationResult {
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  value: LocationResult | null;
  placeholder?: string;
  onSelect: (location: LocationResult) => void;
}

function useDebounce(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function LocationInput({
  value,
  placeholder,
  onSelect,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(inputValue);
  const cacheRef = useRef<Record<string, LocationResult[]>>({});
  const activeQueryRef = useRef(""); // ⭐ chặn kết quả cũ
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Sync value từ parent
   */
  useEffect(() => {
    if (value?.name) {
      setInputValue(value.name);
      setResults([]);
    }
  }, [value]);

  /**
   * Fetch location
   */
  useEffect(() => {
    const query = debouncedQuery.trim().toLowerCase();

    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    // đánh dấu query đang active
    activeQueryRef.current = query;
    setLoading(true);
    setResults([]); //clear kết quả cũ NGAY

    // cache hit
    if (cacheRef.current[query]) {
      setResults(cacheRef.current[query]);
      setOpen(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            query
          )}&limit=5&lat=21.0278&lon=105.8342`,
          { signal: controller.signal }
        );

        const data = await res.json();
        if (!data?.features) return;

        if (activeQueryRef.current !== query) return;

        const locations: LocationResult[] = data.features.map((item: any) => ({
          name:
            item.properties.name +
            (item.properties.city ? `, ${item.properties.city}` : ""),
          lat: item.geometry.coordinates[1],
          lng: item.geometry.coordinates[0],
        }));

        cacheRef.current[query] = locations;
        setResults(locations);
        setOpen(true);
      } catch {}
      finally {
        if (activeQueryRef.current === query) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setOpen(true);
          setResults([]); 
        }}
        onFocus={() => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          if (results.length > 0 || loading) setOpen(true);
        }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setOpen(false), 150);
        }}
      />

      {open && (
        <div className="absolute z-[9999] w-full bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Đang tìm địa điểm…
            </div>
          )}

          {!loading &&
            results.map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                onMouseDown={() => {
                  onSelect(item);
                  setInputValue(item.name);
                  setOpen(false);
                }}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
