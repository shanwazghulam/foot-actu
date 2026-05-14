import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const FOOTBALL_TOKEN = process.env.FOOTBALL_TOKEN
const competitions = ['PL', 'PD', 'SA', 'BL1']

let total = 0

for (const code of competitions) {
  console.log(`\nFetch ${code}...`)
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/teams`, {
    headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
  })
  const data = await res.json()

  for (const team of data.teams ?? []) {
    const sanityEquipe = await sanity.fetch(
      `*[_type == "equipe" && fdoId == $id][0]{ _id }`,
      { id: team.id }
    )
    if (!sanityEquipe) continue

    for (const joueur of team.squad ?? []) {
      const existing = await sanity.fetch(
        `*[_type == "joueur" && fdoId == $id][0]{ _id }`,
        { id: joueur.id }
      )
      if (existing) continue

      await sanity.create({
        _type: 'joueur',
        nom: joueur.name,
        fdoId: joueur.id,
        position: joueur.position ?? '',
        dateNaissance: joueur.dateOfBirth ?? '',
        nationalite: joueur.nationality ?? '',
        equipe: { _type: 'reference', _ref: sanityEquipe._id },
      })
      total++
    }
    process.stdout.write('.')
  }
}

console.log(`\n\n✓ ${total} joueurs importés.`)
