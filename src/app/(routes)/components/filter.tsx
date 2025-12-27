"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { CITIES, CITY_POINTS } from "@/data";
import useLocation from "@/hooks/use-location";
import LocationPicker from "@/components/ui/location-picker";
import searchProducts from "@/actions/search-product";
import type { LocationResult, ProductManage } from "@/types";

interface FilterProps {
  onResult: (data: ProductManage[]) => void;
}

const convertTo24Hour = (time12h: string) => {
  if (!time12h) return "";
  if (!time12h.includes("AM") && !time12h.includes("PM")) return time12h;
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
  return '${ hours.toString().padStart(2, "0") }:${ minutes.toString().padStart(2, "0") }';
};

const Filter = ({ onResult }: FilterProps) => {
  const { data: userLocation, update } = useLocation();

  /* ================= DEFAULT TIME ================= */
  const now = new Date();
  const defaultDate = now.toISOString().split("T")[0];
  const defaultTime = now.toTimeString().slice(0, 5);
  const defaultDateTime = `${defaultDate}T${defaultTime}`;

  /* ================= STATE ================= */
  const [filters, setFilters] = useState<{
    from_city: string;
    to_city: string;
    date: string;
    start_time: string;
    start_address: LocationResult | null;
    end_address: LocationResult | null;
  }>({
    from_city: "",
    to_city: "",
    date: defaultDate,
    start_time: defaultTime,
    start_address: null,
    end_address: null,
  });

  const datetimeValue =
  filters.date && filters.start_time
    ? `${filters.date}T${filters.start_time}`
    : `${defaultDate}T${defaultTime}`;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const data = await searchProducts({
      key: null,
      from_city: filters.from_city || null,
      to_city: filters.to_city || null,
      start_time: filters.start_time,
      date: filters.date,
      start_address: filters.start_address,
      end_address: filters.end_address,
      userLocation: userLocation?.lat ? userLocation : null,
    });

    onResult(data ?? []);
  };

  return (
    <div className="w-full space-y-6">
      {/* LOCATION */}
      <div className="w-full space-y-6">
        <LocationPicker value={userLocation} onChange={(loc) => update(loc)} />
      </div>

      <div className="lg:flex w-full lg:justify-between py-4 px-2 mt-4 mb-5 rounded-sm bg-white">
        <div className="w-full space-y-6">

          {/* CITY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Select
              value={filters.from_city}
              onValueChange={(name) =>
                setFilters((prev) => ({
                  ...prev,
                  from_city: name,
                  start_address: null,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thành phố bắt đầu" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.to_city}
              onValueChange={(name) =>
                setFilters((prev) => ({
                  ...prev,
                  to_city: name,
                  end_address: null,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thành phố đến" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* POINT + TIME */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              disabled={!filters.from_city}
              value={filters.start_address?.name || ""}
              onValueChange={(name) => {
                const point =
                  CITY_POINTS[filters.from_city]?.find(
                    (p) => p.name === name
                  ) || null;
                setFilters((prev) => ({ ...prev, start_address: point }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn điểm đón" />
              </SelectTrigger>
              <SelectContent>
                {(CITY_POINTS[filters.from_city] || []).map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              disabled={!filters.to_city}
              value={filters.end_address?.name || ""}
              onValueChange={(name) => {
                const point =
                  CITY_POINTS[filters.to_city]?.find(
                    (p) => p.name === name
                  ) || null;
                setFilters((prev) => ({ ...prev, end_address: point }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn điểm trả" />
              </SelectTrigger>
              <SelectContent>
                {(CITY_POINTS[filters.to_city] || []).map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ✅ DATETIME PICKER */}
            <input
              type="datetime-local"
              className="border rounded p-1 w-[180px] text-sm h-10"
              value={datetimeValue}
              onChange={(e) => {
                const [datePart, timePart] = e.target.value.split("T");
                setFilters((prev) => ({
                  ...prev,
                  date: datePart,
                  start_time: convertTo24Hour(timePart),
                }));
              }}
            />


            <div className="flex justify-end items-end">
              <Button
                className="w-[120px]"
                variant="destructive"
                onClick={handleSubmit}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Filter;
