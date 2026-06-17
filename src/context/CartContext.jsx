import React, { createContext, useState, useRef } from 'react'
import orderService from '../services/orderService'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onCartAddRef = useRef(null)

  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, id: Date.now() }])
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
      const itemPrice = item.unit === 'cento' ? (price * qty / 100) : (price * qty)
      return total + itemPrice
    }, 0)
  }

  const submitOrder = async (customerInfo) => {
    try {
      setIsSubmitting(true)
      const orderItems = cartItems.map(item => ({
        type: item.type || 'menu',
        menuItemId: item.menuItemId || item.id,
        cakeCustomization: item.cakeCustomization,
        quantity: item.quantity || 1,
        unitPrice: parseFloat(item.price?.toString().replace('R$', '').replace(',', '.')) || 0,
        subtotal: (item.quantity || 1) * (parseFloat(item.price?.toString().replace('R$', '').replace(',', '.')) || 0)
      }))

      const order = {
        items: orderItems,
        customerInfo
      }

      const response = await orderService.create(order)
      clearCart()
      return response
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getTotalPrice, 
      onCartAddRef,
      submitOrder,
      isSubmitting
    }}>
      {children}
    </CartContext.Provider>
  )
}
