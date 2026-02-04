import Image from 'next/image'
import Link from 'next/link'

const features = [
  {
    title: 'Quality',
    desc: 'Each product crafted to perfection, meeting the highest standards of excellence in every element.',
    icon: '🏆',
  },
  {
    title: 'Innovation',
    desc: '"Always Ahead" isn\'t just our slogan — it\'s our way of life. We constantly innovate and improve.',
    icon: '💡',
  },
  {
    title: 'Trust',
    desc: 'We treat customers and suppliers as partners in progress, with honesty and transparency at the core.',
    icon: '🤝',
  },
]

const productPreview = [
  { name: 'MS Angle Bar', range: '20mm – 110mm', color: 'bg-orange-50 border-orange-200' },
  { name: 'MS Flat Bar', range: '20×5 – 100×50mm', color: 'bg-amber-50 border-amber-200' },
  { name: 'MS Round Bar', range: '8mm – 100mm', color: 'bg-yellow-50 border-yellow-200' },
  { name: 'Bright Flat Bar', range: '16×5 – 100×50mm', color: 'bg-orange-50 border-orange-200' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[520px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/hot-steel-sparks.jpg"
          alt="Steel manufacturing"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col justify-end h-full pb-16 md:pb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Pioneering Excellence<br />
            <span className="text-orange-400">in Every Element</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl">
            Crafted with Care, Delivered with Pride. A trusted name in the metals industry.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <Link
              href="/products"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Products
            </Link>
            <Link
              href="/contact-us"
              className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Customized Solutions for Every Industry</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Our extensive range of metal products is engineered to meet diverse industrial needs, with flexibility to adjust specifications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {productPreview.map((p) => (
              <div key={p.name} className={`border ${p.color} rounded-xl p-5 text-center`}>
                <h4 className="font-bold text-gray-800">{p.name}</h4>
                <p className="text-sm text-gray-500 mt-1">Size Range: {p.range}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products" className="text-orange-600 hover:text-orange-700 font-semibold underline">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-orange-600">Aadinath Industries</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A cornerstone in the re-rolling mills sector and a trusted trading partner in the metals industry. Rooted in a foundation of quality, innovation, and integrity, we have established ourselves as a beacon of reliability and trust.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              With a commitment that extends beyond manufacturing to include global trading, we stand as a testament to the enduring value of excellence in both production and commerce.
            </p>
            <Link href="/about-us" className="mt-6 inline-block text-orange-600 hover:text-orange-700 font-semibold underline">
              Learn More →
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image src="/images/worker-rolls.jpg" alt="Worker at rolling mill" width={560} height={420} className="object-cover w-full" />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-orange-50 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl text-orange-300 mb-4">"</div>
          <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed">
            Always Ahead isn't just our slogan; it's our way of life. We constantly strive to innovate and improve, ensuring we offer the best solutions to our clients.
          </p>
          <div className="mt-6 text-orange-600 font-semibold">— Aadinath Industries</div>
        </div>
      </section>
    </>
  )
}
