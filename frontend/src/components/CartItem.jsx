import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto',
      gap: '1rem',
      alignItems: 'center',
      padding: '1rem',
      background: 'var(--color-surface)',
      border: 'var(--border-gold-dim)',
      borderRadius: '4px',
      marginBottom: '0.75rem',
      transition: 'var(--transition-base)',
    }}>
      {/* Image */}
      <div style={{ width: '80px', height: '80px', borderRadius: '3px', overflow: 'hidden', background: 'var(--color-surface-2)', flexShrink: 0 }}>
        {item.productImage ? (
          <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" stroke="rgba(138,111,46,0.4)" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h4 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-white)', marginBottom: '0.25rem' }}>
          {item.productName}
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Size: {item.size}
          </span>
          {item.color && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Color: {item.color}
            </span>
          )}
        </div>

        {/* Quantity stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            id={`qty-dec-${item.product}-${item.size}`}
            onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}
            disabled={item.quantity <= 1}
            style={{
              width: '28px', height: '28px', borderRadius: '2px',
              background: 'var(--color-surface-2)',
              border: 'var(--border-gold-dim)',
              color: item.quantity <= 1 ? 'var(--color-muted)' : 'var(--color-white)',
              fontSize: '1rem', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >−</button>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--color-white)', minWidth: '24px', textAlign: 'center' }}>
            {item.quantity}
          </span>
          <button
            id={`qty-inc-${item.product}-${item.size}`}
            onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}
            style={{
              width: '28px', height: '28px', borderRadius: '2px',
              background: 'var(--color-surface-2)',
              border: 'var(--border-gold-dim)',
              color: 'var(--color-white)',
              fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >+</button>
        </div>
      </div>

      {/* Price + Remove */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: 'var(--color-gold)', fontWeight: 700 }}>
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          id={`remove-${item.product}-${item.size}`}
          onClick={() => removeFromCart(item.product, item.size, item.color)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', transition: 'var(--transition-base)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
          title="Remove item"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
