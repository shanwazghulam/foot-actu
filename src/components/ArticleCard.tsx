import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

const couleurMap: Record<string, string> = {
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  red: 'bg-red-600',
  green: 'bg-emerald-600',
  gray: 'bg-gray-700',
}

type Article = {
  _id: string
  titre: string
  slug: { current: string }
  resume?: string
  publishedAt?: string
  image?: { asset: { _ref: string } }
  championnat?: { nom: string; slug: { current: string }; couleur?: string }
}

export default function ArticleCard({ article }: { article: Article }) {
  const badgeColor = couleurMap[article.championnat?.couleur ?? ''] ?? 'bg-gray-600'

  return (
    <Link href={`/articles/${article.slug.current}`} className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-100">
        {article.image ? (
          <Image
            src={urlFor(article.image).width(600).height(400).url()}
            alt={article.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-200">⚽</div>
        )}
        {article.championnat && (
          <span className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {article.championnat.nom}
          </span>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
          {article.titre}
        </h2>
        {article.resume && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.resume}</p>
        )}
        {article.publishedAt && (
          <p className="text-xs text-gray-400">
            {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </Link>
  )
}
