import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';
import { SkeletonCard } from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';

const BrandStoryStrip = () => (
  <section style={{ background: 'var(--color-surface)', padding: '4rem 0', borderTop: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
    <div className="container-lida" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <p className="font-body" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontStyle: 'italic', color: 'var(--color-white)', lineHeight: 1.8 }}>
        "LIDA FASHION WEAR is where bold style meets timeless quality.<br />
        From the streets to the pitch — <span style={{ color: 'var(--color-gold)' }}>we dress you for the moment.</span>"
      </p>
    </div>
  </section>
);

const SectionTitle = ({ title, subtitle, centered = true }) => (
  <div style={{ marginBottom: '2.5rem', textAlign: centered ? 'center' : 'left' }}>
    {subtitle && (
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
        {subtitle}
      </p>
    )}
    <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--color-white)', fontWeight: 700 }}>
      {title}
    </h2>
    <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: centered ? '1rem auto 0' : '1rem 0 0' }} />
  </div>
);

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [jerseys,    setJerseys]    = useState([]);
  const [arrivals,   setArrivals]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, jerseyRes, newRes] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get('/products/jerseys?limit=4'),
          axiosInstance.get('/products?limit=4&sort=newest'),
        ]);
        setCategories(catRes.data);
        setJerseys(jerseyRes.data.products);
        setArrivals(newRes.data.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="page-enter">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #0D0D0D 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Decorative gold lines */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '5%', width: '1px', height: '200px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '8%', width: '1px', height: '150px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.2), transparent)' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '15%', width: '150px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)' }} />
        </div>

        <div className="container-lida" style={{ width: '100%', textAlign: 'center', position: 'relative', zIndex: 2, padding: '5rem 1.5rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-gold-dim)', marginBottom: '1.5rem' }}>
            ✦ Premium Fashion ✦
          </p>
          <h1 className="font-display gold-text" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
            LIDA<br />FASHION WEAR
          </h1>
          <p className="font-body" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: 'var(--color-muted)', fontStyle: 'italic', letterSpacing: '0.05em', marginBottom: '3rem' }}>
            Dressed in Excellence.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-gold" id="hero-shop-btn" style={{ fontSize: '0.8rem' }}>
              Shop Now
            </Link>
            <Link to="/shop?category=Jerseys" className="btn-outline" id="hero-jerseys-btn" style={{ fontSize: '0.8rem' }}>
              View Jerseys
            </Link>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: '-3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', animation: 'bounce 2s infinite' }}>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))' }} />
          </div>
        </div>

        <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }`}</style>
      </section>

      {/* ─── Featured Categories ───────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', overflow: 'hidden' }}>
        <div className="container-lida">
          <SectionTitle title="Shop by Category" subtitle="Explore our world" />
          <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'thin' }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ width: '220px', aspectRatio: '3/4', flexShrink: 0, borderRadius: '4px' }} />
                ))
              : categories.map((cat) => (
                  <CategoryCard key={cat._id} category={cat} featured={cat.isFeatured} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ─── Jerseys Spotlight ────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--color-surface)' }}>
        <div className="container-lida">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionTitle title="Our Bestseller — Jerseys" subtitle="★ Bestseller collection" centered={false} />
            <Link to="/shop?category=Jerseys" className="btn-outline" style={{ fontSize: '0.72rem' }}>View All Jerseys</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : jerseys.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ─── New Arrivals ─────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-lida">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionTitle title="New Arrivals" subtitle="Just dropped" centered={false} />
            <Link to="/shop" className="btn-outline" style={{ fontSize: '0.72rem' }}>Shop All</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : arrivals.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ─── Brand Story ──────────────────────────────────────────────── */}
      <BrandStoryStrip />
      <Footer />
    </div>
  );
};

export default HomePage;
