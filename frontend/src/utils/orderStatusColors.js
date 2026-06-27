/**
 * Order status configuration — colors and labels
 */
export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const STATUS_CONFIG = {
  Pending: {
    color:   '#C9A84C',
    bg:      'rgba(201, 168, 76, 0.12)',
    label:   'Pending',
    step:    0,
  },
  Confirmed: {
    color:   '#E8C97A',
    bg:      'rgba(232, 201, 122, 0.12)',
    label:   'Confirmed',
    step:    1,
  },
  Processing: {
    color:   '#4A90D9',
    bg:      'rgba(74, 144, 217, 0.12)',
    label:   'Processing',
    step:    2,
  },
  Shipped: {
    color:   '#9B59B6',
    bg:      'rgba(155, 89, 182, 0.12)',
    label:   'Shipped',
    step:    3,
  },
  'Out for Delivery': {
    color:   '#E67E22',
    bg:      'rgba(230, 126, 34, 0.12)',
    label:   'Out for Delivery',
    step:    4,
  },
  Delivered: {
    color:   '#27AE60',
    bg:      'rgba(39, 174, 96, 0.12)',
    label:   'Delivered',
    step:    5,
  },
  Cancelled: {
    color:   '#C0392B',
    bg:      'rgba(192, 57, 43, 0.12)',
    label:   'Cancelled',
    step:    -1,
  },
};

/**
 * Get the step index of a status in the tracking sequence
 */
export const getStatusStep = (status) => {
  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  return steps.indexOf(status);
};

export default STATUS_CONFIG;
