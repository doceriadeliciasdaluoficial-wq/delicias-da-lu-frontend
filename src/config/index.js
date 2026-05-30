// Arquivo central de configurações
// Importar aqui um único arquivo para centralizar todas as configs

export { default as CONTACTS } from './contacts'
export { default as MENU_ITEMS } from './menu'
export { default as CAKE_BUILDER } from './cakeBuilder'

import CONTACTS from './contacts'
import MENU_ITEMS from './menu'
import CAKE_BUILDER from './cakeBuilder'

export const CONFIG = {
  CONTACTS,
  MENU_ITEMS,
  CAKE_BUILDER
}

export default CONFIG
