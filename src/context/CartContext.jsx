import React, { createContext, useState, useRef } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const onCartAddRef = useRef(null)

  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, id: Date.now() }])
    // Trigger animation callback
    if (onCartAddRef.current) {
      onCartAddRef.current()
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ))
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price?.toString().replace('R$', '').replace(',', '.')) || 0
      const qty = item.quantity || 1
      // Se é por cento, calcula quantidade / 100 * preço
      // Se é por unidade, calcula quantidade * preço
      const itemPrice = item.unit === 'cento' ? (price * qty / 100) : (price * qty)
      return total + itemPrice
    }, 0)
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, onCartAddRef }}>
      {children}
    </CartContext.Provider>
  )
}
