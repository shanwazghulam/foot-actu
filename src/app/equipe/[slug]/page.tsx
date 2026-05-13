import { client } from '@/sanity/client'
import { equipeBySlugQuery, articlesByEquipeQuery } from '@/sanity/queries'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 3600

const couleurMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-800',
}

const posteMap: Record<string, string> = {
  Goalkeeper: 'Gardien',
  Defence: 'Défenseur',
  'Centre-Back': 'Défenseur',
  'Left-Back': 'Défenseur',
  'Right-Back': 'Défenseur',
  Midfield: 'Milieu',
  'Central Midfield': 'Milieu',
  'Defensive Midfield': 'Milieu',
  'Attacking Midfield': 'Milieu',
  Offence: 'Attaquant',
  'Centre-Forward': 'Attaquant',
  'Left Winger': 'Attaquant',
  'Right Winger': 'Attaquant',
  'Secondary Striker': 'Attaquant',
}

async function fetchTeamDetails(fdoId: number) {
  const res = await fetch(`https://api.football-data.org/v4/teams/${fdoId}`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  return res.json()
}

type Joueur = { id: number; name: string; position: string; dateOfBirth: string; nationality: string }

export default async function EquipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const equipe = await client.fetch(equipeBySlugQuery, { slug })
  if (!equipe) notFound()

  const [details, articles] = await Promise.all([
    equipe.fdoId ? fetchTeamDetails(equipe.fdoId) : null,
    client.fetch(articlesByEquipeQuery, { slug }),
  ])
  const couleur = couleurMap[equipe.championnat?.couleur] ?? 'bg-gray-100 text-gray-800'

  const joueurs: Joueur[] = details?.squad ?? []
  const parPoste = joueurs.reduce((acc: Record<string, Joueur[]>, j: Joueur) => {
    const poste = posteMap[j.position] ?? j.position
    if (!acc[poste]) acc[poste] = []
    acc[poste].push(j)
    return acc
  }, {})

  const ordrePostes = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant']

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={`/championnat/${equipe.championnat?.slug?.current}`} className="text-sm text-gray-500 hover:text-gray-800 transition mb-6 inline-block">
        ← {equipe.championnat?.nom}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col sm:flex-row items-center gap-6 mb-8">
        {equipe.logo ? (
          <Image src={equipe.logo} alt={equipe.nom} width={96} height={96} className="object-contain shrink-0" />
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl shrink-0">⚽</div>
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{equipe.nom}</h1>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {equipe.championnat && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${couleur}`}>{equipe.championnat.nom}</span>
            )}
            {details?.area?.name && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{details.area.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Infos */}
      {details && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {details.founded && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Fondé en</p>
              <p className="text-xl font-bold text-gray-800">{details.founded}</p>
            </div>
          )}
          {details.venue && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-2">
              <p className="text-xs text-gray-500 mb-1">Stade</p>
              <p className="text-lg font-bold text-gray-800">{details.venue}</p>
            </div>
          )}
          {details.coach?.name && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Entraîneur</p>
              <p className="text-base font-bold text-gray-800">{details.coach.name}</p>
            </div>
          )}
          {details.clubColors && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-2 sm:col-span-4">
              <p className="text-xs text-gray-500 mb-1">Couleurs</p>
              <p className="text-base font-semibold text-gray-800">{details.clubColors}</p>
            </div>
          )}
        </div>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Parameters<typeof ArticleCard>[0]['article']) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Effectif */}
      {joueurs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Effectif ({joueurs.length} joueurs)</h2>
          <div className="space-y-6">
            {ordrePostes.filter(p => parPoste[p]).map(poste => (
              <div key={poste}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{poste}s</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parPoste[poste].map((j: Joueur) => (
                    <div key={j.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{j.name}</span>
                      <span className="text-sm text-gray-500">{j.nationality}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
