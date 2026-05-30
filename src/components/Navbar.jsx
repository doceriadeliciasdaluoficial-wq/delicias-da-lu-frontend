import React, { useState } from 'react'

export default function Navbar({ setCurrentPage, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { label: 'Home', id: 'home' },
    { label: 'Cardápio', id: 'menu' },
    { label: 'Monte seu Pedido', id: 'order-builder' },
    { label: 'Sobre Nós', id: 'about' },
    { label: 'Contato', id: 'contact' },
  ]

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId)
    setIsMenuOpen(false)
    window.scrollTo(0, 0)
  }

  return (
    <>
      {/* Top Navigation (Desktop) */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm transition-transform duration-300 border-b border-outline-variant">
        <div className="flex justify-between items-center h-20 px-20 max-w-7xl mx-auto w-full">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src="/logo.png" alt="Logo Delícias da Lú" className="h-14 w-14" />
            <span className="font-headline-md text-headline-md text-primary hidden sm:inline">Delícias da Lú</span>
          </button>
          <div className="flex gap-6 items-center">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-label-md text-label-md transition-colors duration-300 pb-1 border-b-2 ${
                  currentPage === item.id
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-md flex justify-between items-center h-16 px-4 shadow-sm border-b border-outline-variant">
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="Logo Delícias da Lú" className="h-12 w-12" />
        </button>
        <button
          className="text-on-surface p-2 -mr-2"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-container w-full max-w-sm shadow-xl transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="mobile-menu"
      >
        <div className="p-5 flex justify-between items-center border-b border-outline-variant">
          <div className="flex flex-col gap-2">
            <img src="/logo.png" alt="Logo Delícias da Lú" className="h-14 w-14" />
            <span className="font-body-md text-body-md text-secondary">Padaria Artesanal</span>
          </div>
          <button
            className="text-on-surface p-2 -mr-2"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-4 overflow-y-auto px-2 flex-1 pb-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 font-label-md text-label-md transition-colors duration-200 text-left rounded-lg mx-2 my-1 min-h-12 ${
                currentPage === item.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined">
                {item.id === 'home' && 'home'}
                {item.id === 'menu' && 'restaurant_menu'}
                {item.id === 'order-builder' && 'cake'}
                {item.id === 'about' && 'auto_awesome'}
                {item.id === 'contact' && 'contact_support'}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-outline-variant">
          <button className="w-full py-3 bg-primary text-white font-label-md text-label-md rounded-lg shadow-[0_4px_16px_rgba(214,42,42,0.15)] flex justify-center items-center gap-2 hover:bg-primary-light transition-all duration-200 min-h-12">
            <span className="material-symbols-outlined">chat</span>
            Fazer Pedido
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}
