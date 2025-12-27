import axiosInstance from "@/lib/config-axios";
import { LocationResult } from "@/types";

const API_URL = `/common/search`;

interface Query {
  key?: string | null;
  from_city: string | null;
  to_city: string | null;
  start_time?: string | null;
  date: string | null;
  start_address?: LocationResult | null;
  end_address?: LocationResult | null;
  userLocation?: LocationResult | null;
}

const searchProducts = async (query: Query) => {
  try {
    const res = await axiosInstance.post(API_URL, {
      key: query.key ?? null,
      from_city: query.from_city,
      to_city: query.to_city,
      start_time: query.start_time,
      date: query.date,
      start_address: query.start_address,
      end_address: query.end_address,
      userLocation: query.userLocation ?? null,
    });

    return res.data;
  } catch (e) {
    console.error("searchProducts error:", e);
    throw e;
  }
};

export default searchProducts;
