import Link from 'next/link'

const products = [
  { name: 'MS Angle Bar', range: '20mm – 110mm', desc: 'Robust angles perfect for a variety of structural needs in construction and industrial applications.', category: 'MS' },
  { name: 'MS Flat Bar', range: '20×5mm – 100×50mm, 125×6mm – 150×25mm', desc: 'Versatile flat bars for applications demanding flat surfaces with high strength and durability.', category: 'MS' },
  { name: 'MS Round Bar', range: '8mm – 100mm', desc: 'Durable round bars ideal for construction, manufacturing, and engineering applications.', category: 'MS' },
  { name: 'MS Square Bar', range: '8mm – 75mm', desc: 'Sturdy square bars offering reliability for general fabrication and repairs across industries.', category: 'MS' },
  { name: 'Bright Flat Bar', range: '16×5mm – 100×50mm, 125×10mm – 150×25mm', desc: 'Premium flat bars providing a clean finish for detailed work and precision applications.', category: 'Bright' },
  { name: 'Bright Round Bar', range: '8mm – 100mm', desc: 'High-quality round bars offering a combination of toughness and superior finish.', category: 'Bright' },
  { name: 'Bright Square Bar', range: '8mm – 75mm', desc: 'Precision-engineered square bars known for their excellent finish and reliable strength.', category: 'Bright' },
]

export default function Products() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our Products</h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            From robust angle bars to precision-engineered bright bars, discover our diverse selection of metal products tailored to meet your specific industrial needs.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* MS Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-600" />
            Mild Steel (MS) Products
          </h2>
          <p className="text-gray-500 mb-6">Our core manufacturing range</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.category === 'MS').map((p) => (
              <div key={p.name} className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition-all bg-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">MS</span>
                </div>
                <p className="text-sm text-orange-600 font-medium mb-2">Size Range: {p.range}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bright Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
            Bright Finish Products
          </h2>
          <p className="text-gray-500 mb-6">Premium finish range for precision applications</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.category === 'Bright').map((p) => (
              <div key={p.name} className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-amber-300 transition-all bg-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Bright</span>
                </div>
                <p className="text-sm text-amber-600 font-medium mb-2">Size Range: {p.range}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-50 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Connect with Aadinath Industries</h2>
          <p className="text-gray-500 mt-2">Experience the strength and precision of our metal products firsthand. Your projects deserve the best.</p>
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
