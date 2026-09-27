const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

// Fetches current, hourly, and daily forecast data for a given coordinate pair.
// Open-Meteo requires no API key and is free for non-commercial use.
export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '6',
  })

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Weather request failed (${response.status}). ${body}`.trim())
  }
  return response.json()
}

// Searches for a place by name and returns a list of candidate matches.
export async function searchLocations(query) {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Location search failed.')
  }
  const data = await response.json()
  return data.results || []
}

// Converts coordinates into a human-readable place name. Falls back gracefully
// if the reverse-geocoding service is unreachable.
export async function reverseGeocode(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      localityLanguage: 'en',
    })
    const response = await fetch(`${REVERSE_GEOCODE_URL}?${params.toString()}`)
    if (!response.ok) throw new Error('reverse geocode failed')
    const data = await response.json()
    return data.city || data.locality || data.principalSubdivision || 'Your location'
  } catch {
    return 'Your location'
  }
}
