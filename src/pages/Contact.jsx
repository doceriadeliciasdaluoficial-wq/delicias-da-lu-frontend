import React, { useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'

export default function Contact({ setCurrentPage }) {
  const { contacts } = useSiteData()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <main className="overflow-x-hidden pt-20 md:pt-20">
      {/* Header */}
      <section className="py-14 md:py-16 px-4 sm:px-6 md:px-20 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-5xl sm:text-6xl text-primary mb-4 block">contact_support</span>
          <h1 className="font-display-lg text-[2.25rem] sm:text-display-lg text-on-background mb-6">
            Fale com a Gente
          </h1>
          <p className="font-body-lg text-[1rem] sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto px-2 sm:px-0">
            Estamos prontos para tirar dúvidas e criar o bolo perfeito para você.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-14 md:py-16 px-4 sm:px-6 md:px-20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: 'chat',
                title: 'WhatsApp',
                description: 'Envie mensagens e faça seus pedidos',
                action: 'Enviar Mensagem',
                href: `${contacts.whatsapp.link}?text=${encodeURIComponent(contacts.whatsapp.message.default)}`
              },
              {
                icon: 'phone',
                title: 'Telefone',
                description: 'Ligue para falar com a gente',
                action: 'Ligar',
                href: `tel:+${contacts.whatsapp.number}`
              },
              {
                icon: 'mail',
                title: 'Email',
                description: 'Envie um email com sua dúvida',
                action: 'Enviar Email',
                href: `mailto:${contacts.email.address}`
              },
            ].map((contact, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary mb-4 block">
                  {contact.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-background mb-2">
                  {contact.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  {contact.description}
                </p>
                <a href={contact.href} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-surface-tint transition-colors w-full sm:w-auto">
                  {contact.action}
                </a>
              </div>
            ))}
          </div>

          {/* Google Maps */}
          <div className="rounded-xl overflow-hidden shadow-lg mb-12 h-80 sm:h-96">
            <iframe
              src={contacts.location.mapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-14 md:py-16 px-4 sm:px-6 md:px-20 bg-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-lg text-[1.8rem] sm:text-headline-lg text-on-background text-center mb-12">
            Envie uma Mensagem
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2">
                Mensagem
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Digite sua mensagem aqui..."
                rows="5"
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-surface-tint transition-colors shadow-md"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      {/* Social Section */}
      <section className="py-14 md:py-16 px-4 sm:px-6 md:px-20 bg-primary text-white text-center">
        <h2 className="font-headline-lg text-[1.8rem] sm:text-headline-lg mb-8">
          Acompanhe no Instagram
        </h2>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <span className="material-symbols-outlined text-4xl">photo_camera</span>
          <a href={contacts.instagram.url} target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md hover:text-primary-fixed underline">
            {contacts.instagram.handle}
          </a>
        </div>
      </section>
    </main>
  )
}
