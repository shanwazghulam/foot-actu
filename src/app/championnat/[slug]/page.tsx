import { client } from '@/sanity/client'
import { articlesByChampionnatQuery, championnatsQuery } from '@/sanity/queries'
import ArticleCard from '@/components/ArticleCard'
import Image from 'next/image'
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

const competitionCode: Record<string, string> = {
  'ligue-1': 'FL1',
  'premier-league': 'PL',
  'laliga': 'PD',
  'serie-a': 'SA',
  'bundesliga': 'BL1',
}

type StandingRow = {
  position: number
  team: { id: number; name: string; shortName: string; crest: string }
  playedGames: number; won: number; draw: number; lost: number
  points: number; goalsFor: number; goalsAgainst: number; goalDifference: number
}

type Scorer = {
  player: { id: number; name: string; nationality: string }
  team: { shortName: string; crest: string }
  goals: number
  assists: number | null
}

type Match = {
  id: number; utcDate: string; status: string; matchday: number
  homeTeam: { id: number; shortName: string; crest: string }
  awayTeam: { id: number; shortName: string; crest: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

async function fetchStandings(code: string): Promise<{ table: StandingRow[]; currentMatchday: number }> {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/standings`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return { table: [], currentMatchday: 1 }
  const data = await res.json()
  return {
    table: data.standings?.[0]?.table ?? [],
    currentMatchday: data.season?.currentMatchday ?? 1,
  }
}

async function fetchScorers(code: string): Promise<Scorer[]> {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/scorers?limit=10`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.scorers ?? []
}

async function fetchMatchday(code: string, matchday: number): Promise<Match[]> {
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${code}/matches?matchday=${matchday}`,
    {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.matches ?? []
}

async function fetchUpcoming(code: string): Promise<Match[]> {
  const now = new Date()
  const dateFrom = now.toISOString().slice(0, 10)
  const dateTo = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${code}/matches?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.matches ?? [])
    .filter((m: Match) => new Date(m.utcDate) > now)
    .slice(0, 6)
}

function formatDate(utcDate: string) {
  return new Date(utcDate).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default async function ChampionnatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const code = competitionCode[slug]

  const [articles, championnats, { table: standings, currentMatchday }, scorers, upcoming] =
    await Promise.all([
      client.fetch(articlesByChampionnatQuery, { slug }),
      client.fetch(championnatsQuery),
      code ? fetchStandings(code) : Promise.resolve({ table: [], currentMatchday: 1 }),
      code ? fetchScorers(code) : Promise.resolve([]),
      code ? fetchUpcoming(code) : Promise.resolve([]),
    ])

  // Fetch matchday results after we know currentMatchday
  const matchdayResults: Match[] = code ? await fetchMatchday(code, currentMatchday) : []

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

      {/* Classement + Buteurs */}
      {(standings.length > 0 || scorers.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {standings.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <h2 className="text-base font-bold text-gray-800 px-5 py-4 border-b border-gray-100">Classement</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-2 text-left w-8">#</th>
                      <th className="px-2 py-2 text-left">Équipe</th>
                      <th className="px-3 py-2 text-center">J</th>
                      <th className="px-3 py-2 text-center">G</th>
                      <th className="px-3 py-2 text-center">N</th>
                      <th className="px-3 py-2 text-center">P</th>
                      <th className="px-3 py-2 text-center">DB</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-600">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row, i) => {
                      const total = standings.length
                      const borderColor = i < 4 ? 'border-l-blue-500' : i < 6 ? 'border-l-orange-400' : total - i <= 3 ? 'border-l-red-400' : 'border-l-transparent'
                      return (
                        <tr key={row.team.id} className={`border-b border-gray-50 hover:bg-gray-50 transition border-l-2 ${borderColor}`}>
                          <td className="px-5 py-2.5 text-gray-500 font-medium">{row.position}</td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center gap-2">
                              <Image src={row.team.crest} alt={row.team.shortName} width={20} height={20} className="object-contain shrink-0" />
                              <span className="font-medium text-gray-800 truncate max-w-[120px]">{row.team.shortName}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center text-gray-600">{row.playedGames}</td>
                          <td className="px-3 py-2.5 text-center text-gray-600">{row.won}</td>
                          <td className="px-3 py-2.5 text-center text-gray-600">{row.draw}</td>
                          <td className="px-3 py-2.5 text-center text-gray-600">{row.lost}</td>
                          <td className="px-3 py-2.5 text-center text-gray-500">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                          <td className="px-3 py-2.5 text-center font-bold text-gray-900">{row.points}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="flex gap-4 px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-500 inline-block"></span>Ligue des Champions</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-400 inline-block"></span>Europa League</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block"></span>Relégation</span>
                </div>
              </div>
            </div>
          )}

          {/* Buteurs */}
          {scorers.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <h2 className="text-base font-bold text-gray-800 px-5 py-4 border-b border-gray-100">⚽ Buteurs</h2>
              <div className="divide-y divide-gray-50">
                {scorers.map((s, i) => (
                  <div key={s.player.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{i + 1}</span>
                    <Image src={s.team.crest} alt={s.team.shortName} width={18} height={18} className="object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link href={`/joueur/${s.player.id}`} className="text-sm font-medium text-gray-800 truncate block hover:text-green-600 transition">
                        {s.player.name}
                      </Link>
                      <p className="text-xs text-gray-400 truncate">{s.team.shortName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-gray-900">{s.goals}</span>
                      <span className="text-xs text-gray-400 ml-1">buts</span>
                      {s.assists != null && (
                        <p className="text-xs text-gray-400">{s.assists} passe{s.assists > 1 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Journée en cours + Prochains matchs */}
      {(matchdayResults.length > 0 || upcoming.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {matchdayResults.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <h2 className="text-base font-bold text-gray-800 px-5 py-4 border-b border-gray-100">
                Journée {currentMatchday}
              </h2>
              <div className="divide-y divide-gray-50">
                {matchdayResults.map((match) => {
                  const done = match.status === 'FINISHED'
                  const live = match.status === 'IN_PLAY' || match.status === 'PAUSED'
                  const h = match.score.fullTime.home
                  const a = match.score.fullTime.away
                  return (
                    <div key={match.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                        <span className="text-xs font-medium text-gray-700 truncate">{match.homeTeam.shortName}</span>
                        <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={18} height={18} className="object-contain shrink-0" />
                      </div>
                      <div className="shrink-0 w-16 text-center">
                        {done || live ? (
                          <span className={`text-sm font-bold ${live ? 'text-red-500' : 'text-gray-900'}`}>{h} - {a}</span>
                        ) : (
                          <span className="text-xs text-gray-400">{new Date(match.utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Image src={match.awayTeam.crest} alt={match.awayTeam.shortName} width={18} height={18} className="object-contain shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate">{match.awayTeam.shortName}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-base font-bold text-gray-800">📅 Prochains matchs</h2>
                <span className="text-xs text-gray-400">{upcoming.length} matchs à venir</span>
              </div>
              <div className="divide-y divide-gray-100">
                {upcoming.map((match) => (
                  <div key={match.id} className="px-5 py-4 hover:bg-gray-50 transition">
                    <p className="text-xs font-semibold text-green-600 mb-3">
                      J{match.matchday} &nbsp;·&nbsp; {formatDate(match.utcDate)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                        <span className="text-sm font-semibold text-gray-800 truncate">{match.homeTeam.shortName}</span>
                        <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={28} height={28} className="object-contain shrink-0" />
                      </div>
                      <span className="shrink-0 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg">VS</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Image src={match.awayTeam.crest} alt={match.awayTeam.shortName} width={28} height={28} className="object-contain shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">{match.awayTeam.shortName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
