import React, { createContext, useContext, useMemo, useState } from 'react'
import siteDataService from '../services/siteDataService'

const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(() => siteDataService.loadConfig())

  const persistConfig = (nextConfig) => {
    setSiteConfig(nextConfig)
    siteDataService.saveConfig(nextConfig)
  }

  const updateSiteConfig = (updater) => {
    setSiteConfig((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      siteDataService.saveConfig(next)
      return next
    })
  }

  const resetSiteConfig = () => {
    const reset = siteDataService.resetConfig()
    setSiteConfig(reset)
  }

  const contacts = useMemo(() => {
    const number = siteConfig?.contacts?.whatsapp?.number || ''
    const sanitized = String(number).replace(/\D/g, '')

    return {
      ...siteConfig.contacts,
      whatsapp: {
        ...siteConfig.contacts.whatsapp,
        number: sanitized,
        link: `https://wa.me/${sanitized}`
      }
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
      resetSiteConfig
    }),
    [siteConfig, contacts]
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
