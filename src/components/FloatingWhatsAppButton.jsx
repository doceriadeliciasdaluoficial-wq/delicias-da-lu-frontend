import React from 'react'
import { useSiteData } from '../context/SiteDataContext'

export default function FloatingWhatsAppButton() {
  const { contacts } = useSiteData()
  const whatsappLink = `${contacts.whatsapp.link}?text=${encodeURIComponent(contacts.whatsapp.message.default)}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#1FB55C] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Enviar mensagem pelo WhatsApp"
    >
      <span className="material-symbols-outlined text-2xl">chat</span>
    </a>
  )
}
