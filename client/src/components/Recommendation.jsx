import React from 'react';

export default function Recommendation({ recommendation }) {
  if (!recommendation) return null;
  const { items, raw } = recommendation;
  return (
    <section className="card">
      <h2>Today's outfit</h2>
      {items?.length > 0 ? (
        <table className="outfit">
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <th>{it.part}</th>
                <td>{it.item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <pre className="raw">{raw}</pre>
      )}
    </section>
  );
}
