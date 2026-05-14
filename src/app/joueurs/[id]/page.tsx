import { createClient } from 'next-sanity'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 3600

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

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

const couleurMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-600',
}

function age(dateNaissance: string) {
  if (!dateNaissance) return null
  return Math.floor((Date.now() - new Date(dateNaissance).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

async function fetchPlayer(fdoId: number) {
  const res = await fetch(`https://api.football-data.org/v4/persons/${fdoId}`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fdoId = parseInt(id)
  if (isNaN(fdoId)) notFound()

  const [sanityJoueur, playerDetails] = await Promise.all([
    sanity.fetch(
      `*[_type == "joueur" && fdoId == $id][0] {
        _id, nom, position, nationalite, dateNaissance, fdoId,
        equipe->{ nom, slug, logo, championnat->{ nom, slug, couleur } }
      }`,
      { id: fdoId }
    ),
    fetchPlayer(fdoId),
  ])

  if (!sanityJoueur && !playerDetails) notFound()

  const nom = playerDetails?.name ?? sanityJoueur?.nom
  const position = playerDetails?.position ?? sanityJoueur?.position
  const nationalite = playerDetails?.nationality ?? sanityJoueur?.nationalite
  const dateNaissance = playerDetails?.dateOfBirth ?? sanityJoueur?.dateNaissance
  const numero = playerDetails?.shirtNumber
  const contrat = playerDetails?.currentTeam?.contract
  const equipe = sanityJoueur?.equipe
  const couleur = couleurMap[equipe?.championnat?.couleur] ?? 'bg-gray-100 text-gray-600'
  const a = age(dateNaissance)

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/joueurs" className="text-sm text-gray-500 hover:text-gray-800 transition mb-6 inline-block">
        ← Recherche joueurs
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl shrink-0">
            👤
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900">{nom}</h1>
              {numero && (
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">
                  {numero}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {position && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {posteMap[position] ?? position}
                </span>
              )}
              {equipe?.championnat && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${couleur}`}>
                  {equipe.championnat.nom}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {nationalite && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Nationalité</p>
            <p className="font-bold text-gray-800">{nationalite}</p>
          </div>
        )}
        {dateNaissance && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Âge</p>
            <p className="font-bold text-gray-800">
              {a} ans <span className="text-gray-400 font-normal text-sm">({new Date(dateNaissance).toLocaleDateString('fr-FR')})</span>
            </p>
          </div>
        )}
        {contrat?.start && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Début de contrat</p>
            <p className="font-bold text-gray-800">{contrat.start}</p>
          </div>
        )}
        {contrat?.until && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Fin de contrat</p>
            <p className="font-bold text-gray-800">{contrat.until}</p>
          </div>
        )}
      </div>

      {/* Club */}
      {equipe && (
        <Link
          href={`/equipe/${equipe.slug.current}`}
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-400 hover:shadow-sm transition group"
        >
          {equipe.logo ? (
            <Image src={equipe.logo} alt={equipe.nom} width={48} height={48} className="object-contain shrink-0" />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shrink-0">⚽</div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Club actuel</p>
            <p className="font-bold text-gray-900 group-hover:text-green-600 transition">{equipe.nom}</p>
          </div>
          <span className="ml-auto text-gray-300 group-hover:text-green-400">→</span>
        </Link>
      )}
    </div>
  )
}
