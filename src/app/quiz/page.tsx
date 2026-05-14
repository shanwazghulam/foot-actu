import { client } from '@/sanity/client'
import { quizzesQuery } from '@/sanity/queries'
import Link from 'next/link'

export const revalidate = 60

const CATEGORIES = [
  { key: 'facile',    label: 'Facile',    emoji: '🟢', color: 'bg-green-100 text-green-700',   border: 'border-green-200', heading: 'text-green-700' },
  { key: 'moyen',    label: 'Moyen',     emoji: '🟡', color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200', heading: 'text-yellow-700' },
  { key: 'difficile',label: 'Difficile', emoji: '🔴', color: 'bg-red-100 text-red-700',       border: 'border-red-200',   heading: 'text-red-700' },
]

type Quiz = {
  _id: string
  titre: string
  slug: { current: string }
  description: string
  emoji: string
  difficulte: string
  nbQuestions: number
}

function QuizCard({ q, badgeColor }: { q: Quiz; badgeColor: string }) {
  return (
    <Link
      href={`/quiz/${q.slug.current}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-md transition group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-4xl">{q.emoji || '🧠'}</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badgeColor}`}>
          {CATEGORIES.find(c => c.key === q.difficulte)?.label ?? q.difficulte}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition text-lg leading-tight mb-1">
          {q.titre}
        </h3>
        {q.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{q.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-400">{q.nbQuestions} question{q.nbQuestions > 1 ? 's' : ''}</span>
        <span className="text-sm font-semibold text-green-600 group-hover:translate-x-1 transition-transform">
          Jouer →
        </span>
      </div>
    </Link>
  )
}

export default async function QuizPage() {
  const quizzes: Quiz[] = await client.fetch(quizzesQuery)

  if (quizzes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">🧠 Quiz Football</h1>
          <p className="text-gray-500">Teste tes connaissances sur le foot européen</p>
        </div>
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">🧩</p>
          <p className="text-lg font-medium">Aucun quiz disponible pour le moment</p>
          <p className="text-sm mt-2">
            Crée ton premier quiz dans le{' '}
            <Link href="/studio" className="text-green-600 underline">Studio</Link>
          </p>
        </div>
      </div>
    )
  }

  const byDiff = Object.fromEntries(
    CATEGORIES.map(c => [c.key, quizzes.filter(q => q.difficulte === c.key)])
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">🧠 Quiz Football</h1>
        <p className="text-gray-500">Teste tes connaissances sur le foot européen</p>
      </div>

      <div className="space-y-10">
        {CATEGORIES.map(cat => {
          const list = byDiff[cat.key]
          if (!list || list.length === 0) return null
          return (
            <section key={cat.key}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{cat.emoji}</span>
                <h2 className={`text-xl font-extrabold ${cat.heading}`}>{cat.label}</h2>
                <span className="text-sm text-gray-400 font-medium">— {list.length} quiz</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map(q => (
                  <QuizCard key={q._id} q={q} badgeColor={cat.color} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
