export interface City {
  name: string
  lat: number
  lng: number
}

export interface Point {
  x: number
  y: number
  name?: string
  lat?: number
  lng?: number
}

export const vietnamCities: City[] = [
  { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { name: 'Hồ Chí Minh', lat: 10.7769, lng: 106.7009 },
  { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881 },
  { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
  { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469 },
  { name: 'An Giang', lat: 10.3759, lng: 105.4352 },
  { name: 'Bà Rịa - Vũng Tàu', lat: 10.5417, lng: 107.2429 },
  { name: 'Bắc Giang', lat: 21.2731, lng: 106.1946 },
  { name: 'Bắc Kạn', lat: 22.1472, lng: 105.8348 },
  { name: 'Bạc Liêu', lat: 9.294, lng: 105.721 },
  { name: 'Bắc Ninh', lat: 21.1847, lng: 106.0745 },
  { name: 'Bến Tre', lat: 10.2351, lng: 106.3759 },
  { name: 'Bình Định', lat: 13.782, lng: 109.219 },
  { name: 'Bình Dương', lat: 11.325, lng: 106.477 },
  { name: 'Bình Phước', lat: 11.7512, lng: 106.9113 },
  { name: 'Bình Thuận', lat: 11.0904, lng: 108.0721 },
  { name: 'Cà Mau', lat: 9.1766, lng: 105.1524 },
  { name: 'Cao Bằng', lat: 22.666, lng: 106.266 },
  { name: 'Đắk Lắk', lat: 12.6675, lng: 108.0378 },
  { name: 'Đắk Nông', lat: 12.1386, lng: 107.6913 },
  { name: 'Điện Biên', lat: 21.3948, lng: 103.0161 },
  { name: 'Đồng Nai', lat: 10.943, lng: 107.135 },
  { name: 'Đồng Tháp', lat: 10.4712, lng: 105.6329 },
  { name: 'Gia Lai', lat: 13.9894, lng: 108.0024 },
  { name: 'Hà Giang', lat: 22.833, lng: 104.983 },
  { name: 'Hà Nam', lat: 20.5343, lng: 105.9067 },
  { name: 'Hà Tĩnh', lat: 18.343, lng: 105.905 },
  { name: 'Hải Dương', lat: 20.938, lng: 106.315 },
  { name: 'Hậu Giang', lat: 9.784, lng: 105.466 },
  { name: 'Hòa Bình', lat: 20.817, lng: 105.337 },
  { name: 'Hưng Yên', lat: 20.646, lng: 106.051 },
  { name: 'Khánh Hòa', lat: 12.2388, lng: 109.1967 },
  { name: 'Kiên Giang', lat: 10.016, lng: 105.085 },
  { name: 'Kon Tum', lat: 14.35, lng: 108.007 },
  { name: 'Lai Châu', lat: 22.386, lng: 103.458 },
  { name: 'Lâm Đồng', lat: 11.9404, lng: 108.4583 },
  { name: 'Lạng Sơn', lat: 21.852, lng: 106.761 },
  { name: 'Lào Cai', lat: 22.487, lng: 103.975 },
  { name: 'Long An', lat: 10.542, lng: 106.405 },
  { name: 'Nam Định', lat: 20.438, lng: 106.162 },
  { name: 'Nghệ An', lat: 18.666, lng: 105.666 },
  { name: 'Ninh Bình', lat: 20.253, lng: 105.974 },
  { name: 'Ninh Thuận', lat: 11.565, lng: 108.983 },
  { name: 'Phú Thọ', lat: 21.398, lng: 105.224 },
  { name: 'Phú Yên', lat: 13.116, lng: 109.3 },
  { name: 'Quảng Bình', lat: 17.469, lng: 106.622 },
  { name: 'Quảng Nam', lat: 15.573, lng: 108.474 },
  { name: 'Quảng Ngãi', lat: 15.121, lng: 108.804 },
  { name: 'Quảng Ninh', lat: 20.966, lng: 107.055 },
  { name: 'Quảng Trị', lat: 16.746, lng: 107.185 },
  { name: 'Sóc Trăng', lat: 9.6, lng: 105.971 },
  { name: 'Sơn La', lat: 21.128, lng: 103.914 },
  { name: 'Tây Ninh', lat: 11.31, lng: 106.098 },
  { name: 'Thái Bình', lat: 20.447, lng: 106.342 },
  { name: 'Thái Nguyên', lat: 21.594, lng: 105.848 },
  { name: 'Thanh Hóa', lat: 19.806, lng: 105.785 },
  { name: 'Thừa Thiên Huế', lat: 16.4637, lng: 107.5909 },
  { name: 'Tiền Giang', lat: 10.383, lng: 106.352 },
  { name: 'Trà Vinh', lat: 9.934, lng: 106.345 },
  { name: 'Tuyên Quang', lat: 21.805, lng: 105.224 },
  { name: 'Vĩnh Long', lat: 10.253, lng: 105.971 },
  { name: 'Vĩnh Phúc', lat: 21.294, lng: 105.614 },
  { name: 'Yên Bái', lat: 21.722, lng: 104.895 },
];


// Convert lat/lng to x,y coordinates for canvas
export function getCanvasCoordinates(
  city: City,
  width: number,
  height: number
): Point {
  // Define bounds for Vietnam
  const LAT_MIN = 8.0 // Southernmost point
  const LAT_MAX = 24.0 // Northernmost point
  const LNG_MIN = 102.0 // Westernmost point
  const LNG_MAX = 110.0 // Easternmost point

  // Add padding
  const PADDING = 50

  // Scale coordinates to canvas size with padding
  const x = ((city.lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (width - 2 * PADDING) + PADDING
  const y = ((LAT_MAX - city.lat) / (LAT_MAX - LAT_MIN)) * (height - 2 * PADDING) + PADDING

  return {
    x,
    y,
    name: city.name,
    lat: city.lat,
    lng: city.lng
  }
}