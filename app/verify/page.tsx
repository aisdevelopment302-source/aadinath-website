import { Suspense } from 'react'
import VerifyContent from '@/components/VerifyContent'

function VerifyLoading() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-600">Loading verification...</p>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  )
}
