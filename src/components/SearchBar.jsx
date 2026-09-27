import { useEffect, useRef, useState } from 'react'
import { searchLocations } from '../services/weatherApi.js'

export default function SearchBar({ onSelectLocation, onUseMyLocation }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const matches = await searchLocations(query.trim())
        if (!cancelled) {
          setResults(matches)
          setIsOpen(true)
        }
      } catch {
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(result) {
    const label = [result.name, result.admin1, result.country].filter(Boolean).join(', ')
    onSelectLocation({ latitude: result.latitude, longitude: result.longitude, label })
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-bar__input-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a city"
          aria-label="Search for a city"
        />
        <button type="button" className="search-bar__locate" onClick={onUseMyLocation} title="Use my location">
          &#9678;
        </button>
      </div>

      {isOpen && (query.trim().length >= 2) && (
        <ul className="search-bar__results">
          {isSearching && <li className="search-bar__status">Searching…</li>}
          {!isSearching && results.length === 0 && (
            <li className="search-bar__status">No matches found.</li>
          )}
          {!isSearching &&
            results.map((r) => (
              <li key={`${r.id}`}>
                <button type="button" onClick={() => handleSelect(r)}>
                  <span className="search-bar__result-name">{r.name}</span>
                  <span className="search-bar__result-meta">
                    {[r.admin1, r.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
