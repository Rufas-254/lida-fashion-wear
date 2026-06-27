import { useState, useEffect } from 'react';
import { adminAxios } from '../../api/axiosInstance';
import AdminSidebar from '../../components/AdminSidebar';
import ImageUploader from '../../components/ImageUploader';
import { FullPageLoader } from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', isFeatured: false, images: [] };

const AdminCategories = () => {
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [editCat,     setEditCat]     = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxios.get('/categories');
      setCategories(data);
    } catch (e) { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditCat(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setForm({
      name:       cat.name,
      isFeatured: cat.isFeatured,
      images:     cat.imageUrl ? [cat.imageUrl] : [],
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name:       form.name,
        isFeatured: form.isFeatured,
        imageUrl:   form.images[0] || '',
      };
      if (editCat) {
        await adminAxios.put(`/categories/${editCat._id}`, payload);
        toast.success('Category updated');
      } else {
        await adminAxios.post('/categories', payload);
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products within it may lose their categorization.')) return;
    try {
      await adminAxios.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.8rem' }}>Categories</h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>Manage product categories</p>
          </div>
          <button id="add-category-btn" onClick={openCreate} className="btn-gold" style={{ fontSize: '0.78rem' }}>+ Add Category</button>
        </div>

        {loading ? (
          <FullPageLoader text="Loading categories..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <div key={cat._id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ aspectRatio: '3/2', background: 'var(--color-surface-2)', borderBottom: 'var(--border-gold-dim)', position: 'relative' }}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No Image</p>
                    </div>
                  )}
                  {cat.isFeatured && (
                    <span className="badge" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--color-gold)', color: '#0A0A0A', fontSize: '0.65rem' }}>
                      ★ Featured
                    </span>
                  )}
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.name}</h3>
                    {cat.productCount !== undefined && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-muted)' }}>{cat.productCount} Products</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}>
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(cat._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--color-muted)', gridColumn: '1 / -1' }}>No categories found.</p>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(138,111,46,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="font-display" style={{ fontSize: '1.3rem' }}>{editCat ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label-luxury">Category Name *</label>
                <input className="input-luxury" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. T-Shirts" required />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-white)' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ accentColor: 'var(--color-gold)' }} />
                Feature this category on the homepage
              </label>
              <ImageUploader images={form.images} onImagesChange={imgs => setForm(f => ({ ...f, images: imgs }))} maxImages={1} />
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ fontSize: '0.78rem' }}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving} style={{ fontSize: '0.78rem' }}>
                  {saving ? 'Saving...' : editCat ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
