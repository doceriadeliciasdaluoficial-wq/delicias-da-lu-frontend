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
        
        console.log('Starting data load from backend...')
        
        const [menuData, cakeBuilderData, contactsData, homeData] = await Promise.all([
          menuService.getAll()
            .catch((err) => {
              console.error('Menu fetch failed:', err?.response?.status, err?.message)
              return null
            }),
          cakeBuilderService.getAll()
            .catch((err) => {
              console.error('CakeBuilder fetch failed:', err?.response?.status, err?.message)
              return null
            }),
          contactService.getContacts()
            .catch((err) => {
              console.error('Contacts fetch failed:', err?.response?.status, err?.message)
              return null
            }),
          homeService.getHome()
            .catch((err) => {
              console.error('Home fetch failed:', err?.response?.status, err?.message)
              return null
            })
        ])

        console.log('Data loaded:', {
          menu: menuData ? `${menuData.length} items` : 'null',
          cakeBuilder: cakeBuilderData ? 'object' : 'null',
          contacts: contactsData ? 'object' : 'null',
          home: homeData ? 'object' : 'null'
        })

        setSiteConfig(prev => {
          const newConfig = { ...prev }
          
          if (homeData && homeData.featuredCakes) {
            newConfig.home = { featuredCakes: homeData.featuredCakes }
          }
          
          // Menu items come from backend as an array
          // Need to organize them by category ID
          if (Array.isArray(menuData) && menuData.length > 0) {
            console.log('Backend menu data received:', menuData.length, 'items')
            const bolos = menuData.filter(item => item.category === 'bolos' || item.category === 'Bolos')
            const docesSimples = menuData.filter(item => item.category === 'docesSimples' || item.category === 'Doces Simples')
            const docesFinos = menuData.filter(item => item.category === 'docesFinos' || item.category === 'Doces Finos')
            const decoracoes = menuData.filter(item => item.category === 'decoracoes' || item.category === 'Decorações')
            
            console.log('Filtered menu items - bolos:', bolos.length, 'docesSimples:', docesSimples.length, 'docesFinos:', docesFinos.length, 'decoracoes:', decoracoes.length)
            
            newConfig.menu = { 
              bolos,
              docesSimples,
              docesFinos,
              decoracoes,
              sectionLabels: prev.menu?.sectionLabels || {
                bolos: '🍰 Bolos',
                docesSimples: '🍫 Doces Simples',
                docesFinos: '✨ Doces Finos',
                decoracoes: '🎀 Decorações'
              },
              customSections: prev.menu?.customSections || []
            }
          }
          
          if (cakeBuilderData && typeof cakeBuilderData === 'object') {
            console.log('CakeBuilder data received:', Object.keys(cakeBuilderData))
            newConfig.cakeBuilder = cakeBuilderData
          }
          
          if (contactsData && typeof contactsData === 'object') {
            console.log('Contacts data received')
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
      // Update menu items by category
      if (next.menu) {
        const categories = ['bolos', 'docesSimples', 'docesFinos', 'decoracoes']
        for (const category of categories) {
          const items = next.menu[category] || []
          for (const item of items) {
            try {
              // Try to update first, if it fails, try to create
              await menuService.update(category, item.id, item)
            } catch (err) {
              // Log full error details
              const errorMsg = err?.response?.data?.message || err?.message || 'Unknown error'
              console.warn(`Menu update failed for ${item.id} (${category}):`, errorMsg, err)
              
              if (err.response?.status === 404) {
                // Item doesn't exist, create it
                try {
                  console.log(`Creating new menu item: ${item.id} in ${category}`)
                  await menuService.create(category, item)
                  console.log(`Successfully created menu item ${item.id}`)
                } catch (createErr) {
                  const createErrorMsg = createErr?.response?.data?.message || createErr?.message || 'Unknown error'
                  console.error(`Failed to create menu item ${item.id}:`, createErrorMsg, createErr)
                }
              }
            }
          }
        }
      }

      // Update cake builder components by type
      if (next.cakeBuilder) {
        const types = ['massas', 'recheios', 'coberturas', 'decoracoes']
        for (const type of types) {
          const items = next.cakeBuilder[type] || []
          for (const item of items) {
            try {
              // Try to update first, if it fails, try to create
              await cakeBuilderService.update(type, item.id, item)
            } catch (err) {
              // Log full error details
              const errorMsg = err?.response?.data?.message || err?.message || 'Unknown error'
              console.warn(`CakeBuilder update failed for ${item.id} (${type}):`, errorMsg, err)
              
              if (err.response?.status === 404) {
                // Item doesn't exist, create it
                try {
                  console.log(`Creating new cake builder component: ${item.id} (${type})`)
                  await cakeBuilderService.create(type, item)
                  console.log(`Successfully created cake builder component ${item.id}`)
                } catch (createErr) {
                  const createErrorMsg = createErr?.response?.data?.message || createErr?.message || 'Unknown error'
                  console.error(`Failed to create cake builder component ${item.id}:`, createErrorMsg, createErr)
                }
              }
            }
          }
        }
      }

      // Update contacts
      if (next.contacts) {
        try {
          await contactService.updateContacts(next.contacts)
        } catch (err) {
          console.error('Failed to update contacts:', err)
        }
      }

      // Update featured cakes
      if (next.home?.featuredCakes && Array.isArray(next.home.featuredCakes)) {
        for (const cake of next.home.featuredCakes) {
          if (cake.id) {
            try {
              // Try to update first, if it fails, try to create
              await homeService.updateFeaturedCake(cake.id, cake)
            } catch (err) {
              if (err.response?.status === 404) {
                // Cake doesn't exist, create it
                try {
                  await homeService.createFeaturedCake(cake)
                } catch (createErr) {
                  console.error(`Failed to create featured cake ${cake.id}:`, createErr)
                }
              } else {
                console.error(`Failed to update featured cake ${cake.id}:`, err)
              }
            }
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
