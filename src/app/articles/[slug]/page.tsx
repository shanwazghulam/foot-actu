import { client, urlFor } from '@/sanity/client'
import { articleBySlugQuery, articlesQuery } from '@/sanity/queries'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  const articles = await client.fetch(articlesQuery)
  return articles.map((a: { slug: { current: string } }) => ({ slug: a.slug.current }))
}

const couleurMap: Record<string, string> = {
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  red: 'bg-red-600',
  green: 'bg-emerald-600',
  gray: 'bg-gray-700',
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug })

  if (!article) notFound()

  const badgeColor = couleurMap[article.championnat?.couleur ?? ''] ?? 'bg-gray-600'

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        ← Retour aux articles
      </Link>

      {article.championnat && (
        <Link href={`/championnat/${article.championnat.slug.current}`}>
          <span className={`${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block`}>
            {article.championnat.nom}
          </span>
        </Link>
      )}

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-3 mb-4">
        {article.titre}
      </h1>

      {article.publishedAt && (
        <p className="text-sm text-gray-400 mb-6">
          Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      {article.image && (
        <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100">
          <Image
            src={urlFor(article.image).width(900).height(500).url()}
            alt={article.titre}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.resume && (
        <p className="text-lg text-gray-600 italic border-l-4 border-green-400 pl-4 mb-8">{article.resume}</p>
      )}

      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-green-600">
        {article.contenu && <PortableText value={article.contenu} />}
      </div>
    </article>
  )
}
