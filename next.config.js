/** @type {import('next').NextConfig} */

const imageHosts = [
  'images.unsplash.com',
  'media.designcafe.com',
  'alder.in',
  'i.pinimg.com',
  'm.media-amazon.com',
  'www.livinstyles.com',
  'moonwooden.in',
  'korefurniture.com',
  'static1.squarespace.com',
  'woodentwist.com',
  'ae01.alicdn.com',
  'cdn.shop.luxonation.in',
  'cdn.shop.aarsunwoods.b-cdn.net',
  'cdn.shop.laboro.in',
  'cdn.shop.nilkamalfurniture.com',
  'cdn.shop.vlitefurnitech.com',
  'aarsunwoods.b-cdn.net',
  'luxonation.in',
  'laboro.in',
  'nilkamalfurniture.com',
  'vlitefurnitech.com',
  'www.nilkamalfurniture.com',
  'encrypted-tbn0.gstatic.com',
  'cdn.shopify.com',
  'cdn.shop.luxonation.in',
  'cdn.shop.nilkamalfurniture.com',
  'cdn.shopify.com',
  'www.vlitefurnitech.com',
]

const nextConfig = {
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),

    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig