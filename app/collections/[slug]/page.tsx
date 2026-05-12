import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollectionBySlug, collections } from '@/config/collections'
import { products } from '@/config/products'
import CategoryListing from '@/components/CategoryListing'

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug)
  
  if (!collection) {
    return {
      title: 'Collection Not Found',
    }
  }

  return {
    title: `${collection.name} - Oasis Furniture`,
    description: collection.description,
  }
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getCollectionBySlug(params.slug)

  if (!collection) {
    notFound()
  }

  return (
    <CategoryListing 
      collection={collection}
      allCollections={collections}
      allProducts={products}
      currentSlug={params.slug}
    />
  )
}
