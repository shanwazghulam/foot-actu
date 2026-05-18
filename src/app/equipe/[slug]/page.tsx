import { client } from '@/sanity/client'
import { equipeBySlugQuery, articlesByEquipeQuery } from '@/sanity/queries'
import ArticleCard from '@/components/ArticleCard'
import FavorisButton from '@/components/FavorisButton'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { palmaresEquipes } from '@/data/palmares-equipes'

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

type Joueur = { id: number; name: string; position: string; dateOfBirth: string; nationality: string }

type TeamMatch = {
  id: number; utcDate: string; status: string
  competition: { name: string; emblem: string }
  homeTeam: { id: number; shortName: string; crest: string }
  awayTeam: { id: number; shortName: string; crest: string }
  score: { fullTime: { home: number | null; away: number | null }; winner: string | null }
}

async function fetchTeamDetails(fdoId: number) {
  const res = await fetch(`https://api.football-data.org/v4/teams/${fdoId}`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  return res.json()
}

async function fetchTeamMatches(fdoId: number, status: string, limit: number): Promise<TeamMatch[]> {
  const res = await fetch(
    `https://api.football-data.org/v4/teams/${fdoId}/matches?status=${status}&limit=${limit}`,
    {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
      next: { revalidate: 1800 },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.matches ?? []
}

function resultBadge(match: TeamMatch, teamId: number) {
  const winner = match.score.winner
  if (!winner) return { label: 'N', cls: 'bg-gray-200 text-gray-600' }
  if (winner === 'DRAW') return { label: 'N', cls: 'bg-gray-200 text-gray-600' }
  const isHome = match.homeTeam.id === teamId
  const won = (isHome && winner === 'HOME_TEAM') || (!isHome && winner === 'AWAY_TEAM')
  return won
    ? { label: 'V', cls: 'bg-green-100 text-green-700' }
    : { label: 'D', cls: 'bg-red-100 text-red-700' }
}

export default async function EquipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const equipe = await client.fetch(equipeBySlugQuery, { slug })
  if (!equipe) notFound()

  const [details, articles] = await Promise.all([
    equipe.fdoId ? fetchTeamDetails(equipe.fdoId) : null,
    client.fetch(articlesByEquipeQuery, { slug }),
  ])

  const [recentMatches, upcomingMatches] = equipe.fdoId
    ? await Promise.all([
        fetchTeamMatches(equipe.fdoId, 'FINISHED', 5),
        fetchTeamMatches(equipe.fdoId, 'SCHEDULED', 5),
      ])
    : [[], []]

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
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start mb-3">
            {equipe.championnat && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${couleur}`}>{equipe.championnat.nom}</span>
            )}
            {details?.area?.name && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{details.area.name}</span>
            )}
          </div>
          <FavorisButton equipe={{
            slug: equipe.slug?.current ?? equipe.slug,
            nom: equipe.nom,
            logo: equipe.logo ?? null,
            championnat: equipe.championnat ? {
              nom: equipe.championnat.nom,
              slug: equipe.championnat.slug?.current ?? equipe.championnat.slug,
              couleur: equipe.championnat.couleur ?? 'gray',
            } : null,
          }} />
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

      {/* Forme récente + Prochains matchs */}
      {(recentMatches.length > 0 || upcomingMatches.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {recentMatches.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <h2 className="text-base font-bold text-gray-800 px-5 py-4 border-b border-gray-100">Forme récente</h2>
              <div className="divide-y divide-gray-50">
                {[...recentMatches].reverse().map((match) => {
                  const { label, cls } = resultBadge(match, equipe.fdoId)
                  const h = match.score.fullTime.home
                  const a = match.score.fullTime.away
                  return (
                    <div key={match.id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${cls}`}>{label}</span>
                      <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                        <span className="text-xs text-gray-600 truncate">{match.homeTeam.shortName}</span>
                        <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={16} height={16} className="object-contain shrink-0" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 shrink-0 w-10 text-center">{h} - {a}</span>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Image src={match.awayTeam.crest} alt={match.awayTeam.shortName} width={16} height={16} className="object-contain shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{match.awayTeam.shortName}</span>
                      </div>
                      <div className="shrink-0">
                        <Image src={match.competition.emblem} alt={match.competition.name} width={14} height={14} className="object-contain opacity-50" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <h2 className="text-base font-bold text-gray-800 px-5 py-4 border-b border-gray-100">Prochains matchs</h2>
              <div className="divide-y divide-gray-50">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="px-4 py-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Image src={match.competition.emblem} alt={match.competition.name} width={12} height={12} className="object-contain opacity-50" />
                      <p className="text-xs text-gray-400">
                        {match.competition.name} · {new Date(match.utcDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                        <span className="text-xs font-medium text-gray-700 truncate">{match.homeTeam.shortName}</span>
                        <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={18} height={18} className="object-contain shrink-0" />
                      </div>
                      <span className="text-xs font-bold text-gray-300 shrink-0">vs</span>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Image src={match.awayTeam.crest} alt={match.awayTeam.shortName} width={18} height={18} className="object-contain shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate">{match.awayTeam.shortName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Palmarès */}
      {equipe.fdoId && palmaresEquipes[equipe.fdoId] && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Palmarès</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {palmaresEquipes[equipe.fdoId].map((t) => (
              <div key={t.competition} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-yellow-300 transition">
                <p className="text-2xl mb-1">{t.emoji}</p>
                <p className="text-xs text-gray-500 mb-2 leading-tight">{t.competition}</p>
                <p className={`text-3xl font-extrabold ${t.titres > 0 ? 'text-gray-900' : 'text-gray-300'}`}>
                  {t.titres}
                </p>
                {t.annees && (
                  <p className="text-xs text-gray-400 mt-1 leading-tight">{t.annees}</p>
                )}
              </div>
            ))}
          </div>
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
                    <Link
                      key={j.id}
                      href={`/joueur/${j.id}`}
                      className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex justify-between items-center hover:border-green-400 hover:shadow-sm transition"
                    >
                      <span className="font-medium text-gray-800">{j.name}</span>
                      <span className="text-sm text-gray-500">{j.nationality}</span>
                    </Link>
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
