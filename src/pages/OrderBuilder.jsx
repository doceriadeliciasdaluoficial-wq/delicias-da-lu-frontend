import React, { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { CAKE_BUILDER, CONTACTS } from '../config'
import { formatPrice } from '../utils/formatPrice'
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../components/Button'
import { actionButtonContainer } from '../styles/buttonClasses'

export default function OrderBuilder({ setCurrentPage }) {
  const [step, setStep] = useState(0)
  const [customKg, setCustomKg] = useState('')
  const [hasSecondaryFilling, setHasSecondaryFilling] = useState(false)
  const [order, setOrder] = useState({
    size: '',
    mass: 'branca',
    filling: '',
    secondaryFilling: '',
    topping: '',
    decoration: ''
  })
  const { addToCart } = useContext(CartContext)

  const steps = ['Recheio', 'Massa', 'Cobertura', 'Decoração', 'Tamanho', 'Resumo']
  const options = [CAKE_BUILDER.fillings, CAKE_BUILDER.masses, CAKE_BUILDER.toppings, CAKE_BUILDER.decorations, CAKE_BUILDER.sizes, []]
  const optionKeys = ['filling', 'mass', 'topping', 'decoration', 'size', null]
  const selectedPrimaryFilling = CAKE_BUILDER.fillings.find(f => f.id === order.filling)
  const selectedSecondaryFilling = CAKE_BUILDER.fillings.find(f => f.id === order.secondaryFilling)
  const selectedFillings = [selectedPrimaryFilling, selectedSecondaryFilling].filter(Boolean)
  const fillingCharge = selectedFillings.reduce((highest, filling) => Math.max(highest, filling.value), 0)
  const selectedMass = CAKE_BUILDER.masses.find(m => m.id === order.mass) || CAKE_BUILDER.masses.find(m => m.id === 'branca')
  const selectedTopping = CAKE_BUILDER.toppings.find(t => t.id === order.topping)
  const selectedDecoration = CAKE_BUILDER.decorations.find(d => d.id === order.decoration)
  const selectedSize = CAKE_BUILDER.sizes.find(s => s.id === order.size)
  const customKgValue = customKg ? parseFloat(String(customKg).replace(',', '.')) : null
  const selectedKg = customKgValue || (selectedSize ? parseFloat(selectedSize.id.replace('kg', '')) : 0)
  const displayKg = selectedKg ? String(selectedKg).replace('.', ',') : ''
  const sizeDisplay = selectedKg ? `${displayKg} kg` : 'Não selecionado'
  const perKgPrice = selectedKg
    ? fillingCharge + (selectedMass?.value || 0) + (selectedTopping?.value || 0) + (selectedDecoration?.value || 0)
    : 0
  const sizeBaseDisplay = selectedKg ? `${formatPrice(perKgPrice, false)}/kg` : 'Não selecionado'

  const getFillingLabel = () => {
    if (!selectedFillings.length) return 'Não selecionado'
    return selectedFillings.map(filling => filling.label).join(' + ')
  }

  const summaryRows = [
    ['Recheio', order.filling, getFillingLabel()],
    ['Massa', order.mass, selectedMass?.label],
    ['Cobertura', order.topping, selectedTopping?.label],
    ['Decoração', order.decoration, selectedDecoration?.label],
    ['Tamanho', order.size || customKg, sizeDisplay],
    ['Valor por kg', order.size || customKg, sizeBaseDisplay]
  ]
  const summaryGroups = [
    {
      title: 'Sabores',
      items: [
        ['Recheio', getFillingLabel()],
        ['Massa', selectedMass?.label]
      ]
    },
    {
      title: 'Acabamento',
      items: [
        ['Cobertura', selectedTopping?.label],
        ['Decoração', selectedDecoration?.label]
      ]
    },
    {
      title: 'Tamanho',
      items: [
        ['Quantidade', sizeDisplay],
        ['Valor por kg', sizeBaseDisplay]
      ]
    }
  ]

  const handleSelect = (value) => {
    if (step === 0) {
      setOrder(prev => ({
        ...prev,
        filling: value,
        secondaryFilling: prev.secondaryFilling === value ? '' : prev.secondaryFilling
      }))
    } else if (step === 1) {
      setOrder(prev => ({ ...prev, mass: value }))
    } else if (step === 2) {
      setOrder(prev => ({ ...prev, topping: value }))
    } else if (step === 3) {
      setOrder(prev => ({ ...prev, decoration: value }))
    } else if (step === 4) {
      setOrder(prev => ({ ...prev, size: value }))
      setCustomKg('')
    } else {
      setOrder(prev => ({ ...prev, [optionKeys[step]]: value }))
    }
  }

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const calculatePrice = () => {
    if (!selectedKg) return 0

    return selectedKg * perKgPrice
  }

  const buildWhatsAppMessage = () => {
    const totalPrice = formatPrice(calculatePrice(), false)
    const massPrice = formatPrice(selectedMass?.value, false)
    const toppingPrice = formatPrice(selectedTopping?.value, false)
    const decorationPrice = formatPrice(selectedDecoration?.value, false)
    const fillingPrice = formatPrice(fillingCharge, false)

    return [
      'Oi Lú! Vi seu Cake Builder e gostaria de fazer um bolo personalizado:',
      '',
      `- Recheio: ${getFillingLabel()}`,
      `- Valor do recheio: R$ ${fillingPrice}`,
      `- Massa: ${selectedMass?.label || 'Não definido'}`,
      `- Valor da massa: R$ ${massPrice}`,
      `- Cobertura: ${selectedTopping?.label || 'Não definida'}`,
      `- Valor da cobertura: R$ ${toppingPrice}`,
      `- Decoração: ${selectedDecoration?.label || 'Não definida'}`,
      `- Valor da decoração: R$ ${decorationPrice}`,
      `- Tamanho: ${sizeDisplay}`,
      `- Valor por kg: ${sizeBaseDisplay}`,
      `- Valor total: R$ ${totalPrice}`,
      '',
      'Se precisar, posso ajustar qualquer detalhe antes de confirmar.'
    ].join('\n')
  }

  const handleAddToCart = () => {
    const massObj = CAKE_BUILDER.masses.find(m => m.id === order.mass)
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
        size: sizeDisplay,
        mass: massObj?.label,
        kg: selectedKg,
        pricePerKg: perKgPrice,
        filling: getFillingLabel(),
        fillings: selectedFillings.map(filling => filling.label),
        topping: toppingObj?.label,
        decoration: decorationObj?.label
      }
    }

    addToCart(cakeItem)
    setStep(0)
    setOrder({ size: '', mass: 'branca', filling: '', secondaryFilling: '', topping: '', decoration: '' })
    setHasSecondaryFilling(false)
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
          <div className="flex justify-between mb-12 gap-2 flex-wrap">
            {steps.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className="flex-1 min-w-[110px] flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    i === step ? 'bg-primary text-white' : i < step ? 'bg-primary/80 text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {i + 1}
                </div>
                <p className={`mt-2 font-label-md text-label-md text-center ${i === step ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {s}
                </p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Current Step Content */}
              <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant mb-8">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6">{steps[step]}</h2>

                {step === 5 ? (
                  <div className="space-y-4 mb-8">
                    <div className="rounded-xl border border-outline-variant bg-surface-container/30 p-5">
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Resumo do pedido</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        {summaryGroups.map((group) => (
                          <div key={group.title} className="rounded-lg border border-outline-variant bg-surface p-4">
                            <p className="font-label-md text-label-md text-primary mb-3">{group.title}</p>
                            <div className="space-y-2">
                              {group.items.map(([label, value]) => (
                                <div key={label} className="flex flex-col gap-1">
                                  <span className="text-body-sm text-on-surface-variant">{label}</span>
                                  <span className="font-semibold text-on-surface">{value || 'Não selecionado'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
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
                            {step === 4 && option.weight && (
                              <div className="flex gap-4 mt-2 text-body-sm text-on-surface-variant">
                                <span>📏 {option.weight}</span>
                                <span>👥 {option.servings}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-shrink-0 text-right">
                            {step !== 4 && (
                              <span className={`font-label-md text-label-md font-bold ${selectedValue === option.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                                +{formatPrice(option.value, false)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Optional second filling */}
                {step === 0 && (
                  <div className="mb-8 p-4 rounded-lg border border-outline-variant bg-surface-container/40">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">Segundo recheio opcional</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Se adicionar outro recheio, a cobrança considera apenas o de maior valor.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!order.filling) return
                          setHasSecondaryFilling(prev => {
                            const nextValue = !prev
                            if (!nextValue) {
                              setOrder(current => ({ ...current, secondaryFilling: '' }))
                            }
                            return nextValue
                          })
                        }}
                        disabled={!order.filling}
                        className="px-4 py-2 rounded-lg border border-outline-variant font-label-md text-label-md text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {hasSecondaryFilling ? 'Remover segundo recheio' : 'Adicionar segundo recheio'}
                      </button>
                    </div>

                    {!hasSecondaryFilling && (
                      <p className="font-body-sm text-body-sm text-primary mb-4">
                        Adicione um segundo recheio se quiser combinar sabores. A cobrança segue o recheio de maior valor.
                      </p>
                    )}

                    {hasSecondaryFilling && order.filling && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CAKE_BUILDER.fillings
                          .filter(filling => filling.id !== order.filling)
                          .map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setOrder(prev => ({
                                  ...prev,
                                  secondaryFilling: prev.secondaryFilling === option.id ? '' : option.id
                                }))
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                order.secondaryFilling === option.id
                                  ? 'border-tertiary bg-tertiary/10'
                                  : 'border-outline-variant bg-surface hover:border-tertiary/50'
                              }`}
                            >
                              <p className="font-headline-sm text-headline-sm text-on-surface">{option.label}</p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">+{formatPrice(option.value, false)}</p>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Weight Input (for step 4 only) */}
                {step === 4 && (
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
                      ℹ️ Informe a quantidade em kg. O valor por kg será calculado com base no recheio, massa e adicionais escolhidos. Deixe vazio para usar os tamanhos predefinidos.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 5 && (
                  <div className="flex gap-4">
                    <SecondaryButton
                      onClick={handlePrev}
                      disabled={step === 0}
                    >
                      ← Anterior
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={handleNext}
                      disabled={!selectedValue && !(step === 4 && customKg && customKg > 0)}
                    >
                      Próximo →
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Summary */}
            <div className="lg:col-span-1">
              {/* Price Preview Card */}
              <div className="bg-gradient-to-br from-tertiary/20 to-tertiary/10 p-6 rounded-lg border-2 border-tertiary sticky top-32">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 pb-4 border-b border-tertiary">
                  {step === 5 ? '✅ Pedido pronto' : '📋 Seu Bolo'}
                </h3>

                {/* Quick Summary */}
                {step === 5 ? (
                  <div className="space-y-3 mb-6">
                    <div className="rounded-lg bg-surface p-4 border border-outline-variant">
                      <p className="font-label-md text-label-md text-on-surface-variant">Resumo rápido</p>
                      <p className="font-body-md text-body-md text-on-surface mt-2">
                        {getFillingLabel()} • {selectedMass?.label || 'Massa não selecionada'} • {sizeDisplay}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-4 border border-outline-variant">
                      <div className="flex justify-between items-center">
                        <span className="font-label-md text-label-md text-on-surface-variant">Total</span>
                        <span className="font-headline-md text-headline-md text-primary">{formatPrice(calculatePrice(), false)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {[
                      ['Recheio', order.filling, getFillingLabel()],
                      ['Massa', order.mass, selectedMass?.label],
                      ['Cobertura', order.topping, selectedTopping?.label],
                      ['Decoração', order.decoration, selectedDecoration?.label],
                      ['Tamanho', order.size || customKg, sizeDisplay]
                    ].map(([label, key, value]) => (
                      <div key={label}>
                        <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
                        <p className={`font-body-md font-bold ${key ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {value || 'Não selecionado'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="bg-surface-container p-4 rounded-lg mb-6 border border-outline-variant">
                  <div className="space-y-2 mb-3 pb-3 border-b border-outline-variant text-body-sm">
                    {order.filling && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Recheio:</span>
                        <span className="font-bold text-on-surface">{formatPrice(fillingCharge, false)}</span>
                      </div>
                    )}
                    {order.mass && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Massa:</span>
                        <span className="font-bold text-on-surface">{formatPrice(selectedMass?.value, false)}</span>
                      </div>
                    )}
                    {order.topping && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Cobertura:</span>
                        <span className="font-bold text-on-surface">{formatPrice(selectedTopping?.value, false)}</span>
                      </div>
                    )}
                    {order.decoration && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Decoração:</span>
                        <span className="font-bold text-on-surface">{formatPrice(selectedDecoration?.value, false)}</span>
                      </div>
                    )}
                    {(order.size || customKg) && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Tamanho:</span>
                        <span className="font-bold text-on-surface">{sizeDisplay}</span>
                      </div>
                    )}
                    {(order.size || customKg) && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Valor por kg:</span>
                        <span className="font-bold text-on-surface">{sizeBaseDisplay}</span>
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
                  💡 Customize cada etapa. O total é calculado por kg com base no recheio, massa e adicionais escolhidos.
                </p>

                {/* Action Buttons - Only on final step */}
                {step === 5 && (
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
                        window.open(CONTACTS.whatsapp.link + '?text=' + encodeURIComponent(buildWhatsAppMessage()), '_blank')
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
