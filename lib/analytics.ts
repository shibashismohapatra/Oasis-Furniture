export type AnalyticsEvent = 
  | 'cta_directions_click'
  | 'cta_whatsapp_click'
  | 'cta_call_click'
  | 'monthly_offer_click'
  | 'collection_card_click'
  | 'product_card_click'
  | 'contact_page_action'
  | 'project_inquiry'
  | 'cta_section_click'
  | 'product_category_click'
  | 'offer_popup_close'
  | 'offer_popup_claim'
  | 'social_bar_click'
  | 'hotspot_click'

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties)
  }
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties)
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
