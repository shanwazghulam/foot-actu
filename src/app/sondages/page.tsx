import { client } from '@/sanity/client'
import Link from 'next/link'
import { groq } from 'next-sanity'

export const revalidate = 60

const sondagesQuery = groq`
  *[_type == "sondage" && actif == true] | order(_createdAt desc) {
    _id, question, slug, emoji,
    "totalVotes": math::sum(options[].votes),
    "nbOptions": count(options)
  }
`

type Sondage = {
  _id: string
  question: string
  slug: { current: string }
  emoji: string
  totalVotes: number
  nbOptions: number
}

export default async function SondagesPage() {
  const sondages: Sondage[] = await client.fetch(sondagesQuery)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">🗳️ Sondages</h1>
        <p className="text-gray-500">Donne ton avis sur le foot !</p>
      </div>

      {sondages.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">🗳️</p>
          <p className="text-lg font-medium">Aucun sondage disponible</p>
          <p className="text-sm mt-2">
            Crée ton premier sondage dans le{' '}
            <Link href="/studio" className="text-green-600 underline">Studio</Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sondages.map((s) => (
            <Link
              key={s._id}
              href={`/sondages/${s.slug.current}`}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-sm transition group"
            >
              <span className="text-4xl shrink-0">{s.emoji || '🗳️'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 group-hover:text-green-600 transition text-lg leading-tight">
                  {s.question}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {s.nbOptions} options · {s.totalVotes} vote{s.totalVotes > 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-green-400 group-hover:translate-x-1 transition-all text-xl shrink-0">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
