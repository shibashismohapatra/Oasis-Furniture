export const WHATSAPP_NUMBER = '+918917690567'
export const PHONE_NUMBER = '+91 89176 90567'
export const EMAIL = 'info@oasisfurniture.in'

export function getWhatsAppLink(message?: string): string {
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${WHATSAPP_NUMBER}${encodedMessage}`
}

export function getCallLink(): string {
  return `tel:${WHATSAPP_NUMBER}`
}

export function getEmailLink(subject?: string): string {
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${EMAIL}${subjectParam}`
}
