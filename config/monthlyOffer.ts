export interface MonthlyOffer {
  title: string
  description: string
  discount: string
  validUntil: string
  terms: string[]
  isActive: boolean
}

export const monthlyOffer: MonthlyOffer = {
  title: 'February Showroom Special',
  description: 'Exclusive discounts on premium sofa sets',
  discount: 'Up to 25% off',
  validUntil: 'February 28, 2026',
  terms: [
    'Valid only at Bhubaneswar showroom',
    'Cannot be combined with other offers',
    'Visit showroom for complete details',
  ],
  isActive: true,
}
