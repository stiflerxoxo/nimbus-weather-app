// Maps WMO weather codes (used by Open-Meteo) to a description and a
// broad category that decides which background animation to show.
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")

const WEATHER_CODES = {
  0: { label: 'Clear sky', category: 'clear' },
  1: { label: 'Mainly clear', category: 'clear' },
  2: { label: 'Partly cloudy', category: 'cloudy' },
  3: { label: 'Overcast', category: 'cloudy' },
  45: { label: 'Fog', category: 'fog' },
  48: { label: 'Depositing rime fog', category: 'fog' },
  51: { label: 'Light drizzle', category: 'rain' },
  53: { label: 'Moderate drizzle', category: 'rain' },
  55: { label: 'Dense drizzle', category: 'rain' },
  56: { label: 'Light freezing drizzle', category: 'rain' },
  57: { label: 'Dense freezing drizzle', category: 'rain' },
  61: { label: 'Slight rain', category: 'rain' },
  63: { label: 'Moderate rain', category: 'rain' },
  65: { label: 'Heavy rain', category: 'rain' },
  66: { label: 'Light freezing rain', category: 'rain' },
  67: { label: 'Heavy freezing rain', category: 'rain' },
  71: { label: 'Slight snow fall', category: 'snow' },
  73: { label: 'Moderate snow fall', category: 'snow' },
  75: { label: 'Heavy snow fall', category: 'snow' },
  77: { label: 'Snow grains', category: 'snow' },
  80: { label: 'Slight rain showers', category: 'rain' },
  81: { label: 'Moderate rain showers', category: 'rain' },
  82: { label: 'Violent rain showers', category: 'rain' },
  85: { label: 'Slight snow showers', category: 'snow' },
  86: { label: 'Heavy snow showers', category: 'snow' },
  95: { label: 'Thunderstorm', category: 'thunderstorm' },
  96: { label: 'Thunderstorm with hail', category: 'thunderstorm' },
  99: { label: 'Thunderstorm with heavy hail', category: 'thunderstorm' },
}

export function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', category: 'clear' }
}
