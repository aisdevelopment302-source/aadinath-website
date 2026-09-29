"use client"

import type { ScanQuestion } from '@/lib/analytics'

// The one-tap questions after a QR scan. Keys must match the allowed answers in
// /api/track and website.scan_answers.
export const END_USES = [
  { key: 'gate_grill', label: 'Gate / grill' },
  { key: 'shed_truss', label: 'Shed / roof truss' },
  { key: 'solar_structure', label: 'Solar structure' },
  { key: 'rack_shelf', label: 'Rack / shelf' },
  { key: 'machine_frame', label: 'Machine frame' },
  { key: 'tower', label: 'Tower' },
  { key: 'resale', label: 'I resell it' },
  { key: 'other', label: 'Something else' },
]

export const ISSUES = [
  { key: 'straightness', label: 'Not straight' },
  { key: 'weight', label: 'Weight' },
  { key: 'rust', label: 'Rust' },
  { key: 'size', label: 'Size' },
  { key: 'other', label: 'Something else' },
]

export type ScanAnswers = { end_use?: string; rating?: string; issue?: string }

export const labelOf = (list: { key: string; label: string }[], key?: string) =>
  list.find((item) => item.key === key)?.label

const chip =
  'text-sm px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-orange-400 active:bg-orange-50'

/** Three quick questions, one tap each: what they will make, whether the quality
 * is good, and (only if not) what is wrong. Each answer is sent once. */
export default function ScanQuestions({
  answers,
  onAnswer,
}: {
  answers: ScanAnswers
  onAnswer: (question: ScanQuestion, answer: string) => void
}) {
  const answer = (question: ScanQuestion, key: string) => {
    if (!answers[question]) onAnswer(question, key)
  }

  return (
    <div className="w-full text-left bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
      {!answers.end_use ? (
        <>
          <p className="text-sm font-semibold text-gray-800 mb-3">What will you make with this angle?</p>
          <div className="grid grid-cols-2 gap-2">
            {END_USES.map((item) => (
              <button key={item.key} type="button" className={chip} onClick={() => answer('end_use', item.key)}>
                {item.label}
              </button>
            ))}
          </div>
        </>
      ) : !answers.rating ? (
        <>
          <p className="text-xs text-gray-500 mb-3">✓ {labelOf(END_USES, answers.end_use)}</p>
          <p className="text-sm font-semibold text-gray-800 mb-3">How is the quality?</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={chip} onClick={() => answer('rating', 'good')}>
              👍 Good
            </button>
            <button type="button" className={chip} onClick={() => answer('rating', 'bad')}>
              👎 Not good
            </button>
          </div>
        </>
      ) : answers.rating === 'bad' && !answers.issue ? (
        <>
          <p className="text-sm font-semibold text-gray-800 mb-3">What is wrong?</p>
          <div className="grid grid-cols-2 gap-2">
            {ISSUES.map((item) => (
              <button key={item.key} type="button" className={chip} onClick={() => answer('issue', item.key)}>
                {item.label}
              </button>
            ))}
          </div>
        </>
      ) : answers.rating === 'bad' ? (
        <p className="text-sm text-gray-700">
          Sorry about that. Please message us on WhatsApp below with a photo, and we will make it right.
        </p>
      ) : (
        <p className="text-sm text-gray-700">Thank you! Your answers help us make better steel.</p>
      )}
    </div>
  )
}
