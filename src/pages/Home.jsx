import React, { useContext, useState, useEffect, useRef } from 'react'
import { CartContext } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import { useSiteData } from '../context/SiteDataContext'
import ProductDetailsModal from '../components/ProductDetailsModal'
import sortByOrder from '../utils/sortByOrder'

export default function Home({ setCurrentPage }) {
  const { addToCart } = useContext(CartContext)
  const { cakeBuilder, contacts, siteConfig } = useSiteData()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCake, setSelectedCake] = useState(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const featuredCakes = sortByOrder(siteConfig.home?.featuredCakes || [])

  // Auto-advance carousel every 4 seconds on desktop, 5 on mobile
  useEffect(() => {
    if (!featuredCakes.length) return undefined
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCakes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredCakes.length])

  useEffect(() => {
    if (!featuredCakes.length) {
      setCurrentSlide(0)
      return
    }

    setCurrentSlide((prev) => Math.min(prev, featuredCakes.length - 1))
  }, [featuredCakes.length])

  const handleAddCake = (cake) => {
    addToCart({
      name: `Bolo ${cake.name}`,
      price: cake.basePrice,
      unit: 'un',
      quantity: 1,
      isCake: true,
      details: {
        size: cakeBuilder.sizes.find(s => s.id === cake.config.size)?.label,
        weight: cakeBuilder.sizes.find(s => s.id === cake.config.size)?.weight,
        servings: cakeBuilder.sizes.find(s => s.id === cake.config.size)?.servings,
        mass: cakeBuilder.masses.find(m => m.id === cake.config.mass)?.label,
        filling: cakeBuilder.fillings.find(f => f.id === cake.config.filling)?.label,
        topping: cakeBuilder.toppings.find(t => t.id === cake.config.topping)?.label,
        decoration: cakeBuilder.decorations.find(d => d.id === cake.config.decoration)?.label
      }
    })
  }

  const openCakeDetails = (cake) => setSelectedCake(cake)

  const closeCakeDetails = () => setSelectedCake(null)

  const handleCarouselTouchStart = (event) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleCarouselTouchEnd = (event) => {
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return

    if (deltaX < 0) {
      setCurrentSlide((prev) => (prev + 1) % featuredCakes.length)
    } else {
      setCurrentSlide((prev) => (prev - 1 + featuredCakes.length) % featuredCakes.length)
    }
  }

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img
            alt="Hero background"
            className="w-full h-full object-cover object-center filter brightness-[0.85]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVsTF38YenrHLNRZtcqgXOEqZPkCUgyQfwvJQoyH7Cq968cHS242FXmSdYy-_U4IH03m-pDADtgJm18cm4p5FhYVW_1twAkjAFt2VfK7WVDgsWOqV0zzu5VLJU9tsixuZO6PHBna8Hl2nEH1B_ZvMiFwk7-SxXeszNdf5Yynm6CqN-d7DUKrPYw9lxKzduem1MW4GotIFIfp2HC9OA7ImKndINY2SE5A2ae1rDzmZ5jRHI59n-B0Wm35RXXH_jQZ-I7s8rmLstR6Oj"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-20 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="font-headline-lg md:font-display-lg text-[2.5rem] sm:text-[3.25rem] md:text-display-lg text-white drop-shadow-lg mb-6 leading-tight">
            Delícias da Lú
          </h1>
          <p className="font-body-lg text-[1rem] sm:text-body-lg text-white/90 drop-shadow-md mb-10 max-w-xl mx-auto px-2 sm:px-0">
            Bolos artesanais feitos com amor, combinando ingredientes premium e design impecável para momentos inesquecíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage('menu')}
              className="px-8 py-4 bg-primary text-white font-label-md text-label-md rounded-lg shadow-[0_4px_16px_rgba(62,31,13,0.2)] hover:bg-surface-tint hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full sm:w-auto"
            >
              Ver Cardápio
            </button>
            <a
              href={`${contacts.whatsapp.link}?text=${encodeURIComponent(contacts.whatsapp.message.default)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-on-surface border border-outline-variant font-label-md text-label-md rounded-lg shadow-[0_4px_16px_rgba(62,31,13,0.1)] hover:bg-surface hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-primary">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
            <h2 className="font-headline-lg text-[1.8rem] sm:text-headline-lg text-on-background relative inline-block">
              Destaques da Lú
              <span className="absolute -bottom-2 left-1/4 right-1/4 h-[2px] bg-tertiary rounded-full opacity-70"></span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-2xl">
              Nossas criações mais amadas, prontas para adoçar o seu dia. Clique em "Quero esse" para adicionar ao carrinho!
            </p>
          </div>

          {/* Products Grid - Desktop / Carousel - Mobile */}
          {featuredCakes.length === 0 ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant">
              Nenhum destaque foi configurado ainda. Abra o painel de manutenção para adicionar os bolos da Home.
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCakes.map((cake, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(62,31,13,0.05)] border border-outline-variant overflow-hidden group hover:shadow-[0_8px_24px_rgba(62,31,13,0.1)] transition-shadow"
              >
                <button type="button" onClick={() => openCakeDetails(cake)} className="relative w-full aspect-square p-2 bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-5xl overflow-hidden text-left">
                  {cake.image ? (
                    <img 
                      src={cake.image} 
                      alt={cake.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : <span>🍰</span>}
                  {cake.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-tertiary-fixed/90 text-on-tertiary-fixed px-3 py-1 rounded-full font-label-md text-[12px] shadow-sm backdrop-blur-sm">
                        {cake.tag}
                      </span>
                    </div>
                  )}
                </button>
                <div className="p-6 flex flex-col gap-3">
                  <button type="button" onClick={() => openCakeDetails(cake)} className="text-left">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{cake.name}</h3>
                  </button>
                  <div className="font-label-md text-label-md text-on-surface-variant bg-tertiary/10 p-2 rounded">
                    <p className="font-bold text-tertiary">{cake.defaultWeight} - {cake.defaultConfig}</p>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">{cake.description}</p>
                  <button
                    type="button"
                    onClick={() => openCakeDetails(cake)}
                    className="w-full py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors"
                  >
                    Ler mais
                  </button>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-label-md text-label-md text-primary font-bold">{formatPrice(cake.basePrice)}</span>
                  </div>
                  <button 
                    onClick={() => handleAddCake(cake)}
                    className="mt-2 w-full py-2 bg-primary text-white border border-primary font-label-md text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                  >
                    Quero esse! ✓
                  </button>
                </div>
              </div>
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="md:hidden relative -mx-2 sm:mx-0">
                <div
                  className="overflow-hidden rounded-xl touch-pan-y"
                  onTouchStart={handleCarouselTouchStart}
                  onTouchEnd={handleCarouselTouchEnd}
                >
                  <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {featuredCakes.map((cake, i) => (
                  <div key={i} className="w-full flex-shrink-0">
                    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(62,31,13,0.05)] border border-outline-variant overflow-hidden">
                      <button type="button" onClick={() => openCakeDetails(cake)} className="relative w-full aspect-square p-2 bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-5xl overflow-hidden text-left">
                        {cake.image ? (
                          <img 
                            src={cake.image} 
                            alt={cake.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : <span>🍰</span>}
                        {cake.tag && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-tertiary-fixed/90 text-on-tertiary-fixed px-3 py-1 rounded-full font-label-md text-[12px] shadow-sm backdrop-blur-sm">
                              {cake.tag}
                            </span>
                          </div>
                        )}
                      </button>
                      <div className="p-6 flex flex-col gap-3">
                        <button type="button" onClick={() => openCakeDetails(cake)} className="text-left">
                          <h3 className="font-headline-md text-headline-md text-on-surface">{cake.name}</h3>
                        </button>
                        <div className="font-label-md text-label-md text-on-surface-variant bg-tertiary/10 p-2 rounded">
                          <p className="font-bold text-tertiary">{cake.defaultWeight} - {cake.defaultConfig}</p>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">{cake.description}</p>
                        <button
                          type="button"
                          onClick={() => openCakeDetails(cake)}
                          className="w-full py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors"
                        >
                          Ler mais
                        </button>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="font-label-md text-label-md text-primary font-bold">{formatPrice(cake.basePrice)}</span>
                        </div>
                        <button 
                          onClick={() => handleAddCake(cake)}
                          className="mt-2 w-full py-2 bg-primary text-white border border-primary font-label-md text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                        >
                          Quero esse! ✓
                        </button>
                      </div>
                    </div>
                  </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-6 gap-4">
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredCakes.length) % featuredCakes.length)}
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary-light transition-colors"
                    title="Anterior"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>

                  <div className="flex gap-2">
                    {featuredCakes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-3 rounded-full transition-all ${
                          i === currentSlide ? 'bg-primary w-8' : 'bg-outline-variant w-3 hover:bg-outline'
                        }`}
                        title={`Ir para bolo ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredCakes.length)}
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary-light transition-colors"
                    title="Próximo"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <ProductDetailsModal
          open={Boolean(selectedCake)}
          item={selectedCake}
          title={selectedCake?.name}
          image={selectedCake?.image}
          description={selectedCake?.description}
          details={selectedCake ? [
            { label: 'Peso padrão', value: selectedCake.defaultWeight || 'Não informado' },
            { label: 'Configuração', value: selectedCake.defaultConfig || 'Não informada' },
            { label: 'Preço', value: formatPrice(selectedCake.basePrice) },
            ...(selectedCake.tag ? [{ label: 'Destaque', value: selectedCake.tag }] : [])
          ] : []}
          actions={selectedCake ? [
            {
              label: 'Quero esse! ✓',
              onClick: () => {
                handleAddCake(selectedCake)
                closeCakeDetails()
              }
            }
          ] : []}
          onClose={closeCakeDetails}
        />
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-lowest to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center px-2 sm:px-0">
          <span className="material-symbols-outlined text-[48px] mb-4 opacity-90">celebration</span>
          <h2 className="font-headline-lg md:font-display-lg text-headline-lg md:text-display-lg mb-6 leading-tight">
            Vai fazer uma festa?
          </h2>
          <p className="font-body-lg text-body-lg mb-10 text-primary-fixed max-w-2xl">
            Monte o bolo dos seus sonhos no nosso Cake Builder ou fale com a nossa equipe para criar algo totalmente personalizado para o seu evento.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage('order-builder')}
              className="px-8 py-4 bg-white text-primary font-label-md text-label-md font-bold rounded-lg shadow-lg hover:shadow-2xl hover:bg-yellow-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full sm:w-auto"
            >
              🎂 Acessar Cake Builder
            </button>
            <a
              href={`${contacts.whatsapp.link}?text=${encodeURIComponent(contacts.whatsapp.message.custom)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-primary-fixed text-surface-container-lowest font-label-md text-label-md rounded-lg hover:bg-primary-fixed/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">photo_camera</span>
              <span className="font-label-md text-label-md text-primary tracking-widest uppercase">{contacts.instagram.handle}</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">
              Acompanhe nosso dia a dia
            </h2>
          </div>

          {/* Instagram Embed */}
          <div className="flex justify-center mb-12 overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(62,31,13,0.1)]">
            <iframe
              src={contacts.instagram.embedUrl}
              width="100%"
              height="520"
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              style={{ maxWidth: '540px', minWidth: '100%', width: '100%' }}
            ></iframe>
          </div>

          <div className="text-center">
            <a
              href={contacts.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors cursor-pointer inline-block"
            >
              Ver mais no Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
