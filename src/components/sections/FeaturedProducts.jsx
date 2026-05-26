import { useState } from 'react';
import { featured } from '../../data/products';
import SectionTitle from '../ui/SectionTitle';
import ProductCard from '../ui/ProductCard';

const tabs = ['All', 'Living Room', 'Bedroom', 'Dining', 'Outdoor'];

const FeaturedProducts = () => {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? featured : featured.filter(p => p.category === active);

  return (
    <section id="featured" className="py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          eyebrow="Handpicked for You"
          title="Featured Products"
          subtitle="Each piece is selected for its craftsmanship, materials, and timeless design."
        />

        {/* Tab Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`text-xs font-medium tracking-widest uppercase px-6 py-2.5 border transition-all duration-300 ${
                active === t
                  ? 'bg-[#1A1714] text-white border-[#1A1714]'
                  : 'border-[#E8D5B0] text-[#8A8278] hover:border-[#C9A96E] hover:text-[#C9A96E]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="border border-[#C9A96E] text-[#C9A96E] text-xs font-medium tracking-widest uppercase px-10 py-4 hover:bg-[#C9A96E] hover:text-white transition-all duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;