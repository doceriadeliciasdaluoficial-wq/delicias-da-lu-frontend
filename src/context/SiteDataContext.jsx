import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import defaultSiteConfig from '../data/defaultSiteConfig'
import menuService from '../services/menuService'
import cakeBuilderService from '../services/cakeBuilderService'
import contactService from '../services/contactService'
import homeService from '../services/homeService'

const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [menuData, cakeBuilderData, contactsData, homeData] = await Promise.all([
          menuService.getAll().catch(() => null),
          cakeBuilderService.getAll().catch(() => null),
          contactService.getContacts().catch(() => null),
          homeService.getHome().catch(() => null)
        ])

        setSiteConfig(prev => {
          const newConfig = { ...prev }
          
          if (homeData && homeData.featuredCakes) {
            newConfig.home = { featuredCakes: homeData.featuredCakes }
          }
          
          if (Array.isArray(menuData) && menuData.length > 0) {
            newConfig.menu = { 
              bolos: menuData.filter(item => item.category === 'Bolos'),
              docesSimples: menuData.filter(item => item.category === 'Doces Simples'),
              docesFinos: menuData.filter(item => item.category === 'Doces Finos'),
              decoracoes: menuData.filter(item => item.category === 'Decorações'),
              sectionLabels: prev.menu.sectionLabels,
              customSections: []
            }
          }
          
          if (cakeBuilderData && typeof cakeBuilderData === 'object') {
            newConfig.cakeBuilder = cakeBuilderData
          }
          
          if (contactsData && typeof contactsData === 'object') {
            newConfig.contacts = contactsData
          }
          
          return newConfig
        })
      } catch (err) {
        setError(err)
        console.error('Erro ao carregar dados do servidor:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const updateSiteConfig = async (updater) => {
    const next = typeof updater === 'function' ? updater(siteConfig) : updater
    setSiteConfig(next)

    try {
      if (next.menu) {
        const categories = ['bolos', 'docesSimples', 'docesFinos', 'decoracoes']
        for (const category of categories) {
          const items = next.menu[category] || []
          for (const item of items) {
            await menuService.update(category, item.id, item)
          }
        }
      }

      if (next.cakeBuilder) {
        const types = ['massas', 'recheios', 'coberturas', 'decoracoes']
        for (const type of types) {
          const items = next.cakeBuilder[type] || []
          for (const item of items) {
            await cakeBuilderService.update(type, item.id, item)
          }
        }
      }

      if (next.contacts) {
        await contactService.updateContacts(next.contacts)
      }

      if (next.home?.featuredCakes && Array.isArray(next.home.featuredCakes)) {
        for (const cake of next.home.featuredCakes) {
          if (cake.id) {
            await homeService.updateFeaturedCake(cake.id, cake)
          }
        }
      }
    } catch (err) {
      console.error('Erro ao salvar configurações no servidor:', err)
    }
  }

  const persistConfig = (nextConfig) => {
    setSiteConfig(nextConfig)
    updateSiteConfig(nextConfig)
  }

  const resetSiteConfig = () => {
    setSiteConfig(defaultSiteConfig)
  }

  const contacts = useMemo(() => {
    const number = siteConfig?.contacts?.whatsapp?.number || ''
    const sanitized = String(number).replace(/\D/g, '')
    const emailAddress = siteConfig?.contacts?.email?.address || siteConfig?.contacts?.email || ''
    const instagramHandle = siteConfig?.contacts?.instagram?.handle || siteConfig?.contacts?.instagram || ''

    return {
      ...siteConfig.contacts,
      whatsapp: {
        ...siteConfig.contacts.whatsapp,
        number: sanitized,
        link: `https://wa.me/${sanitized}`
      },
      email: typeof siteConfig.contacts.email === 'string' ? 
        { address: siteConfig.contacts.email } : 
        (siteConfig.contacts.email || {}),
      instagram: typeof siteConfig.contacts.instagram === 'string' ?
        { handle: siteConfig.contacts.instagram } :
        (siteConfig.contacts.instagram || {})
    }
  }, [siteConfig.contacts])

  const value = useMemo(
    () => ({
      siteConfig,
      cakeBuilder: siteConfig.cakeBuilder,
      menuData: siteConfig.menu,
      contacts,
      updateSiteConfig,
      persistConfig,
      resetSiteConfig,
      loading,
      error
    }),
    [siteConfig, contacts, loading, error]
  )

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export const useSiteData = () => {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData deve ser usado dentro de SiteDataProvider')
  }
  return context
}

export default SiteDataContext
