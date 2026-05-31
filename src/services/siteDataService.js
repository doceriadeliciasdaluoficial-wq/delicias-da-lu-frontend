import defaultSiteConfig, { cloneSiteConfig } from '../data/defaultSiteConfig'

const LOCAL_STORAGE_KEY = 'delicias.site.config.v1'

export const siteDataService = {
  getDefaultConfig() {
    return cloneSiteConfig(defaultSiteConfig)
  },

  loadConfig() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!raw) return this.getDefaultConfig()

      const parsed = JSON.parse(raw)
      return {
        ...this.getDefaultConfig(),
        ...parsed,
        cakeBuilder: {
          ...this.getDefaultConfig().cakeBuilder,
          ...(parsed.cakeBuilder || {})
        },
        menu: {
          ...this.getDefaultConfig().menu,
          ...(parsed.menu || {}),
          customSections: parsed?.menu?.customSections || []
        },
        contacts: {
          ...this.getDefaultConfig().contacts,
          ...(parsed.contacts || {})
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar configurações locais. Restaurando padrão.', error)
      return this.getDefaultConfig()
    }
  },

  saveConfig(config) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
  },

  resetConfig() {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return this.getDefaultConfig()
  }
}

export default siteDataService
