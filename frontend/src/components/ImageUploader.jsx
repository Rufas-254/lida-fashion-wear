import { useState, useRef } from 'react';
import { adminAxios } from '../api/axiosInstance';
import toast from 'react-hot-toast';

const ImageUploader = ({ images = [], onImagesChange, maxImages = 4 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const fileInputRef = useRef(null);

  const uploadFiles = async (files) => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const formData = new FormData();
      filesToUpload.forEach((f) => formData.append('images', f));

      const { data } = await adminAxios.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onImagesChange([...images, ...data.urls]);
      toast.success(`${data.urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    onImagesChange(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="label-luxury">Product Images (max {maxImages})</label>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {images.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '4px', overflow: 'hidden', border: 'var(--border-gold-dim)' }}>
              <img src={url} alt={`Product ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                  width: '20px', height: '20px', cursor: 'pointer',
                  color: 'white', fontSize: '0.7rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
              {idx === 0 && (
                <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'var(--color-gold)', color: '#0A0A0A', fontSize: '0.55rem', fontWeight: 700, padding: '1px 5px', borderRadius: '2px', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em' }}>
                  MAIN
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--color-gold)' : 'rgba(138,111,46,0.4)'}`,
            borderRadius: '4px',
            padding: '2rem',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            background: dragOver ? 'rgba(201,168,76,0.05)' : 'var(--color-surface-2)',
            transition: 'var(--transition-base)',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(201,168,76,0.2)', borderTopColor: 'var(--color-gold)', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Uploading...</p>
            </div>
          ) : (
            <>
              <svg width="32" height="32" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 0.75rem' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
                Drop images here or <span style={{ color: 'var(--color-gold)' }}>click to browse</span>
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'rgba(122,122,122,0.6)', letterSpacing: '0.06em' }}>
                JPG, PNG, WEBP — max 5MB each — {maxImages - images.length} slot(s) remaining
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => uploadFiles(e.target.files)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ImageUploader;
