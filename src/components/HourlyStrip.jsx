import { describeWeatherCode } from '../utils/weatherCodes.js'
import { WEATHER_ICONS } from '../utils/weatherIcons.js'

export default function HourlyStrip({ hourly, currentTime }) {
  if (!hourly) return null

  // hourly.time and currentTime are both naive local-time strings for the
  // SAME location (e.g. "2026-09-28T14:00"), so they compare correctly as
  // plain strings. Comparing against the browser's own Date.now() instead
  // breaks as soon as the searched city is in a different timezone than
  // the person viewing the page.
  const startIndex = currentTime ? hourly.time.findIndex((t) => t >= currentTime) : 0
  const from = Math.max(startIndex, 0)
  const slice = hourly.time.slice(from, from + 8)

  return (
    <section className="hourly-strip">
      <h2 className="panel-heading">Next hours</h2>
      <div className="hourly-strip__row">
        {slice.map((t, i) => {
          const idx = from + i
          const code = hourly.weather_code[idx]
          const { category } = describeWeatherCode(code)
          const temp = hourly.temperature_2m[idx]
          const hourLabel = new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(new Date(t))
          return (
            <div className="hourly-strip__item" key={t}>
              <span className="hourly-strip__time">{i === 0 ? 'Now' : hourLabel}</span>
              <span className="hourly-strip__icon" aria-hidden="true">
                {WEATHER_ICONS[category]}
              </span>
              <span className="hourly-strip__temp tabular">{Math.round(temp)}&deg;</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
