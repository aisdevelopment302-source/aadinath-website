import Image from 'next/image'
import Link from 'next/link'
import { CheckCircleIcon, SparklesIcon, HandThumbUpIcon, StarIcon } from '@heroicons/react/24/solid'

const features = [
  {
    title: 'Quality',
    desc: 'Each angle bar is rolled to perfection, meeting the highest standards of dimensional accuracy and consistency.',
    icon: 'quality',
  },
  {
    title: 'Innovation',
    desc: '"Always Ahead" isn\'t just our slogan — it\'s our way of life. We constantly innovate and improve our processes.',
    icon: 'innovation',
  },
  {
    title: 'Trust',
    desc: 'We treat customers and suppliers as partners in progress, with honesty and transparency at the core.',
    icon: 'trust',
  },
]

const IconComponent = ({ icon }: { icon: string }) => {
  const iconClasses = "w-12 h-12 text-orange-600"
  
  switch (icon) {
    case 'quality':
      return <CheckCircleIcon className={iconClasses} />
    case 'innovation':
      return <SparklesIcon className={iconClasses} />
    case 'trust':
      return <HandThumbUpIcon className={iconClasses} />
    default:
      return <CheckCircleIcon className={iconClasses} />
  }
}

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
            Crafted with Care, Delivered with Pride. Precision MS Angle Bars from Bhavnagar, Gujarat.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              href="/products"
              className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Our Product
            </Link>
            <Link
              href="/contact-us"
              className="border-2 border-white text-white hover:bg-white/20 px-8 py-3 rounded-lg font-bold transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                  <IconComponent icon={f.icon} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Spotlight */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-600" />
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Our Product</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">MS Angle Bar</h2>
              <p className="text-gray-600 leading-relaxed">
                Precision-rolled mild steel angles — available in both light and standard variants from 20mm to 37mm. The structural backbone for construction, fabrication, and industrial applications. Engineered with precision at our state-of-the-art Sihor facility.
              </p>
              <div className="mt-7">
                <p className="text-sm text-gray-700 font-bold mb-4 uppercase tracking-wider">Standard Sizes:</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['20×2.5', '24×2', '25×2.5', '25×3', '25×4', '25×5', '30×2.5', '30×3', '34×4', '37×2.5', '37×3'].map((s) => (
                    <span key={s} className="text-xs bg-orange-100 text-orange-700 px-3 py-2 rounded-lg font-bold border border-orange-200 hover:bg-orange-200 transition-colors">{s} mm</span>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-orange-600 p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-800"><span className="font-bold text-orange-600">✓ Customizable</span> — We welcome custom specifications for dimensions, weight, and length tailored to your exact requirements.</p>
                </div>
              </div>
              <Link href="/products" className="mt-6 inline-block text-orange-600 hover:text-orange-700 font-semibold underline">
                View Details →
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <Image src="/images/ms-angles.png" alt="MS Angle Bars" width={560} height={460} className="object-cover w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <Image src="/images/worker-rolls.jpg" alt="Worker at rolling mill" width={560} height={420} className="object-cover w-full" />
          </div>
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
        </div>
      </section>

      {/* Quote */}
      <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-20 border-t border-orange-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <StarIcon className="w-12 h-12 text-orange-400" />
          </div>
          <p className="text-xl md:text-2xl text-gray-800 italic leading-relaxed font-medium">
            Always Ahead isn't just our slogan; it's our way of life. We constantly strive to innovate and improve, ensuring we offer the best solutions to our clients.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-orange-400"></div>
            <span className="text-orange-600 font-bold">Aadinath Industries</span>
            <div className="h-px w-8 bg-orange-400"></div>
          </div>
        </div>
      </section>
    </>
  )
}
