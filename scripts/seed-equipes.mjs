import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const FOOTBALL_TOKEN = process.env.FOOTBALL_TOKEN

const competitions = [
  { code: 'FL1', slug: 'ligue-1' },
  { code: 'PL',  slug: 'premier-league' },
  { code: 'PD',  slug: 'laliga' },
  { code: 'SA',  slug: 'serie-a' },
  { code: 'BL1', slug: 'bundesliga' },
]

async function fetchTeams(code) {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/teams`, {
    headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
  })
  const data = await res.json()
  return data.teams || []
}

async function getChampionnatId(slug) {
  const result = await sanity.fetch(`*[_type == "championnat" && slug.current == $slug][0]._id`, { slug })
  return result
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

for (const comp of competitions) {
  const championnatId = await getChampionnatId(comp.slug)
  if (!championnatId) {
    console.log(`✗ Championnat "${comp.slug}" non trouvé dans Sanity`)
    continue
  }

  const teams = await fetchTeams(comp.code)
  console.log(`\n${comp.slug} — ${teams.length} équipes`)

  for (const team of teams) {
    const doc = {
      _type: 'equipe',
      nom: team.name,
      slug: { _type: 'slug', current: toSlug(team.name) },
      pays: team.area?.name || '',
      logo: team.crest || '',
      championnat: { _type: 'reference', _ref: championnatId },
    }
    await sanity.create(doc)
    console.log(`  ✓ ${team.name}`)
  }
}
