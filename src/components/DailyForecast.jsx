import { describeWeatherCode } from '../utils/weatherCodes.js'
import { WEATHER_ICONS } from '../utils/weatherIcons.js'

// "YYYY-MM-DD" parsed via `new Date(date)` is treated as UTC midnight per the
// JS spec, which can shift the weekday back a day depending on the viewer's
// timezone. Building the Date from explicit local components avoids that.
function parseLocalDateOnly(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export default function DailyForecast({ daily }) {
  if (!daily) return null

  return (
    <section className="daily-forecast">
      <h2 className="panel-heading">6-day outlook</h2>
      <ul className="daily-forecast__list">
        {daily.time.map((date, i) => {
          const { category } = describeWeatherCode(daily.weather_code[i])
          const dayLabel =
            i === 0
              ? 'Today'
              : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(parseLocalDateOnly(date))
          return (
            <li className="daily-forecast__row" key={date}>
              <span className="daily-forecast__day">{dayLabel}</span>
              <span className="daily-forecast__icon" aria-hidden="true">
                {WEATHER_ICONS[category]}
              </span>
              <span className="daily-forecast__low tabular">
                {Math.round(daily.temperature_2m_min[i])}&deg;
              </span>
              <span className="daily-forecast__bar" aria-hidden="true" />
              <span className="daily-forecast__high tabular">
                {Math.round(daily.temperature_2m_max[i])}&deg;
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
