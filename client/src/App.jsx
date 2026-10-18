import React, { useState } from 'react';
import { getWardrobe } from './api.js';
import SearchForm from './components/SearchForm.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import Recommendation from './components/Recommendation.jsx';
import ImageGrid from './components/ImageGrid.jsx';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleSubmit(city, preference) {
    setLoading(true);
    setError('');
    try {
      setResult(await getWardrobe(city, preference));
    } catch (e) {
      setResult(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Weather Wardrobe</h1>
      <p className="subtitle">Tell us your city and style - we'll tell you what to wear today.</p>
      <SearchForm onSubmit={handleSubmit} loading={loading} />
      {error && <div className="error" role="alert">{error}</div>}
      {result && (
        <>
          {result.warnings?.length > 0 && (
            <div className="warning">{result.warnings.join(' ')}</div>
          )}
          <WeatherCard location={result.location} weather={result.weather} />
          <Recommendation recommendation={result.recommendation} />
          <ImageGrid images={result.images} />
        </>
      )}
    </main>
  );
}
