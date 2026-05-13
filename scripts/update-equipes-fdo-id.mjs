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
  { code: 'FL1' },
  { code: 'PL' },
  { code: 'PD' },
  { code: 'SA' },
  { code: 'BL1' },
]

async function fetchTeams(code) {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/teams`, {
    headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
  })
  const data = await res.json()
  return data.teams || []
}

let updated = 0

for (const comp of competitions) {
  const teams = await fetchTeams(comp.code)

  for (const team of teams) {
    const sanityDoc = await sanity.fetch(
      `*[_type == "equipe" && nom == $nom][0]{ _id }`,
      { nom: team.name }
    )
    if (sanityDoc) {
      await sanity.patch(sanityDoc._id).set({ fdoId: team.id }).commit()
      console.log(`✓ ${team.name} → ID ${team.id}`)
      updated++
    }
  }
}

console.log(`\n${updated} équipes mises à jour.`)
