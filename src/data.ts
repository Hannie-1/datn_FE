import { LocationResult } from "./types";

export const CITIES = [
    "Hà Nội",
    "Hải Phòng",
    "Nam Định",
    "Ninh Bình",
    "Thái Bình",
    "Phú Thọ"
];

export const CITY_POINTS: Record<string, LocationResult[]> = {
  "Hà Nội": [
    { name: "Gia Lâm", lat: 0, lng: 0 },
    { name: "Giáp Bát", lat: 0, lng: 0 },
    { name: "Mỹ Đình", lat: 0, lng: 0 },
    { name: "Nước Ngầm", lat: 0, lng: 0 },
    { name: "Yên Nghĩa", lat: 0, lng: 0 }
  ],

  "Hải Phòng": [
    { name: "Vĩnh Niệm", lat: 0, lng: 0 },
    { name: "Thượng Lý", lat: 0, lng: 0 },
    { name: "Vĩnh Bảo", lat: 0, lng: 0 },
    { name: "phía Bắc Hải Phòng", lat: 0, lng: 0 }
  ],

  "Nam Định": [
    { name: "Ý Yên", lat: 0, lng: 0 },
    { name: "Hải Hậu", lat: 0, lng: 0 },
    { name: "Giao Thủy", lat: 0, lng: 0 },
    { name: "Nam Định", lat: 0, lng: 0 }
  ],

  "Ninh Bình": [
    { name: "Ninh Bình", lat: 0, lng: 0 },
    { name: "Tam Điệp", lat: 0, lng: 0 },
    { name: "Gia Viễn", lat: 0, lng: 0 },
    { name: "Yên Mô", lat: 0, lng: 0 }
  ],

  "Thái Bình": [
    { name: "Thái Bình", lat: 0, lng: 0 },
    { name: "Đông Hưng", lat: 0, lng: 0 },
    { name: "Quỳnh Phụ", lat: 0, lng: 0 },
    { name: "Tiền Hải", lat: 0, lng: 0 }
  ],

  "Phú Thọ": [
    { name: "Việt Trì", lat: 0, lng: 0 },
    { name: "Phù Ninh", lat: 0, lng: 0 },
    { name: "Thanh Thủy", lat: 0, lng: 0 },
    { name: "Cẩm Khê", lat: 0, lng: 0 }
  ]
};
