"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface LocationResult {
  name: string;
  lat: number;
  lng: number;
}

export default function useLocation() {
  const [data, setData] = useState<LocationResult>({
    name: "",
    lat: 0,
    lng: 0,
  });

  const [error, setError] = useState<string | null>(null);

  // ⭐ Cập nhật và lưu vào localStorage
  const update = (loc: LocationResult) => {
    setData(loc);
    localStorage.setItem("user_location", JSON.stringify(loc));
  };

  // ⭐ Lấy vị trí từ GPS
  const fetchLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: { lat, lon: lng, format: "json" },
            }
          );

          const name = res.data.display_name || "Không xác định";

          const loc = { name, lat, lng };
          setData(loc);

          // ⭐ LƯU VỊ TRÍ GPS LẦN ĐẦU
          localStorage.setItem("user_location", JSON.stringify(loc));
        } catch (err) {
          setError("Không thể lấy địa chỉ từ lat/lng");
        }
      },
      (err) => setError(err.message)
    );
  };

  useEffect(() => {
    // ⭐ ƯU TIÊN DÙNG VỊ TRÍ ĐÃ LƯU TRƯỚC
    const saved = localStorage.getItem("user_location");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        return; // không gọi GPS nữa
      } catch {}
    }
    fetchLocation();
  }, []);

  return {
    data,
    error,
    refresh: fetchLocation,
    update, // ⭐ TRẢ RA CHO COMPONENT DÙNG
  };
}
