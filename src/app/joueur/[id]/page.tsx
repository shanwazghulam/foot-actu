import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 86400

type PlayerMatch = {
  id: number; utcDate: string; status: string
  competition: { name: string; emblem: string }
  homeTeam: { id: number; shortName: string; crest: string }
  awayTeam: { id: number; shortName: string; crest: string }
  score: { fullTime: { home: number | null; away: number | null }; winner: string | null }
}

async function fetchPlayer(id: string) {
  const res = await fetch(`https://api.football-data.org/v4/persons/${id}`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 86400 },
  })
  if (!res.ok) return null
  return res.json()
}

async function fetchPlayerMatches(id: string): Promise<PlayerMatch[]> {
  const res = await fetch(
    `https://api.football-data.org/v4/persons/${id}/matches?status=FINISHED&limit=10`,
    {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.matches ?? []
}

function age(dateOfBirth: string) {
  const diff = Date.now() - new Date(dateOfBirth).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

const posteMap: Record<string, string> = {
  Goalkeeper: 'Gardien', Defence: 'Défenseur', Midfield: 'Milieu', Offence: 'Attaquant',
  'Centre-Back': 'Défenseur', 'Left-Back': 'Défenseur', 'Right-Back': 'Défenseur',
  'Central Midfield': 'Milieu', 'Defensive Midfield': 'Milieu', 'Attacking Midfield': 'Milieu',
  'Centre-Forward': 'Attaquant', 'Left Winger': 'Attaquant', 'Right Winger': 'Attaquant',
  'Secondary Striker': 'Attaquant',
}

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [player, matches] = await Promise.all([
    fetchPlayer(id),
    fetchPlayerMatches(id),
  ])
  if (!player) notFound()

  const poste = posteMap[player.position] ?? player.position
  const team = player.currentTeam

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="javascript:history.back()" className="text-sm text-gray-500 hover:text-gray-800 transition mb-6 inline-block">
        ← Retour
      </Link>

      {/* Header joueur */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl shrink-0">
          👤
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{player.name}</h1>
          {player.firstName && player.lastName && player.name !== `${player.firstName} ${player.lastName}` && (
            <p className="text-gray-400 text-sm mb-2">{player.firstName} {player.lastName}</p>
          )}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {poste && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{poste}</span>}
            {player.nationality && <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{player.nationality}</span>}
            {team && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1.5">
                {team.crest && <Image src={team.crest} alt={team.shortName} width={16} height={16} className="object-contain" />}
                {team.shortName ?? team.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Infos détaillées */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {player.dateOfBirth && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Âge</p>
            <p className="text-xl font-bold text-gray-800">{age(player.dateOfBirth)} ans</p>
            <p className="text-xs text-gray-400">{new Date(player.dateOfBirth).toLocaleDateString('fr-FR')}</p>
          </div>
        )}
        {player.nationality && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Nationalité</p>
            <p className="text-base font-bold text-gray-800">{player.nationality}</p>
          </div>
        )}
        {player.position && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Poste</p>
            <p className="text-base font-bold text-gray-800">{poste}</p>
          </div>
        )}
        {team?.contract?.until && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Contrat jusqu'au</p>
            <p className="text-base font-bold text-gray-800">{new Date(team.contract.until).getFullYear()}</p>
          </div>
        )}
      </div>

      {/* Compétitions actives */}
      {team?.runningCompetitions?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
          <h2 className="text-base font-bold text-gray-800 mb-3">Compétitions en cours</h2>
          <div className="flex flex-wrap gap-3">
            {team.runningCompetitions.map((comp: { id: number; name: string; emblem: string }) => (
              <div key={comp.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                {comp.emblem && <Image src={comp.emblem} alt={comp.name} width={16} height={16} className="object-contain" />}
                <span className="text-sm text-gray-700">{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Derniers matchs */}
      {matches.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <h2 className="text-base font-bold text-gray-800 px-5 py-4 border-b border-gray-100">
            Derniers matchs
          </h2>
          <div className="divide-y divide-gray-50">
            {matches.map((match) => {
              const h = match.score.fullTime.home
              const a = match.score.fullTime.away
              return (
                <div key={match.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="shrink-0 w-28">
                    <div className="flex items-center gap-1 mb-0.5">
                      {match.competition.emblem && (
                        <Image src={match.competition.emblem} alt={match.competition.name} width={12} height={12} className="object-contain opacity-50" />
                      )}
                      <p className="text-xs text-gray-400 truncate">{match.competition.name}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(match.utcDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                    <span className="text-xs font-medium text-gray-700 truncate">{match.homeTeam.shortName}</span>
                    <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={18} height={18} className="object-contain shrink-0" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0 w-12 text-center">{h} - {a}</span>
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
    </div>
  )
}
