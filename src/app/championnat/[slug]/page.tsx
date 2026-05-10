import { client } from '@/sanity/client'
import { articlesByChampionnatQuery, championnatsQuery } from '@/sanity/queries'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  const championnats = await client.fetch(championnatsQuery)
  return championnats.map((c: { slug: { current: string } }) => ({ slug: c.slug.current }))
}

const championsEmoji: Record<string, string> = {
  'ligue-1': '🇫🇷',
  'premier-league': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'laliga': '🇪🇸',
  'serie-a': '🇮🇹',
  'bundesliga': '🇩🇪',
}

export default async function ChampionnatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const articles = await client.fetch(articlesByChampionnatQuery, { slug })

  const championnats = await client.fetch(championnatsQuery)
  const championnat = championnats.find((c: { slug: { current: string } }) => c.slug.current === slug)

  if (!championnat) notFound()

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition">← Tous les articles</Link>
        <span className="text-gray-300">|</span>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {championsEmoji[slug] ?? '🏆'} {championnat.nom}
        </h1>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium">Aucun article pour {championnat.nom} pour le moment</p>
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
