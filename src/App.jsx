import { useCallback, useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import CurrentWeather from './components/CurrentWeather.jsx'
import HourlyStrip from './components/HourlyStrip.jsx'
import DailyForecast from './components/DailyForecast.jsx'
import WeatherBackground from './components/WeatherBackground.jsx'
import { useGeolocation } from './hooks/useGeolocation.js'
import { fetchWeather, reverseGeocode } from './services/weatherApi.js'
import { describeWeatherCode } from './utils/weatherCodes.js'
import './App.css'

export default function App() {
  const { requestLocation } = useGeolocation()

  const [locationLabel, setLocationLabel] = useState('')
  const [weather, setWeather] = useState(null)
  const [loadState, setLoadState] = useState('loading') // loading | ready | error
  const [notice, setNotice] = useState('')
  const [errorDetail, setErrorDetail] = useState('')

  const loadWeatherFor = useCallback(async (latitude, longitude, label) => {
    setLoadState('loading')
    try {
      const data = await fetchWeather(latitude, longitude)
      setWeather(data)
      setLocationLabel(label)
      setLoadState('ready')
      setErrorDetail('')
    } catch (err) {
      console.error('Nimbus: failed to load weather', err)
      setErrorDetail(err.message || 'Unknown error.')
      setLoadState('error')
    }
  }, [])

  const detectMyLocation = useCallback(async () => {
    setNotice('')
    const coords = await requestLocation()
    if (!coords) {
      setNotice('Location access was denied or unavailable. Try searching for a city below.')
      setLoadState((prev) => (prev === 'loading' ? 'error' : prev))
      return
    }
    const label = await reverseGeocode(coords.latitude, coords.longitude)
    await loadWeatherFor(coords.latitude, coords.longitude, label)
  }, [requestLocation, loadWeatherFor])

  // Request location permission as soon as the page loads.
  useEffect(() => {
    detectMyLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelectLocation({ latitude, longitude, label }) {
    setNotice('')
    loadWeatherFor(latitude, longitude, label)
  }

  const category = weather ? describeWeatherCode(weather.current.weather_code).category : 'clear'
  const isDay = weather ? Boolean(weather.current.is_day) : true

  return (
    <>
      <WeatherBackground category={category} isDay={isDay} />

      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-header__brand">Nimbus</h1>
          <SearchBar onSelectLocation={handleSelectLocation} onUseMyLocation={detectMyLocation} />
        </header>

        {notice && <p className="app-notice">{notice}</p>}

        {loadState === 'loading' && (
          <div className="app-status">
            <p>Reading the sky…</p>
          </div>
        )}

        {loadState === 'error' && !weather && (
          <div className="app-status">
            <p>Couldn't load weather. Search for a city to get started.</p>
            {errorDetail && <p className="app-status__detail">{errorDetail}</p>}
          </div>
        )}

        {weather && (
          <main className="app-main">
            <CurrentWeather locationLabel={locationLabel} current={weather.current} />
            <div className="app-main__forecasts">
              <HourlyStrip hourly={weather.hourly} currentTime={weather.current.time} />
              <DailyForecast daily={weather.daily} />
            </div>
          </main>
        )}

        <footer className="app-footer">
          <p>Weather data from Open-Meteo. Location is only used to fetch a forecast.</p>
        </footer>
      </div>
    </>
  )
}
