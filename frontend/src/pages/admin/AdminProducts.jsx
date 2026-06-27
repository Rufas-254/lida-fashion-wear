import { useState, useEffect } from 'react';
import { adminAxios } from '../../api/axiosInstance';
import AdminSidebar from '../../components/AdminSidebar';
import ImageUploader from '../../components/ImageUploader';
import { FullPageLoader } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];

const EMPTY_FORM = {
  name: '', description: '', category: '', price: '', stock: '',
  sizes: [], colors: '', images: [],
  isFeatured: false, isBestseller: false, isActive: true,
};

const AdminProducts = () => {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('');
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { admin: 'true', page, limit: 10 };
      if (search)    params.search   = search;
      if (catFilter) params.category = catFilter;
      const { data } = await adminAxios.get('/products', { params });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search, catFilter]);
  useEffect(() => {
    adminAxios.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name:        product.name,
      description: product.description || '',
      category:    product.category?._id || product.category || '',
      price:       product.price,
      stock:       product.stock,
      sizes:       product.sizes || [],
      colors:      (product.colors || []).join(', '),
      images:      product.images || [],
      isFeatured:  product.isFeatured,
      isBestseller: product.isBestseller,
      isActive:    product.isActive,
    });
    setShowModal(true);
  };

  const toggleSize = (sz) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(sz) ? f.sizes.filter(s => s !== sz) : [...f.sizes, sz],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error('Name, category, and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
        price:  Number(form.price),
        stock:  Number(form.stock) || 0,
      };
      if (editProduct) {
        await adminAxios.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated');
      } else {
        await adminAxios.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (product) => {
    try {
      await adminAxios.put(`/products/${product._id}`, { isActive: !product.isActive });
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch { toast.error('Failed to toggle product status'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.8rem' }}>Products</h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>Manage your product catalogue</p>
          </div>
          <button id="add-product-btn" onClick={openCreate} className="btn-gold" style={{ fontSize: '0.78rem' }}>+ Add Product</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            className="input-luxury"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: '240px' }}
          />
          <select className="input-luxury" value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }} style={{ width: 'auto', minWidth: '160px' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <FullPageLoader text="Loading products..." />
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(138,111,46,0.2)' }}>
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(138,111,46,0.08)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '3px', overflow: 'hidden', background: 'var(--color-surface-2)', border: 'var(--border-gold-dim)' }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-white)', maxWidth: '200px' }}>
                      {p.name}
                      {p.isBestseller && <span className="badge" style={{ background: 'var(--color-gold)', color: '#0A0A0A', fontSize: '0.55rem', marginLeft: '0.5rem' }}>BS</span>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--color-muted)' }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>{formatCurrency(p.price)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: p.stock <= 5 ? 'var(--color-error)' : 'var(--color-white)' }}>{p.stock}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge" style={{ color: p.isActive ? 'var(--color-success)' : 'var(--color-error)', background: p.isActive ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)', border: `1px solid ${p.isActive ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}` }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(p)} className="btn-outline" style={{ fontSize: '0.65rem', padding: '0.3rem 0.7rem' }}>Edit</button>
                        <button onClick={() => toggleActive(p)} style={{ fontSize: '0.65rem', padding: '0.3rem 0.7rem', background: 'none', border: `1px solid ${p.isActive ? 'rgba(192,57,43,0.4)' : 'rgba(39,174,96,0.4)'}`, color: p.isActive ? 'var(--color-error)' : 'var(--color-success)', cursor: 'pointer', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {p.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', cursor: 'pointer', background: p === page ? 'var(--color-gold)' : 'transparent', color: p === page ? '#0A0A0A' : 'var(--color-muted)', border: p === page ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)' }}>{p}</button>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(138,111,46,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="font-display" style={{ fontSize: '1.3rem' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="label-luxury">Product Name *</label>
                  <input className="input-luxury" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" required />
                </div>
                <div>
                  <label className="label-luxury">Category *</label>
                  <select className="input-luxury" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Price (KES) *</label>
                  <input className="input-luxury" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" required />
                </div>
                <div>
                  <label className="label-luxury">Stock Quantity</label>
                  <input className="input-luxury" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="label-luxury">Description</label>
                <textarea className="input-luxury" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="label-luxury">Colors (comma-separated)</label>
                <input className="input-luxury" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="Black, White, Gold" />
              </div>
              <div>
                <p className="label-luxury">Sizes</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {SIZES.map(sz => (
                    <button key={sz} type="button" onClick={() => toggleSize(sz)}
                      style={{ padding: '0.3rem 0.75rem', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', background: form.sizes.includes(sz) ? 'var(--color-gold)' : 'transparent', color: form.sizes.includes(sz) ? '#0A0A0A' : 'var(--color-muted)', border: form.sizes.includes(sz) ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)', transition: 'var(--transition-base)' }}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  ['isFeatured',   'Featured'],
                  ['isBestseller', 'Bestseller'],
                  ['isActive',     'Active'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: 'var(--color-gold)' }} />
                    {label}
                  </label>
                ))}
              </div>
              <ImageUploader images={form.images} onImagesChange={imgs => setForm(f => ({ ...f, images: imgs }))} />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ fontSize: '0.78rem' }}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving} style={{ fontSize: '0.78rem' }}>
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
