import { getStatusStep } from '../utils/orderStatusColors';

const STEPS = [
  { key: 'Pending',           label: 'Pending',           desc: 'Order received, awaiting confirmation', icon: '📋' },
  { key: 'Confirmed',         label: 'Confirmed',         desc: 'Order confirmed by team', icon: '✅' },
  { key: 'Processing',        label: 'Processing',        desc: 'Items being packed and prepared', icon: '📦' },
  { key: 'Shipped',           label: 'Shipped',           desc: 'Order dispatched for delivery', icon: '🚚' },
  { key: 'Out for Delivery',  label: 'Out for Delivery',  desc: 'With delivery agent', icon: '🏃' },
  { key: 'Delivered',         label: 'Delivered',         desc: 'Order delivered successfully', icon: '🎉' },
];

const TrackingTimeline = ({ status, trackingNote }) => {
  if (status === 'Cancelled') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(192,57,43,0.15)', border: '2px solid var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>✕</div>
        <p className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-error)' }}>Order Cancelled</p>
        {trackingNote && (
          <div className="tracking-note" style={{ marginTop: '1.5rem', maxWidth: '500px', margin: '1.5rem auto 0' }}>
            {trackingNote}
          </div>
        )}
      </div>
    );
  }

  const currentStep = getStatusStep(status);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent   = idx === currentStep;
          const isFuture    = idx > currentStep;

          return (
            <div key={step.key} style={{ display: 'flex', gap: '1.25rem', marginBottom: idx < STEPS.length - 1 ? '0' : '0', alignItems: 'flex-start' }}>
              {/* Node + Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  className={`timeline-node ${isCompleted ? 'completed' : isCurrent ? 'current' : ''}`}
                  style={{
                    width: '24px', height: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isFuture ? '0' : '0.7rem',
                  }}
                >
                  {isCompleted && (
                    <svg width="12" height="12" fill="none" stroke="#0A0A0A" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{
                    width: '2px', height: '48px',
                    background: isCompleted ? 'var(--color-gold)' : 'rgba(138,111,46,0.25)',
                    transition: 'background 0.4s ease',
                    marginTop: '2px',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: idx < STEPS.length - 1 ? '0' : '0', paddingTop: '2px', minHeight: idx < STEPS.length - 1 ? '64px' : 'auto' }}>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCompleted || isCurrent ? 'var(--color-gold)' : 'var(--color-muted)',
                  letterSpacing: '0.05em',
                  marginBottom: '2px',
                  transition: 'color 0.3s ease',
                }}>
                  {step.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: isFuture ? 'rgba(122,122,122,0.5)' : 'var(--color-muted)',
                  fontStyle: 'italic',
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Note */}
      {trackingNote && (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Latest Update from LIDA Team
          </p>
          <div className="tracking-note">{trackingNote}</div>
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;
