import Image from 'next/image'
import Link from 'next/link'

const sizes = [
  { size: '20 × 2.5 mm' },
  { size: '24 × 2.0 mm' },
  { size: '25 × 2.5 mm' },
  { size: '25 × 3.0 mm' },
  { size: '25 × 4.0 mm' },
  { size: '25 × 5.0 mm' },
  { size: '30 × 2.5 mm' },
  { size: '30 × 3.0 mm' },
  { size: '34 × 4.0 mm' },
  { size: '37 × 2.5 mm' },
  { size: '37 × 3.0 mm' },
]

export default function Products() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our Products</h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            Precision-rolled mild steel angles engineered for structural excellence. Built for durability, delivered with pride.
          </p>
        </div>
      </section>

      {/* Product Detail */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/ms-angles.png"
              alt="MS Angle Bars"
              width={600}
              height={500}
              className="object-cover w-full"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-600" />
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Mild Steel</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">MS Angle Bar</h2>
            <p className="text-gray-600 leading-relaxed">
              Robust, precision-rolled mild steel angles — available in both light and standard variants. The backbone of structural construction, engineered and rolled to exact specifications at our state-of-the-art Bhavnagar facility.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              Each piece undergoes controlled rolling to ensure consistent dimensions, weight tolerance, and straightness across the entire length.
            </p>

            {/* Size Range */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Sizes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sizes.map((s) => (
                  <div key={s.size} className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-center">
                    <span className="text-sm font-medium text-gray-700">{s.size}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Custom lengths available on request</p>
            </div>

            {/* Applications */}
            <div className="mt-6 bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Applications</h3>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Structural framing & support beams',
                  'Construction scaffolding',
                  'Fabrication & manufacturing',
                  'General industrial use',
                ].map((app) => (
                  <li key={app} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-orange-500">▸</span> {app}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-50 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Ready to order?</h2>
          <p className="text-gray-500 mt-2">Get in touch for bulk pricing, custom lengths, or a product sample.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="tel:+919825207616" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              📞 +91 9825207616
            </a>
            <a href="https://wa.me/919825207616" target="_blank" rel="noopener noreferrer" className="border border-green-500 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
