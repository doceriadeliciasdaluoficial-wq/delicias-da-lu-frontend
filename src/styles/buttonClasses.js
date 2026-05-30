/**
 * Classes Tailwind centralizadas para botões
 * Reduz repetição de código e facilita manutenção
 */

export const buttonBase = 'py-3 rounded-lg font-label-md text-label-md transition-colors'

export const buttonVariants = {
  primary: `${buttonBase} bg-primary text-white hover:bg-primary-light`,
  primaryDisabled: `${buttonBase} bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed`,
  secondary: `${buttonBase} bg-surface-container text-on-surface hover:bg-surface-container-highest`,
  secondaryDisabled: `${buttonBase} bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed`,
  tertiary: `${buttonBase} bg-surface-container border-2 border-outline-variant text-on-surface hover:bg-surface-container-highest`,
}

export const navigationButtonContainer = 'flex gap-4'

export const actionButtonContainer = 'flex gap-3 mt-6 pt-6 border-t border-tertiary'

export const iconButtonBase = 'flex items-center justify-center gap-2'
