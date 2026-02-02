export interface ShowroomLocation {
  id: string
  name: string
  address: string
  landmark: string
  phone: string
  whatsapp: string
  email: string
  timings: string
  googleMapsUrl: string
  mapEmbedUrl: string
}

export const showrooms: ShowroomLocation[] = [
  {
    id: 'patia-showroom',
    name: 'Oasis Furniture and Furnishing - Patia',
    address: 'Plot No. 194, Gayatri Vihar, SQUARE, Patia, Bhubaneswar, Odisha 751031',
    landmark: 'Near Patia Square',
    phone: '+91 89176 90567',
    whatsapp: '+918917690567',
    email: 'info@oasisfurniture.in',
    timings: 'Mon-Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM',
    googleMapsUrl: 'https://maps.app.goo.gl/7Y6XTgBhSVuLL6GDA',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.675!2d85.8245!3d20.3502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  },
  {
    id: 'hitech-showroom',
    name: 'Oasis Furniture and Furnishing - Hi-Tech Square',
    address: 'Puri by Pass, Hi-tech Square, Road, Pandra, Bhubaneswar, Odisha 751010',
    landmark: 'Near Hi-tech Square',
    phone: '+91 89176 90567',
    whatsapp: '+918917690567',
    email: 'info@oasisfurniture.in',
    timings: 'Mon-Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM',
    googleMapsUrl: 'https://maps.app.goo.gl/awNvKWbNojo6snbN9',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.675!2d85.8245!3d20.3502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  },
]

export const mainShowroom = showrooms[0]
