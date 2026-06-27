import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from '../../components/ProductCard';
import { SkeletonCard } from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';

const SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'bestseller', label: 'Bestsellers' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [totalPages,  setTotalPages]  = useState(1);
  const [total,       setTotal]       = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category  = searchParams.get('category') || '';
  const search    = searchParams.get('search')   || '';
  const sort      = searchParams.get('sort')     || 'newest';
  const page      = Number(searchParams.get('page'))  || 1;
  const sizeFilter = searchParams.get('size') || '';

  const [searchInput, setSearchInput] = useState(search);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) {
        updateParam('search', searchInput);
        updateParam('page', '1');
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  useEffect(() => {
    axiosInstance.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { sort, page, limit: 12 };
        if (category)   params.category   = category;
        if (search)     params.search     = search;
        if (sizeFilter) params.size       = sizeFilter;
        const { data } = await axiosInstance.get('/products', { params });
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, search, sort, page, sizeFilter]);

  return (
    <div className="page-enter">
      <div className="container-lida" style={{ padding: '2.5rem 1.5rem 5rem' }}>

        {/* ── Page Title ── */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
            {category || 'All Products'}
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            {category ? category : 'The Collection'}
          </h1>
          {total > 0 && !loading && (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
              {total} product{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

          {/* ── Sidebar ── */}
          <aside style={{
            width: '220px', flexShrink: 0,
            display: window.innerWidth < 768 ? 'none' : 'block',
          }}>
            {/* Category Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>Category</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => updateParam('category', '')}
                  style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: !category ? 'var(--color-gold)' : 'var(--color-muted)', padding: '0.25rem 0', transition: 'var(--transition-base)' }}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { updateParam('category', cat.name); updateParam('page', '1'); }}
                    style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: category === cat.name ? 'var(--color-gold)' : 'var(--color-muted)', padding: '0.25rem 0', transition: 'var(--transition-base)' }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <hr className="section-divider" />

            {/* Size Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateParam('size', sizeFilter === sz ? '' : sz)}
                    style={{
                      padding: '0.3rem 0.7rem', borderRadius: '2px',
                      fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600,
                      cursor: 'pointer',
                      background: sizeFilter === sz ? 'var(--color-gold)' : 'transparent',
                      color:      sizeFilter === sz ? '#0A0A0A' : 'var(--color-muted)',
                      border:     sizeFilter === sz ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                      transition: 'var(--transition-base)',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Controls row */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <input
                  id="shop-search"
                  type="text"
                  className="input-luxury"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              {/* Sort */}
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input-luxury"
                style={{ width: 'auto', minWidth: '160px' }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>No products found</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-muted)', fontSize: '1rem' }}>Try adjusting your filters or search.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateParam('page', String(p))}
                        style={{
                          width: '36px', height: '36px', borderRadius: '2px',
                          fontFamily: 'var(--font-ui)', fontSize: '0.8rem', cursor: 'pointer',
                          background: p === page ? 'var(--color-gold)' : 'transparent',
                          color:      p === page ? '#0A0A0A' : 'var(--color-muted)',
                          border:     p === page ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                          transition: 'var(--transition-base)',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
