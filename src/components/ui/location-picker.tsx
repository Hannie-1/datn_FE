"use client";

import { useEffect, useState } from "react";
import { LocationResult } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// debounce
function useDebounce(value: string, delay = 400) {
  const [val, setVal] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setVal(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return val;
}

export default function LocationPickerNew({
  value,
  onChange,
}: {
  value: LocationResult;
  onChange: (loc: LocationResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto search khi debounced thay đổi
  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debounced
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              "User-Agent": "your-app-name",
              "Accept-Language": "vi",
            },
          }
        );

        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debounced]);

  const handleSelect = (place: any) => {
    onChange({
      name: place.display_name,
      lat: Number(place.lat),
      lng: Number(place.lon),
    });

    setOpen(false);
    setSearch("");
    setResults([]);
  };

  return (
    <div>
      {/* === BUTTON HÀNG 0 === */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center px-3 py-2 bg-white rounded-md shadow-sm border hover:bg-gray-50 w-full"
      >
        <div className="text-sm font-medium truncate flex-1">
          {value.name || "Đang lấy vị trí..."}
        </div>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* === POPUP === */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4 w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thay đổi địa chỉ</DialogTitle>
          </DialogHeader>

          {/* Ô search */}
          <Input
            autoFocus
            placeholder="Nhập địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Danh sách kết quả — luôn giữ kích thước cố định */}
          <div
            className="
              mt-3 border rounded-md p-2 bg-gray-50 
              max-h-[300px] overflow-y-auto
              min-h-[300px]              /* ⭐ KÍCH THƯỚC CỐ ĐỊNH LUÔN TO */
              transition-all
            "
          >
            {loading && (
              <div className="text-sm text-gray-500">Đang tìm...</div>
            )}

            {!loading &&
              results.map((item) => (
                <div
                  key={item.place_id}
                  onClick={() => handleSelect(item)}
                  className="p-2 rounded-md border bg-white cursor-pointer hover:bg-gray-100 mb-2"
                >
                  <div className="text-sm font-medium">{item.display_name}</div>
                </div>
              ))}

            {!loading && results.length === 0 && search !== "" && (
              <div className="text-sm text-gray-500">Không tìm thấy kết quả</div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mt-3 w-full"
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
