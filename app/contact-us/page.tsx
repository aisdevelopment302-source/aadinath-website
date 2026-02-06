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
              <div className="flex gap-5 items-start group">
                <div className="w-14 h-14 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Phone</h4>
                  <a href="tel:+919825207616" className="text-orange-600 hover:text-orange-700 font-medium">+91 9825207616</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-5 items-start group">
                <div className="w-14 h-14 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Email</h4>
                  <a href="mailto:info@aadinathindustries.in" className="text-orange-600 hover:text-orange-700 font-medium">info@aadinathindustries.in</a>
                </div>
              </div>

              {/* Works */}
              <div className="flex gap-5 items-start group">
                <div className="w-14 h-14 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Manufacturing Works</h4>
                  <p className="text-gray-600">Survey No. 44, Post: Vadia, Sihor Road, Vadia, Dist. Bhavnagar</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex gap-5 items-start group">
                <div className="w-14 h-14 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 5h1m-1 4h1m4-4h1m-1 4h1" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Corporate Office</h4>
                  <p className="text-gray-600">A-2, Hans Complex, Sanskar Mandal, Bhavnagar, 364002</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Contact Cards */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Connect</h2>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
                <h3 className="font-bold text-orange-700">WhatsApp</h3>
              </div>
              <p className="text-gray-700 text-sm mb-5 font-medium">Send us a message directly on WhatsApp for instant support.</p>
              <a
                href="https://wa.me/919825207616"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 7v10m0 0l8 4" />
                </svg>
                <h3 className="font-bold text-gray-800">Bulk & Export</h3>
              </div>
              <p className="text-gray-700 text-sm mb-5 font-medium">For bulk orders, dealership, or export requirements, get in touch with our sales team.</p>
              <a href="tel:+919825207616" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg">
                Call Us
              </a>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-blue-900">Quality Assurance</h3>
              </div>
              <p className="text-gray-700 text-sm font-medium">
                All products are precision-engineered to meet strict dimensional tolerances, weight standards, and straightness requirements. Each batch undergoes rigorous quality checks at our state-of-the-art facility in Sihor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
