import { client } from '@/sanity/client'
import { articlesByChampionnatQuery, championnatsQuery, equipesByChampionnatQuery } from '@/sanity/queries'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import Image from 'next/image'
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

type Equipe = { _id: string; nom: string; slug: { current: string }; pays: string; logo: string }

export default async function ChampionnatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [articles, championnats, equipes] = await Promise.all([
    client.fetch(articlesByChampionnatQuery, { slug }),
    client.fetch(championnatsQuery),
    client.fetch(equipesByChampionnatQuery, { slug }),
  ])

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

      {/* Équipes */}
      {equipes.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Équipes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {equipes.map((equipe: Equipe) => (
              <Link
                key={equipe._id}
                href={`/equipe/${equipe.slug.current}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition group"
              >
                {equipe.logo ? (
                  <Image
                    src={equipe.logo}
                    alt={equipe.nom}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">⚽</div>
                )}
                <span className="text-xs font-medium text-gray-700 text-center group-hover:text-green-600 transition leading-tight">
                  {equipe.nom}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Articles</h2>
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
