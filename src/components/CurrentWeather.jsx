import { describeWeatherCode } from '../utils/weatherCodes.js'

export default function CurrentWeather({ locationLabel, current }) {
  const { temperature_2m, apparent_temperature, relative_humidity_2m, wind_speed_10m, weather_code } =
    current
  const { label } = describeWeatherCode(weather_code)

  return (
    <section className="current-weather">
      <p className="current-weather__location">{locationLabel}</p>
      <div className="current-weather__temp-row">
        <span className="current-weather__temp tabular">{Math.round(temperature_2m)}&deg;</span>
        <div className="current-weather__meta">
          <span className="current-weather__condition">{label}</span>
          <span className="current-weather__feels tabular">
            Feels like {Math.round(apparent_temperature)}&deg;
          </span>
        </div>
      </div>
      <div className="current-weather__stats">
        <div className="stat">
          <span className="stat__label">Humidity</span>
          <span className="stat__value tabular">{Math.round(relative_humidity_2m)}%</span>
        </div>
        <div className="stat">
          <span className="stat__label">Wind</span>
          <span className="stat__value tabular">{Math.round(wind_speed_10m)} km/h</span>
        </div>
      </div>
    </section>
  )
}
