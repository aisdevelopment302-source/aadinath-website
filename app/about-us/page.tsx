import Image from 'next/image'

export default function AboutUs() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/hot-steel-pour.png" alt="Steel manufacturing" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Mission &amp; Vision</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            At Aadinath Industries, our mission transcends the boundaries of traditional manufacturing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image src="/images/worker-rolls.jpg" alt="Rolling mill worker" width={560} height={420} className="object-cover w-full" />
          </div>
          <div>
            <p className="text-gray-600 leading-relaxed">
              Each product from our extensive range is crafted to perfection. Our range includes MS Angles, Round Bars, Square Bars, Flat Bars, and Bright Bars, all meeting the highest standards of excellence.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We cherish the relationships we build, treating our customers and suppliers as partners in progress, with honesty and transparency at the core of every interaction.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏆', title: 'Quality', desc: 'Uncompromising commitment to the highest standards in every product we manufacture and deliver.' },
              { icon: '💡', title: 'Innovation', desc: 'Constantly pushing boundaries and adopting new technologies to stay ahead in the industry.' },
              { icon: '🤝', title: 'Trust', desc: 'Building lasting relationships through honesty, transparency, and consistent delivery.' },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Vision Detail */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-orange-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-orange-700 mb-4">Customer Satisfaction</h3>
            <p className="text-gray-600 leading-relaxed">
              Our dedication to customer satisfaction is paramount. We understand the critical role our products play in your projects and endeavors. Therefore, we listen, engage, and ensure that each client receives personalized attention and service that goes beyond mere transactions.
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-green-700 mb-4">Community &amp; Sustainability</h3>
            <p className="text-gray-600 leading-relaxed">
              Wherever possible, we strive to engage with our community and contribute positively to societal advancement. We are also attentive to our environmental responsibilities, continually seeking methods to reduce our carbon footprint and promote sustainable practices in our operations.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
