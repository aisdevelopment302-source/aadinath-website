'use client'

import { useState } from 'react'
import { trackCustomerSubmission, getUserLocationFromIP } from '@/lib/analytics'

interface CustomerDataFormProps {
  batchId?: string
  onSuccess?: () => void
}

export default function CustomerDataForm({ batchId, onSuccess }: CustomerDataFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    useCase: '',
    quantityNeeded: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get user location
      const location = await getUserLocationFromIP()

      // Submit to Firebase
      const result = await trackCustomerSubmission({
        ...formData,
        city: formData.city || location.city,
        state: formData.state || location.state,
        country: location.country,
        batchId,
      })

      if (result.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          useCase: '',
          quantityNeeded: '',
        })
        setTimeout(() => setIsOpen(false), 2000)
        onSuccess?.()
      } else {
        setError('Failed to submit. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
        >
          📋 Help Us Serve You Better
        </button>
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Information</h3>
          <p className="text-xs text-gray-600 mb-3">
            Share your details so we can reach out for future orders and updates.
          </p>

          {submitted ? (
            <div className="text-center py-4">
              <p className="text-green-700 font-semibold">✔ Thank you! We'll reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone / WhatsApp"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <select
                name="useCase"
                value={formData.useCase}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">What's your use case?</option>
                <option value="construction">Construction</option>
                <option value="fabrication">Fabrication</option>
                <option value="trading">Trading / Wholesale</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                name="quantityNeeded"
                placeholder="Typical quantity needed (e.g., 500 kg)"
                value={formData.quantityNeeded}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
