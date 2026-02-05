export default function ContactUs() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-300 mt-3">We'd love to hear from you. Reach out for inquiries, orders, or anything else.</p>
        </div>
      </section>

      {/* Contact Details */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>

            <div className="flex flex-col gap-6">
              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📞</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <a href="tel:+919825207616" className="text-orange-600 hover:text-orange-700">+91 9825207616</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✉️</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <a href="mailto:info@aadinathindustries.in" className="text-orange-600 hover:text-orange-700">info@aadinathindustries.in</a>
                </div>
              </div>

              {/* Works */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏭</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Manufacturing Works</h4>
                  <p className="text-gray-600">Survey No. 44, Post: Vadia, Sihor Road, Vadia, Dist. Bhavnagar</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏢</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Corporate Office</h4>
                  <p className="text-gray-600">A-2, Hans Complex, Sanskar Mandal, Bhavnagar, 364002</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Contact Cards */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Connect</h2>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-bold text-orange-700 mb-2">💬 WhatsApp</h3>
              <p className="text-gray-600 text-sm mb-4">Send us a message directly on WhatsApp for instant support.</p>
              <a
                href="https://wa.me/919825207616"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-700 mb-2">📦 Bulk & Export Enquiries</h3>
              <p className="text-gray-600 text-sm mb-4">For bulk orders, dealership, or export requirements, get in touch with our sales team.</p>
              <a href="tel:+919825207616" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                Call Us
              </a>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-purple-700 mb-2">✅ Quality Assurance</h3>
              <p className="text-gray-600 text-sm">
                All products are precision-engineered to meet strict dimensional tolerances, weight standards, and straightness requirements. Each batch undergoes rigorous quality checks at our state-of-the-art facility in Sihor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
