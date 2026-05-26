import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const Design = () => (
  <section id="design" className="py-24 bg-[#1A1714] overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Images grid */}
        <div className="relative grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80" alt="design1" className="w-full h-56 object-cover" />
            <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80" alt="design2" className="w-full h-40 object-cover" />
          </div>
          <div className="space-y-4 mt-10">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80" alt="design3" className="w-full h-40 object-cover" />
            <img src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=400&q=80" alt="design4" className="w-full h-56 object-cover" />
          </div>
          {/* Gold accent box */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[#C9A96E]/30" />
        </div>

        {/* Content */}
        <div>
          <p className="text-[#C9A96E] text-xs font-medium tracking-[0.25em] uppercase mb-4">Interior Design</p>
          <div className="w-12 h-px bg-[#C9A96E] mb-6" />
          <h2 className="font-display text-5xl font-light text-white leading-tight">
            Design That<br />
            <em className="italic text-[#C9A96E]">Speaks</em> to You
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mt-6">
            Our design philosophy centres on the belief that your home should be a reflection of your story. Each piece we offer is thoughtfully crafted — balancing aesthetics with function, warmth with elegance.
          </p>
          <p className="text-white/50 text-sm leading-relaxed mt-4">
            From a single accent chair to a complete interior transformation, our in-house design consultants guide you every step of the way.
          </p>

          {/* USPs */}
          <div className="grid grid-cols-2 gap-6 mt-10">
            {[
              ['Solid Wood Crafted', 'Ethically sourced, built to last generations.'],
              ['Free Design Consult', '30-min session with our interior experts.'],
              ['5-Year Warranty',    'Full coverage on all structural elements.'],
              ['White Glove Delivery', 'Installation and placement included.'],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="w-8 h-px bg-[#C9A96E] mb-3" />
                <p className="text-white text-sm font-medium">{t}</p>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button variant="primary">
              Book a Design Session <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Design;