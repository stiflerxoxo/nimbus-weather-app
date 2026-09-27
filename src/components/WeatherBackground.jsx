import { useMemo } from 'react'
import './WeatherBackground.css'

// Renders a full-viewport animated backdrop matching the current weather
// category (clear / cloudy / rain / snow / fog / thunderstorm) and time of
// day. Purely decorative — safe to ignore for screen readers.

function useParticles(count, seedKey) {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${seedKey}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      size: 0.5 + Math.random() * 1,
    }))
  }, [count, seedKey])
}

function RainLayer() {
  const drops = useParticles(60, 'rain')
  return (
    <div className="weather-layer rain-layer" aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.id}
          className="raindrop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay * 0.3}s`,
            animationDuration: `${0.5 + d.duration * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

function SnowLayer() {
  const flakes = useParticles(45, 'snow')
  return (
    <div className="weather-layer snow-layer" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size * 6}px`,
            height: `${f.size * 6}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration + 4}s`,
          }}
        />
      ))}
    </div>
  )
}

function CloudLayer({ dense = false }) {
  const clouds = useMemo(
    () => [
      { top: '12%', scale: 1.1, duration: 55, delay: 0, opacity: 0.9 },
      { top: '25%', scale: 0.8, duration: 70, delay: -20, opacity: 0.7 },
      { top: '8%', scale: 0.6, duration: 40, delay: -10, opacity: 0.55 },
      { top: '35%', scale: 1.3, duration: 85, delay: -35, opacity: dense ? 0.95 : 0.6 },
    ],
    [dense],
  )
  return (
    <div className="weather-layer cloud-layer" aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="cloud-shape"
          style={{
            top: c.top,
            opacity: c.opacity,
            transform: `scale(${c.scale})`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function FogLayer() {
  return (
    <div className="weather-layer fog-layer" aria-hidden="true">
      <div className="fog-band fog-band--1" />
      <div className="fog-band fog-band--2" />
      <div className="fog-band fog-band--3" />
    </div>
  )
}

function SunLayer() {
  return (
    <div className="weather-layer sun-layer" aria-hidden="true">
      <div className="sun-glow" />
      <div className="sun-core" />
    </div>
  )
}

function MoonLayer() {
  const stars = useParticles(50, 'stars')
  return (
    <div className="weather-layer moon-layer" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${(s.delay / 6) * 90}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${2 + s.duration}s`,
          }}
        />
      ))}
      <div className="moon-shape" />
    </div>
  )
}

export default function WeatherBackground({ category, isDay }) {
  const themeClass = `weather-bg weather-bg--${category}-${isDay ? 'day' : 'night'}`

  return (
    <div className={themeClass}>
      {category === 'clear' && isDay && <SunLayer />}
      {category === 'clear' && !isDay && <MoonLayer />}

      {category === 'cloudy' && (
        <>
          {isDay ? <SunLayer /> : <MoonLayer />}
          <CloudLayer />
        </>
      )}

      {category === 'fog' && <FogLayer />}

      {category === 'rain' && (
        <>
          <CloudLayer dense />
          <RainLayer />
        </>
      )}

      {category === 'snow' && (
        <>
          <CloudLayer dense />
          <SnowLayer />
        </>
      )}

      {category === 'thunderstorm' && (
        <>
          <CloudLayer dense />
          <RainLayer />
          <div className="lightning-flash" aria-hidden="true" />
        </>
      )}
    </div>
  )
}
