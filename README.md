# Nimbus — Live Weather

A weather app that asks for your location on load, shows live current conditions
plus an hourly and 6-day forecast, lets you search any city, and animates its
background to match the weather — sun, drifting clouds, falling rain or snow,
fog, or a flickering thunderstorm — and shifts between day and night skies.

Built with **React 18** and **Vite**. No API keys, no signup, no backend.

## Features

- Requests browser location permission on load and shows live weather for it
- Falls back gracefully to search if permission is denied or unavailable
- Search any city worldwide, with debounced autocomplete suggestions
- Current conditions: temperature, feels-like, humidity, wind
- Next-8-hours strip and 6-day outlook
- Full-screen animated background that changes with the weather category
  (clear, cloudy, fog, rain, snow, thunderstorm) and time of day
- Fully responsive, from desktop to small phones
- Respects `prefers-reduced-motion` by disabling animation

## How it gets weather data

This app uses [Open-Meteo](https://open-meteo.com/), a free weather API that
requires **no API key**, plus two free, keyless geocoding services:

- Forecasts: Open-Meteo `/v1/forecast`
- City search: Open-Meteo Geocoding API
- Reverse geocoding (turning your coordinates into a city name): BigDataCloud's
  free client-side reverse geocode endpoint

Because none of these need a key, the app works immediately after `npm install`
— there's nothing to configure.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node) or yarn/pnpm
- A browser that supports the Geolocation API (all modern browsers do) —
  note that browsers require a secure context (`https://` or `localhost`) to
  grant location permission

## Running it locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open the printed URL (typically `http://localhost:5173`). Your browser will
   prompt for location permission — allow it to see your local weather, or
   dismiss it and use the search bar instead.

3. **Build for production**

   ```bash
   npm run build
   ```

   Static output goes to `dist/`.

4. **Preview the production build**

   ```bash
   npm run preview
   ```

## Project structure

```
src/
  components/
    WeatherBackground.jsx / .css   Animated backdrop per weather category
    SearchBar.jsx                  City search with autocomplete
    CurrentWeather.jsx             Big current-conditions display
    HourlyStrip.jsx                Next-8-hours strip
    DailyForecast.jsx              6-day outlook
  hooks/
    useGeolocation.js              Wraps the browser Geolocation API
  services/
    weatherApi.js                  Open-Meteo + reverse-geocode calls
  utils/
    weatherCodes.js                WMO weather code → label/category
    weatherIcons.js                Category → glyph
  App.jsx / App.css                Layout and app state
  index.css                        Design tokens and resets
  main.jsx                         React entry point
```

## Pushing this to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Nimbus weather app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Deploying

Since this is a static Vite build with no backend or secrets, it deploys as-is
to GitHub Pages, Vercel, or Netlify — just point the build command at
`npm run build` and serve the `dist/` folder. Location permission requires
HTTPS, which all three provide by default.
