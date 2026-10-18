import React from 'react';

export default function WeatherCard({ location, weather }) {
  if (!weather) return null;
  return (
    <section className="card">
      <h2>{[location.name, location.admin1, location.country].filter(Boolean).join(', ')}</h2>
      <p className="conditions">{weather.conditions}</p>
      <ul className="stats">
        <li><strong>{Math.round(weather.tempMin)}&deg;C</strong> low</li>
        <li><strong>{Math.round(weather.tempMax)}&deg;C</strong> high</li>
        <li><strong>{weather.precipitationProbability ?? '-'}%</strong> rain chance</li>
        <li><strong>{Math.round(weather.windSpeedMax)} km/h</strong> wind</li>
      </ul>
    </section>
  );
}
