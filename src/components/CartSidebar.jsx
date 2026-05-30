import React, { useState, useContext, useEffect } from 'react'
import { CartContext } from '../context/CartContext'
import html2pdf from 'html2pdf.js'
import { CONTACTS } from '../config'
import { formatPrice, calculateSubtotal } from '../utils/formatPrice'

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, onCartAddRef } = useContext(CartContext)

  useEffect(() => {
    const triggerAnimation = () => {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 600)
    }
    onCartAddRef.current = triggerAnimation
  }, [])

  const formatCurrency = (value) => {
    const numericValue = parseFloat(String(value).replace(',', '.')) || 0
    return `R$ ${numericValue.toFixed(2).replace('.', ',')}`
  }

  const buildCartItemMessage = (item, index) => {
    const price = parseFloat(String(item.price).replace(',', '.')) || 0
    const quantity = item.quantity || 1
    const subtotal = calculateSubtotal(price, quantity, item.unit || 'un')

    const lines = [`${index + 1}. ${item.name}`]

    if (item.details?.kg) {
      lines.push(`   • Quantidade: ${String(item.details.kg).replace('.', ',')} kg`)
    } else if (item.quantity) {
      lines.push(`   • Quantidade: ${quantity} un`)
    }

    if (item.details?.fillings?.length) {
      lines.push(`   • Recheio: ${item.details.fillings.join(' + ')}`)
    } else if (item.details?.filling) {
      lines.push(`   • Recheio: ${item.details.filling}`)
    }

    if (item.details?.mass) {
      lines.push(`   • Massa: ${item.details.mass}`)
    }

    if (item.details?.topping) {
      lines.push(`   • Cobertura: ${item.details.topping}`)
    }

    if (item.details?.decoration) {
      lines.push(`   • Decoração: ${item.details.decoration}`)
    }

    if (item.details?.pricePerKg) {
      lines.push(`   • Valor por kg: ${formatCurrency(item.details.pricePerKg)}/kg`)
    } else {
      lines.push(`   • Preço unitário: ${formatCurrency(price)}/${item.unit || 'un'}`)
    }

    lines.push(`   • Subtotal: ${subtotal}`)

    return lines.join('\n')
  }

  const buildWhatsAppMessage = () => {
    const itemsBlock = cartItems.map((item, index) => buildCartItemMessage(item, index)).join('\n\n')
    const totalBlock = `Total do pedido: R$ ${getTotalPrice().toFixed(2).replace('.', ',')}`

    return [
      'Oi Lú! Aqui está meu pedido:',
      '',
      itemsBlock,
      '',
      totalBlock,
      '',
      'Se quiser, posso ajustar qualquer detalhe antes de fechar.'
    ].join('\n')
  }

  const generatePDF = () => {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff;">
        <h1 style="text-align: center; color: #D62A2A; margin-bottom: 10px;">Delícias da Lú</h1>
        <h2 style="text-align: center; color: #666; font-size: 16px; margin-bottom: 30px;">Pré-Orçamento de Pedido</h2>
        
        <div style="margin-bottom: 20px;">
          ${cartItems.map((item, idx) => {
            const price = parseFloat(item.price.toString().replace(',', '.')) || 0
            const qty = item.quantity || 1
            const itemPrice = item.unit === 'cento' 
              ? (price * qty / 100).toFixed(2)
              : (price * qty).toFixed(2)
            const unitDisplay = item.unit === 'cento' ? '/cento' : '/un'
            
            return `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <p style="margin: 0; font-weight: bold; color: #D62A2A; font-size: 14px;">${item.name}</p>
                ${item.details ? `
                  <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    ${item.details.size ? `<p style="margin: 3px 0;">• Tamanho: ${item.details.size}</p>` : ''}
                    ${item.details.mass ? `<p style="margin: 3px 0;">• Massa: ${item.details.mass}</p>` : ''}
                    ${item.details.fillings?.length ? `<p style="margin: 3px 0;">• Recheio: ${item.details.fillings.join(' + ')}</p>` : item.details.filling ? `<p style="margin: 3px 0;">• Recheio: ${item.details.filling}</p>` : ''}
                    ${item.details.topping ? `<p style="margin: 3px 0;">• Cobertura: ${item.details.topping}</p>` : ''}
                    ${item.details.decoration ? `<p style="margin: 3px 0;">• Decoração: ${item.details.decoration}</p>` : ''}
                  </div>
                ` : ''}
                <div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 12px;">
                  <span>Quantidade: ${qty} ${item.unit === 'cento' ? 'un' : 'un'}</span>
                  <span>Preço: ${price.toFixed(2).replace('.', ',')}${unitDisplay}</span>
                  <span style="font-weight: bold;">Subtotal: ${itemPrice.replace('.', ',')}</span>
                </div>
              </div>
            `
          }).join('')}
        </div>


        <div style="background: #FDF6EC; padding: 15px; border-radius: 8px; border: 2px solid #D62A2A; text-align: right;">
          <h3 style="margin: 0; color: #D62A2A; font-size: 20px;">
            Total: R$ ${getTotalPrice().toFixed(2).replace('.', ',')}
          </h3>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
          <p>Pedido gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>Entre em contato para confirmar disponibilidade e delivery!</p>
          <p>WhatsApp: (11) 94575-4150</p>
        </div>
      </div>
    `

    const options = {
      margin: 10,
      filename: `Orçamento-Delícias-da-Lú-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }

    html2pdf().set(options).from(element).save()
  }

  return (
    <>
      {/* Cart Button - Fixed Top Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 top-24 z-40 flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 ${
          animating ? 'animate-pulse scale-125' : ''
        }`}
        title="Abrir carrinho"
      >
        <div className="relative">
          <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-tertiary text-on-tertiary text-xs font-bold rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Cart Sidebar - Drawer from Right */}
      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-surface z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined">shopping_bag</span>
            Meu Carrinho
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 opacity-50">
                shopping_bag
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Seu carrinho está vazio
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-label-md text-label-md text-on-surface font-medium line-clamp-2">
                        {item.name}
                      </p>
                      {item.details && (
                        <div className="mt-2 p-2 bg-background rounded text-xs text-on-surface-variant space-y-1">
                          {item.details.size && <p><span className="font-semibold">Tamanho:</span> {item.details.size}</p>}
                          {item.details.mass && <p><span className="font-semibold">Massa:</span> {item.details.mass}</p>}
                          {item.details.fillings?.length ? <p><span className="font-semibold">Recheio:</span> {item.details.fillings.join(' + ')}</p> : item.details.filling && <p><span className="font-semibold">Recheio:</span> {item.details.filling}</p>}
                          {item.details.topping && <p><span className="font-semibold">Cobertura:</span> {item.details.topping}</p>}
                          {item.details.decoration && <p><span className="font-semibold">Decoração:</span> {item.details.decoration}</p>}
                        </div>
                      )}
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        R$ {item.price}/{item.unit || 'un'}
                      </p>
                      {item.quantity && (
                        <div className="mt-1">
                          <p className="font-body-sm text-primary font-semibold">
                            {item.unit === 'cento' 
                              ? `R$ ${(parseFloat(item.price.toString().replace(',', '.')) * item.quantity / 100).toFixed(2).replace('.', ',')} (${item.quantity} un)`
                              : `R$ ${(parseFloat(item.price.toString().replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')} (${item.quantity} un)`
                            }
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-error hover:text-error-light transition-colors ml-2 flex-shrink-0"
                      title="Remover"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>

                  {/* Quantity Control for Sweets */}
                  {item.quantity !== undefined && (
                    <div className="bg-background rounded-lg p-2 border border-outline-variant w-full min-w-0">
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 truncate">Quantidade {item.unit === 'cento' ? '(mín. 25 un)' : '(mín. 15 un)'}</p>
                      <div className="flex items-center justify-between gap-1 w-full">
                        <button
                          onClick={() => {
                            const min = item.unit === 'cento' ? 25 : 15
                            updateQuantity(item.id, Math.max(min, (item.quantity || min) - (item.unit === 'cento' ? 25 : 15)))
                          }}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-primary hover:text-primary-light hover:bg-primary/10 transition-colors rounded border border-outline-variant"
                          title="Diminuir"
                        >
                          <span className="material-symbols-outlined text-base">remove</span>
                        </button>
                        <input
                          type="number"
                          min={item.unit === 'cento' ? '25' : '15'}
                          step={item.unit === 'cento' ? '25' : '15'}
                          value={item.quantity || 1}
                          onChange={(e) => {
                            const min = item.unit === 'cento' ? 25 : 15
                            const val = Math.max(min, parseInt(e.target.value) || min)
                            updateQuantity(item.id, val)
                          }}
                          className="flex-1 text-center font-label-md text-label-md border border-outline-variant rounded bg-surface px-1 py-1 focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                        />
                        <button
                          onClick={() => {
                            const step = item.unit === 'cento' ? 25 : 15
                            updateQuantity(item.id, (item.quantity || step) + step)
                          }}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-primary hover:text-primary-light hover:bg-primary/10 transition-colors rounded border border-outline-variant"
                          title="Aumentar"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-outline-variant px-6 py-4 space-y-4 bg-surface-container-lowest">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total do Pedido</p>
              <p className="font-display-sm text-headline-md text-primary font-bold">
                R$ {getTotalPrice().toFixed(2).replace('.', ',')}
              </p>
            </div>

            <a
              href={`${CONTACTS.whatsapp.link}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-primary-light transition-colors shadow-md block text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              Finalizar Pedido
            </a>

            <button
              onClick={generatePDF}
              className="w-full py-2 bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-highest/80 transition-colors border border-outline-variant text-sm flex items-center justify-center gap-2"
              title="Gerar PDF com orçamento"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Gerar PDF
            </button>

            <button
              onClick={clearCart}
              className="w-full py-2 bg-error/10 text-error font-label-md text-label-md rounded-lg hover:bg-error/20 transition-colors border border-error/20"
            >
              Limpar Carrinho
            </button>
          </div>
        )}
      </div>
    </>
  )
}

