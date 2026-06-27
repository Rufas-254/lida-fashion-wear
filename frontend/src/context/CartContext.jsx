import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_KEY = 'lida_cart';

const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  // Persist cart on every change
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  // Unique key per cart entry (product + size + color)
  const getItemKey = (item) =>
    `${item.product || item._id}_${item.size}_${item.color || ''}`;

  const addToCart = (product, size, color, quantity = 1) => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    const newItem = {
      product:      product._id,
      productName:  product.name,
      productImage: product.images?.[0] || '',
      price:        product.price,
      size,
      color: color || '',
      quantity,
    };

    const key = getItemKey(newItem);

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => getItemKey(i) === key);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        toast.success('Cart updated ✓');
        return updated;
      }
      toast.success(`${product.name} added to cart 👑`);
      return [...prev, newItem];
    });
  };

  const removeFromCart = (product, size, color) => {
    const key = `${product}_${size}_${color || ''}`;
    setCartItems((prev) => prev.filter((i) => getItemKey(i) !== key));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (product, size, color, quantity) => {
    if (quantity < 1) return;
    const key = `${product}_${size}_${color || ''}`;
    setCartItems((prev) =>
      prev.map((i) => (getItemKey(i) === key ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Format items for order placement
  const getOrderItems = () =>
    cartItems.map((i) => ({
      product:     i.product,
      productName: i.productName,
      size:        i.size,
      color:       i.color,
      quantity:    i.quantity,
      unitPrice:   i.price,
      subtotal:    i.price * i.quantity,
    }));

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQuantity,
      clearCart, getOrderItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
