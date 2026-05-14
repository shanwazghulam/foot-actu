import { client } from '@/sanity/client'
import { articlesQuery, championnatsQuery } from '@/sanity/queries'
import ArticleCard from '@/components/ArticleCard'
import LiveScores from '@/components/LiveScores'
import Link from 'next/link'

export const revalidate = 60

const championsEmoji: Record<string, string> = {
  'ligue-1': '🇫🇷',
  'premier-league': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'laliga': '🇪🇸',
  'serie-a': '🇮🇹',
  'bundesliga': '🇩🇪',
}

export default async function HomePage() {
  const [articles, championnats] = await Promise.all([
    client.fetch(articlesQuery),
    client.fetch(championnatsQuery),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 text-center py-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">⚽ FootActu</h1>
        <p className="text-gray-300 text-lg">L&apos;actualité des 5 grands championnats européens</p>
      </section>

      {/* Scores live */}
      <LiveScores />

      {/* Filtres championnats */}
      <section className="mb-8 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition">
          Tous
        </Link>
        {championnats.map((c: { _id: string; nom: string; slug: { current: string } }) => (
          <Link
            key={c._id}
            href={`/championnat/${c.slug.current}`}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition shadow-sm"
          >
            {championsEmoji[c.slug.current] ?? '🏆'} {c.nom}
          </Link>
        ))}
      </section>

      {/* Grille articles */}
      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg font-medium">Aucun article pour le moment</p>
          <p className="text-sm mt-1">
            Rendez-vous dans le{' '}
            <Link href="/studio" className="text-green-600 underline">Studio Sanity</Link>{' '}
            pour publier votre premier article.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Parameters<typeof ArticleCard>[0]['article']) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
