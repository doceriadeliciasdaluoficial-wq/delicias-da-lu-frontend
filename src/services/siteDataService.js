import menuService from './menuService'
import cakeBuilderService from './cakeBuilderService'
import contactService from './contactService'

export const siteDataService = {
  async loadConfig() {
    try {
      const [menuData, cakeBuilderData, contactsData] = await Promise.all([
        menuService.getAll(),
        cakeBuilderService.getAll(),
        contactService.getContacts()
      ])

      return {
        menu: Array.isArray(menuData) ? { 
          bolos: menuData.filter(item => item.category === 'Bolos'),
          docesSimples: menuData.filter(item => item.category === 'Doces Simples'),
          docesFinos: menuData.filter(item => item.category === 'Doces Finos'),
          decoracoes: menuData.filter(item => item.category === 'Decorações'),
          sectionLabels: {
            bolos: '🍰 Bolos',
            docesSimples: '🍫 Doces Simples',
            docesFinos: '✨ Doces Finos',
            decoracoes: '🎀 Decorações'
          },
          customSections: []
        } : { bolos: [], docesSimples: [], docesFinos: [], decoracoes: [] },
        cakeBuilder: cakeBuilderData || { massas: [], recheios: [], coberturas: [], decoracoes: [] },
        contacts: contactsData || { whatsapp: { number: '', link: '' }, email: '', instagram: '' }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do servidor:', error)
      throw error
    }
  }
}

export default siteDataService
