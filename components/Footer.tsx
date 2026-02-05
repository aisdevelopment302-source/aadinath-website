import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo-aa.png" alt="AA" width={36} height={36} />
              <span className="text-white text-lg font-bold">Aadinath Industries</span>
            </div>
            <p className="text-sm leading-relaxed">
              A cornerstone in the re-rolling mills sector and a trusted trading partner in the metals industry. Crafted with Care, Delivered with Pride.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About Us', href: '/about-us' },
                { label: 'Contact Us', href: '/contact-us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <span className="text-orange-400 font-medium">Phone:</span>{' '}
                <a href="tel:+919825207616" className="hover:text-orange-400 transition-colors">+91 9825207616</a>
              </li>
              <li>
                <span className="text-orange-400 font-medium">Email:</span>{' '}
                <a href="mailto:info@aadinathindustries.in" className="hover:text-orange-400 transition-colors">info@aadinathindustries.in</a>
              </li>
              <li>
                <span className="text-orange-400 font-medium">Works:</span>{' '}
                Survey No. 44, Post: Vadia, Sihor Road, Dist. Bhavnagar
              </li>
              <li>
                <span className="text-orange-400 font-medium">Office:</span>{' '}
                A-2, Hans Complex, Sanskar Mandal, Bhavnagar, 364002
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2024 Aadinath Industries. All Rights Reserved.</span>
          <span>Pioneering Excellence in Every Element</span>
        </div>
      </div>
    </footer>
  )
}
