import React, { useState } from 'react';

export default function SearchForm({ onSubmit, loading }) {
  const [city, setCity] = useState('');
  const [preference, setPreference] = useState('');

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(city.trim(), preference.trim());
      }}
    >
      <label>
        City
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Tel Aviv" maxLength={100} required />
      </label>
      <label>
        Clothing preference
        <textarea
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          placeholder="e.g. casual, I get cold easily"
          rows={3}
          maxLength={500}
        />
      </label>
      <button type="submit" disabled={loading || !city.trim()}>
        {loading ? 'Thinking...' : 'What should I wear?'}
      </button>
    </form>
  );
}
