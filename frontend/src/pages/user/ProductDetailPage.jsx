import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import { FullPageLoader } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [mainImg,  setMainImg]  = useState(0);
  const [selSize,  setSelSize]  = useState('');
  const [selColor, setSelColor] = useState('');
  const [qty,      setQty]      = useState(1);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [prodRes, relRes] = await Promise.all([
          axiosInstance.get(`/products/${id}`),
          axiosInstance.get(`/products/${id}/related`),
        ]);
        setProduct(prodRes.data);
        setRelated(relRes.data);
        setSelSize(prodRes.data.sizes?.[0] || '');
        setSelColor(prodRes.data.colors?.[0] || '');
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    fetch();
    setMainImg(0);
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!selSize) { toast.error('Please select a size'); return; }
    addToCart(product, selSize, selColor, qty);
  };

  if (loading) return <FullPageLoader text="Loading product..." />;
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '5rem', minHeight: '60vh' }}>
      <p className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-muted)' }}>Product not found</p>
      <Link to="/shop" className="btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Back to Shop</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [null];

  return (
    <div className="page-enter">
      <div className="container-lida" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {/* Breadcrumb */}
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link to="/shop" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Shop</Link>
          {' / '}
          <span style={{ color: 'var(--color-gold)' }}>{product.name}</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          {/* ── Images ── */}
          <div>
            <div style={{ aspectRatio: '1', background: 'var(--color-surface-2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem', border: 'var(--border-gold-dim)' }}>
              {images[mainImg] && !imgErrors[mainImg] ? (
                <img src={images[mainImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErrors(p => ({ ...p, [mainImg]: true }))} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                  <svg width="48" height="48" fill="none" stroke="rgba(138,111,46,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setMainImg(i)}
                    style={{ width: '72px', height: '72px', borderRadius: '3px', overflow: 'hidden', border: i === mainImg ? '2px solid var(--color-gold)' : 'var(--border-gold-dim)', cursor: 'pointer', padding: 0, background: 'var(--color-surface-2)', flexShrink: 0 }}
                  >
                    {img && !imgErrors[i] ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErrors(p => ({ ...p, [i]: true }))} /> : null}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>
            {(product.isBestseller || product.isFeatured) && (
              <span className="badge" style={{ background: 'var(--color-gold)', color: '#0A0A0A', fontSize: '0.65rem', marginBottom: '0.75rem', display: 'inline-flex' }}>
                {product.isBestseller ? '★ Bestseller' : 'Featured'}
              </span>
            )}
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {product.category?.name}
            </p>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '1.25rem' }}>
              {formatCurrency(product.price)}
            </p>

            {product.description && (
              <p className="font-body" style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                {product.description}
              </p>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                  Size — <span style={{ color: 'var(--color-gold)' }}>{selSize}</span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((sz) => (
                    <button key={sz} onClick={() => setSelSize(sz)}
                      style={{ padding: '0.45rem 1rem', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        background: selSize === sz ? 'var(--color-gold)' : 'transparent',
                        color:      selSize === sz ? '#0A0A0A'           : 'var(--color-muted)',
                        border:     selSize === sz ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                        transition: 'var(--transition-base)',
                      }}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                  Color — <span style={{ color: 'var(--color-gold)' }}>{selColor}</span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.colors.map((col) => (
                    <button key={col} onClick={() => setSelColor(col)}
                      style={{ padding: '0.35rem 0.9rem', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', cursor: 'pointer',
                        background: selColor === col ? 'rgba(201,168,76,0.15)' : 'transparent',
                        color:      selColor === col ? 'var(--color-gold)' : 'var(--color-muted)',
                        border:     selColor === col ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                        transition: 'var(--transition-base)',
                      }}>
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', border: 'var(--border-gold-dim)', background: 'var(--color-surface-2)', color: 'var(--color-white)', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', minWidth: '32px', textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: '36px', height: '36px', border: 'var(--border-gold-dim)', background: 'var(--color-surface-2)', color: 'var(--color-white)', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button id="add-to-cart-btn" onClick={handleAddToCart} className="btn-gold" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                Add to Cart
              </button>
              <Link id="buy-now-btn" to="/cart" onClick={handleAddToCart} className="btn-outline" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                Buy Now
              </Link>
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: product.stock > 5 ? 'var(--color-success)' : product.stock > 0 ? '#E67E22' : 'var(--color-error)', marginTop: '1rem' }}>
                {product.stock > 5 ? '✓ In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </p>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
              You May Also Like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
