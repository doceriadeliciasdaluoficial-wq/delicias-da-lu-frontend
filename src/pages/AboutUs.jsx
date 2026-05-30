import React from 'react'

export default function AboutUs({ setCurrentPage }) {
  return (
    <main className="overflow-x-hidden pt-20 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-14 md:py-16 px-4 sm:px-6 md:px-20 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-5xl sm:text-6xl text-primary mb-4 block">auto_awesome</span>
          <h1 className="font-display-lg text-[2.25rem] sm:text-display-lg text-on-background mb-6">
            Sobre Delícias da Lú
          </h1>
          <p className="font-body-lg text-[1rem] sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto px-2 sm:px-0">
            Cada bolo é uma obra de arte feita com ingredientes selecionados, técnica apurada e muito carinho pela sua festa.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-20 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="aspect-square bg-cream rounded-xl flex items-center justify-center text-5xl sm:text-6xl">
              🎂
            </div>
            <div>
              <h2 className="font-headline-lg text-[1.8rem] sm:text-headline-lg text-on-background mb-6">
                Nossa História
              </h2>
              <p className="font-body-lg text-[1rem] sm:text-body-lg text-on-surface-variant mb-4">
                Nascemos da paixão por criar momentos doces e memoráveis. Cada receita é resultado de dedicação, pesquisa e muito amor ao ofício.
              </p>
              <p className="font-body-lg text-[1rem] sm:text-body-lg text-on-surface-variant">
                Acreditamos que um bolo bem feito é capaz de transformar uma celebração em algo verdadeiramente especial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline-lg text-[1.8rem] sm:text-headline-lg text-on-background text-center mb-12 md:mb-16">
            Por que nos escolher
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: '🍫',
                title: 'Ingredientes Premium',
                description: 'Utilizamos apenas ingredientes de qualidade superior para garantir o melhor sabor.'
              },
              {
                icon: '👨‍🍳',
                title: 'Técnica Apurada',
                description: 'Cada detalhe é cuidadosamente executado por profissionais com experiência.'
              },
              {
                icon: '💝',
                title: 'Muito Carinho',
                description: 'Fazemos tudo com dedicação, como se fosse para nossa família.'
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl sm:text-5xl mb-4">{item.icon}</div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-4">
                  {item.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 md:py-16 px-4 sm:px-6 md:px-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline-lg text-[1.8rem] sm:text-headline-lg mb-6">
            Pronto para adoçar seu evento?
          </h2>
          <button className="px-8 py-4 bg-surface-container-lowest text-primary font-label-md text-label-md rounded-lg shadow-lg hover:bg-surface transition-colors w-full sm:w-auto">
            Fazer Pedido Agora
          </button>
        </div>
      </section>
    </main>
  )
}
