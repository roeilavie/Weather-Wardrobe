import React from 'react';

export default function ImageGrid({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <section className="card">
      <h2>Inspiration</h2>
      <div className="grid">
        {images.map((img, i) => (
          <figure key={i}>
            <a href={img.unsplashUrl} target="_blank" rel="noreferrer">
              <img src={img.url} alt={img.alt || 'Clothing'} loading="lazy" />
            </a>
            <figcaption>
              Photo by <a href={img.photographerUrl} target="_blank" rel="noreferrer">{img.photographer}</a> on{' '}
              <a href="https://unsplash.com/?utm_source=weather_wardrobe&utm_medium=referral" target="_blank" rel="noreferrer">Unsplash</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
