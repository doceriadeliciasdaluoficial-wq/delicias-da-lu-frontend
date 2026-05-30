import React, { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { CAKE_BUILDER, CONTACTS } from '../config'
import { formatPrice } from '../utils/formatPrice'
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../components/Button'
import { actionButtonContainer } from '../styles/buttonClasses'

export default function OrderBuilder({ setCurrentPage }) {
  const [step, setStep] = useState(0)
  const [customKg, setCustomKg] = useState('')
  const [order, setOrder] = useState({
    size: '',
    mass: '',
    filling: '',
    topping: '',
    decoration: ''
  })
  const { addToCart } = useContext(CartContext)

  const steps = ['Tamanho', 'Massa', 'Recheio', 'Cobertura', 'Decoração']
  const options = [CAKE_BUILDER.sizes, CAKE_BUILDER.masses, CAKE_BUILDER.fillings, CAKE_BUILDER.toppings, CAKE_BUILDER.decorations]
  const optionKeys = ['size', 'mass', 'filling', 'topping', 'decoration']

  const handleSelect = (value) => {
    // Se está no step 0 (tamanho) e clicando em um tamanho predefinido, limpar custom kg
    if (step === 0) {
      if (order[optionKeys[step]] === value) {
        setOrder(prev => ({ ...prev, [optionKeys[step]]: '' }))
      } else {
        setOrder(prev => ({ ...prev, [optionKeys[step]]: value }))
        setCustomKg('') // Limpa custom kg quando seleciona tamanho predefinido
      }
    } else {
      // Para outros steps, usa toggle normal
      if (order[optionKeys[step]] === value) {
        setOrder(prev => ({ ...prev, [optionKeys[step]]: '' }))
      } else {
        setOrder(prev => ({ ...prev, [optionKeys[step]]: value }))
      }
    }
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const calculatePrice = () => {
    // Se houver quantidade customizada em kg, calcule o preço
    if (customKg && !isNaN(customKg) && customKg > 0) {
      const baseSize = CAKE_BUILDER.sizes[0] // 1kg = 65
      const pricePerKg = baseSize.value
      const kg = parseFloat(customKg)
      
      let total = pricePerKg * kg
      const mass = CAKE_BUILDER.masses.find(m => m.id === order.mass)
      if (mass) total += mass.value * kg
      const filling = CAKE_BUILDER.fillings.find(f => f.id === order.filling)
      if (filling) total += filling.value * kg
      const topping = CAKE_BUILDER.toppings.find(t => t.id === order.topping)
      if (topping) total += topping.value * kg
      const decoration = CAKE_BUILDER.decorations.find(d => d.id === order.decoration)
      if (decoration) total += decoration.value * kg
      return total
    }

    // Preço dos tamanhos predefinidos
    let total = 0
    const sizes = CAKE_BUILDER.sizes.find(s => s.id === order.size)
    if (sizes) total += sizes.value

    const mass = CAKE_BUILDER.masses.find(m => m.id === order.mass)
    if (mass) total += mass.value

    const filling = CAKE_BUILDER.fillings.find(f => f.id === order.filling)
    if (filling) total += filling.value

    const topping = CAKE_BUILDER.toppings.find(t => t.id === order.topping)
    if (topping) total += topping.value

    const decoration = CAKE_BUILDER.decorations.find(d => d.id === order.decoration)
    if (decoration) total += decoration.value

    return total
  }

  const handleAddToCart = () => {
    const sizeObj = CAKE_BUILDER.sizes.find(s => s.id === order.size)
    const massObj = CAKE_BUILDER.masses.find(m => m.id === order.mass)
    const fillingObj = CAKE_BUILDER.fillings.find(f => f.id === order.filling)
    const toppingObj = CAKE_BUILDER.toppings.find(t => t.id === order.topping)
    const decorationObj = CAKE_BUILDER.decorations.find(d => d.id === order.decoration)
    const totalPrice = calculatePrice()

    const cakeItem = {
      id: `cake-${Date.now()}`,
      name: 'Bolo Personalizado',
      price: totalPrice,
      quantity: 1,
      type: 'customCake',
      details: {
        size: customKg ? `${customKg}kg (Personalizado)` : sizeObj?.label,
        mass: massObj?.label,
        filling: fillingObj?.label,
        topping: toppingObj?.label,
        decoration: decorationObj?.label
      }
    }

    addToCart(cakeItem)
    setStep(0)
    setOrder({ size: '', mass: '', filling: '', topping: '', decoration: '' })
    setCustomKg('')
  }

  const currentOption = options[step] || []
  const selectedValue = order[optionKeys[step]]

  return (
    <main className="overflow-x-hidden pt-20 md:pt-20">
      <section className="min-h-screen py-16 px-6 md:px-20 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 block">cake</span>
            <h1 className="font-display-lg text-display-lg text-on-background mb-4">Monte seu Bolo</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Customize seu bolo em {steps.length} passos fáceis!
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-12 gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    i <= step ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {i + 1}
                </div>
                <p className={`mt-2 font-label-md text-label-md text-center ${i <= step ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {s}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Current Step Content */}
              <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant mb-8">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6">{steps[step]}</h2>

                <div className="space-y-4 mb-8">
                  {currentOption.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedValue === option.id
                          ? 'border-primary bg-primary/10'
                          : 'border-outline-variant bg-surface hover:border-primary/50'
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Image */}
                        {option.image && (
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                            <img 
                              src={option.image} 
                              alt={option.label}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          <p className="font-headline-md text-headline-md text-on-surface">{option.label}</p>
                          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{option.description}</p>
                          
                          {/* Weight/Servings info for sizes */}
                          {option.weight && (
                            <div className="flex gap-4 mt-2 text-body-sm text-on-surface-variant">
                              <span>📏 {option.weight}</span>
                              <span>👥 {option.servings}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <span className={`font-label-md text-label-md font-bold ${selectedValue === option.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                            +{formatPrice(option.value, false)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Weight Input (for step 0 only) */}
                {step === 0 && (
                  <div className="bg-tertiary/10 p-4 rounded-lg border border-tertiary mb-8">
                    <label className="block font-label-md text-label-md text-on-surface mb-2">
                      ⚖️ Quantidade Personalizada em kg (opcional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      placeholder="Ex: 2.5 (para 2,5 kg)"
                      value={customKg}
                      onChange={(e) => {
                        setCustomKg(e.target.value)
                        // Se está digitando um valor personalizado, limpa o tamanho predefinido
                        if (e.target.value) {
                          setOrder(prev => ({ ...prev, size: '' }))
                        }
                      }}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary"
                    />
                    <p className="text-body-sm text-on-surface-variant mt-2">
                      ℹ️ Informe a quantidade em kg. O preço será calculado como R$ 65,00/kg. Deixe vazio para usar os tamanhos predefinidos.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <SecondaryButton
                    onClick={handlePrev}
                    disabled={step === 0}
                  >
                    ← Anterior
                  </SecondaryButton>
                  {step < 4 && (
                    <PrimaryButton
                      onClick={handleNext}
                      disabled={!selectedValue && !(step === 0 && customKg && customKg > 0)}
                    >
                      Próximo →
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Summary */}
            <div className="lg:col-span-1">
              {/* Price Preview Card */}
              <div className="bg-gradient-to-br from-tertiary/20 to-tertiary/10 p-6 rounded-lg border-2 border-tertiary sticky top-32">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 pb-4 border-b border-tertiary">
                  📋 Seu Bolo
                </h3>

                {/* Quick Summary */}
                <div className="space-y-4 mb-6">
                  {/* Tamanho - show custom kg if available */}
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant">Tamanho</p>
                    <p className={`font-body-md font-bold ${customKg || order.size ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {customKg ? `${customKg}kg (Personalizado)` : (CAKE_BUILDER.sizes.find(s => s.id === order.size)?.label || 'Não selecionado')}
                    </p>
                  </div>

                  {[
                    ['Massa', order.mass, CAKE_BUILDER.masses.find(m => m.id === order.mass)?.label],
                    ['Recheio', order.filling, CAKE_BUILDER.fillings.find(f => f.id === order.filling)?.label],
                    ['Cobertura', order.topping, CAKE_BUILDER.toppings.find(t => t.id === order.topping)?.label],
                    ['Decoração', order.decoration, CAKE_BUILDER.decorations.find(d => d.id === order.decoration)?.label]
                  ].map(([label, key, value]) => (
                    <div key={label}>
                      <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
                      <p className={`font-body-md font-bold ${key ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {value || 'Não selecionado'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="bg-surface-container p-4 rounded-lg mb-6 border border-outline-variant">
                  <div className="space-y-2 mb-3 pb-3 border-b border-outline-variant text-body-sm">
                    {order.size && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Tamanho:</span>
                        <span className="font-bold text-on-surface">{formatPrice(CAKE_BUILDER.sizes.find(s => s.id === order.size)?.value, false)}</span>
                      </div>
                    )}
                    {order.mass && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Massa:</span>
                        <span className="font-bold text-on-surface">{formatPrice(CAKE_BUILDER.masses.find(m => m.id === order.mass)?.value, false)}</span>
                      </div>
                    )}
                    {order.filling && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Recheio:</span>
                        <span className="font-bold text-on-surface">{formatPrice(CAKE_BUILDER.fillings.find(f => f.id === order.filling)?.value, false)}</span>
                      </div>
                    )}
                    {order.topping && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Cobertura:</span>
                        <span className="font-bold text-on-surface">{formatPrice(CAKE_BUILDER.toppings.find(t => t.id === order.topping)?.value, false)}</span>
                      </div>
                    )}
                    {order.decoration && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Decoração:</span>
                        <span className="font-bold text-on-surface">{formatPrice(CAKE_BUILDER.decorations.find(d => d.id === order.decoration)?.value, false)}</span>
                      </div>
                    )}
                    {customKg && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Multiplicador:</span>
                        <span className="font-bold text-on-surface">{customKg}kg</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-headline-sm text-headline-sm text-on-surface">Total:</span>
                    <span className="font-headline-md text-headline-md text-primary">{formatPrice(calculatePrice(), false)}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-body-sm text-on-surface-variant mb-4">
                  💡 Customize cada etapa. Todos os valores já incluem a massa e cobertura.
                </p>

                {/* Action Buttons - Only on final step */}
                {step === 4 && (
                  <div className={actionButtonContainer}>
                    <PrimaryButton
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">shopping_cart</span>
                      Carrinho
                    </PrimaryButton>
                    <TertiaryButton
                      onClick={() => {
                        const tamanho = customKg ? `${customKg}kg (Personalizado)` : CAKE_BUILDER.sizes.find(s => s.id === order.size)?.label || 'Não definido'
                        const massa = CAKE_BUILDER.masses.find(m => m.id === order.mass)?.label || 'Não definido'
                        const recheio = CAKE_BUILDER.fillings.find(f => f.id === order.filling)?.label || 'Não definido'
                        const cobertura = CAKE_BUILDER.toppings.find(t => t.id === order.topping)?.label || 'Não definido'
                        const decoracao = CAKE_BUILDER.decorations.find(d => d.id === order.decoration)?.label || 'Não definido'
                        const preco = calculatePrice().toFixed(2)
                        const msg = `Olá! Vi seu Cake Builder e gostaria de fazer um bolo personalizado:\n\n- Tamanho: ${tamanho}\n- Massa: ${massa}\n- Recheio: ${recheio}\n- Cobertura: ${cobertura}\n- Decoração: ${decoracao}\n\nValor: R$ ${preco}`
                        window.open(CONTACTS.whatsapp.link + '?text=' + encodeURIComponent(msg), '_blank')
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">chat</span>
                      Falar com Lú
                    </TertiaryButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
