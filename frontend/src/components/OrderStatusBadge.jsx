import STATUS_CONFIG from '../utils/orderStatusColors';

const OrderStatusBadge = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || { color: '#7A7A7A', bg: 'rgba(122,122,122,0.12)', label: status };

  const fontSize  = size === 'sm' ? '0.65rem' : '0.75rem';
  const padding   = size === 'sm' ? '0.2rem 0.6rem' : '0.3rem 0.9rem';

  return (
    <span
      className="badge"
      style={{
        color:       config.color,
        background:  config.bg,
        border:      `1px solid ${config.color}40`,
        fontSize,
        padding,
        letterSpacing: '0.08em',
      }}
    >
      {config.label || status}
    </span>
  );
};

export default OrderStatusBadge;
