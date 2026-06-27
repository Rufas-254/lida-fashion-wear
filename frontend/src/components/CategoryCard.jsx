import { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, featured = false }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.name)}`}
      style={{ textDecoration: 'none', display: 'block', flexShrink: 0, width: featured ? '280px' : '220px' }}
    >
      <article
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
      >
        {/* ── Image ── */}
        <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative', background: 'var(--color-surface-2)' }}>
          {category.imageUrl && !imgError ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <span className="font-display" style={{ fontSize: '2.5rem' }}>👕</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{category.name}</span>
            </div>
          )}

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '1.25rem',
          }}>
            <div style={{ textAlign: 'center', transform: hovered ? 'translateY(0)' : 'translateY(8px)', transition: 'transform 0.3s ease' }}>
              <h3 className="font-display" style={{ color: 'var(--color-white)', fontSize: featured ? '1.4rem' : '1.1rem', marginBottom: '0.5rem' }}>
                {category.name}
              </h3>
              {category.productCount !== undefined && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {category.productCount} Items
                </p>
              )}
              <span
                className="btn-gold"
                style={{
                  fontSize: '0.65rem', padding: '0.5rem 1.5rem',
                  opacity: hovered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                Browse
              </span>
            </div>
          </div>

          {/* Featured badge */}
          {featured && (
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
              <span className="badge" style={{ background: 'var(--color-gold)', color: '#0A0A0A', fontSize: '0.6rem' }}>
                ★ Featured
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
