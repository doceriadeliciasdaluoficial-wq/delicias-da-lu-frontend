import React from 'react'

export default function Footer() {
  const whatsappLink = 'https://wa.me/5511945754150?text=Oi Lú! Vim pelo site e gostaria de fazer um pedido!'
  const email = 'gab.ponsoni@gmail.com'

  return (
    <footer className="bg-surface border-t border-outline-variant mt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-headline-md text-headline-md text-on-background mb-4">
              Delícias da Lú
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Bolos artesanais feitos com amor, combinando ingredientes premium e design impecável.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-label-md text-label-md text-on-background font-bold mb-4 uppercase">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                  Cardápio
                </a>
              </li>
              <li>
                <a href="#builder" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                  Cake Builder
                </a>
              </li>
              <li>
                <a href="#about" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-label-md text-label-md text-on-background font-bold mb-4 uppercase">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">mail</span>
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/deliciasda.lu.oficial/?hl=pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-label-md text-label-md text-on-background font-bold mb-4 uppercase">
              Newsletter
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Receba notícias e promoções exclusivas
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-3 py-2 border border-outline-variant rounded-lg bg-background font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-primary-light transition-colors">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-outline-variant my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
            © 2024 Delícias da Lú. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/deliciasda.lu.oficial/?hl=pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-full text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-full text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="material-symbols-outlined">chat</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-full text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
