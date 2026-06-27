const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 24, md: 40, lg: 60 };
  const dim = sizes[size] || 40;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
      <div style={{
        width:  `${dim}px`,
        height: `${dim}px`,
        borderRadius: '50%',
        border: `${dim * 0.07}px solid rgba(201,168,76,0.15)`,
        borderTopColor: 'var(--color-gold)',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {text}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div className="skeleton" style={{ aspectRatio: '4/5' }} />
    <div style={{ padding: '1rem' }}>
      <div className="skeleton" style={{ height: '10px', width: '40%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '14px', width: '30%' }} />
    </div>
  </div>
);

export const FullPageLoader = ({ text = 'Loading...' }) => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export default LoadingSpinner;
