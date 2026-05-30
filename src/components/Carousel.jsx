import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * CAROUSEL — Componente de carrossel horizontal com auto-play
 * Usado em "Home" para destaques
 * 
 * Props:
 * - items: array de items para exibir
 * - autoPlayInterval: intervalo em ms (padrão 4000)
 * - renderItem: função para renderizar cada item
 * - onItemClick: callback ao clicar em item
 */
export default function Carousel({
  items = [],
  autoPlayInterval = 4000,
  renderItem = (item) => <div>{item}</div>,
  onItemClick = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlay || items.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isAutoPlay, items.length, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  if (items.length === 0) return null

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Container do carrossel */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="min-w-full"
              onClick={() => onItemClick(item, index)}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-chocolate p-2 rounded-full shadow-lg transition-colors z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-chocolate p-2 rounded-full shadow-lg transition-colors z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicadores (dots) */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              w-2 h-2 rounded-full transition-colors
              ${index === currentIndex ? 'bg-rose' : 'bg-gray-300 hover:bg-gray-400'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
