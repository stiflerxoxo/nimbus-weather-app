import { useCallback, useState } from 'react'

// Wraps the browser Geolocation API with loading/error state and a manual
// trigger, so the caller decides exactly when permission is requested.
export function useGeolocation() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)

  const requestLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setStatus('error')
        setError('Geolocation is not supported by this browser.')
        resolve(null)
        return
      }

      setStatus('loading')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus('success')
          setError(null)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (err) => {
          setStatus('error')
          setError(
            err.code === err.PERMISSION_DENIED
              ? 'Location access was denied. Search for a city instead.'
              : 'Could not determine your location. Search for a city instead.',
          )
          resolve(null)
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
      )
    })
  }, [])

  return { status, error, requestLocation }
}
