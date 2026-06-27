import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const PLACEHOLDER_COLOR = '#1A1A1A';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);

  const firstImage = !imgError && product.images?.[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes?.[0] || 'M';
    addToCart(product, defaultSize, product.colors?.[0] || '');
  };

  return (
    <Link to={`/shop/product/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ overflow: 'hidden', cursor: 'pointer' }}
      >
        {/* ── Image ── */}
        <div className="product-img-wrap" style={{ aspectRatio: '4/5', position: 'relative' }}>
          {firstImage ? (
            <img src={product.images[0]} alt={product.name} onError={() => setImgError(true)} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: PLACEHOLDER_COLOR,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem',
            }}>
              <svg width="40" height="40" fill="none" stroke="rgba(138,111,46,0.4)" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'rgba(138,111,46,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No Image</span>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {product.isBestseller && (
              <span className="badge" style={{ background: 'var(--color-gold)', color: '#0A0A0A', fontSize: '0.62rem' }}>
                ★ Bestseller
              </span>
            )}
            {product.isFeatured && !product.isBestseller && (
              <span className="badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-dim)', fontSize: '0.62rem' }}>
                Featured
              </span>
            )}
          </div>

          {/* Quick Add Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,10,10,0.6)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '1rem',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
            <button
              id={`quick-add-${product._id}`}
              onClick={handleQuickAdd}
              className="btn-gold"
              style={{ width: '100%', fontSize: '0.7rem' }}
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div style={{ padding: '1rem 1.1rem 1.25rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-gold-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            {product.category?.name || 'LIDA'}
          </p>
          <h3 className="font-display" style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '0.6rem', fontWeight: 600, lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 700 }}>
              {formatCurrency(product.price)}
            </span>
            {product.sizes?.length > 0 && (
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.05em' }}>
                {product.sizes.join(' · ')}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
