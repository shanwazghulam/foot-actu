import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const championnats = [
  { nom: 'Ligue 1', slug: 'ligue-1', pays: 'France', couleur: 'blue' },
  { nom: 'Premier League', slug: 'premier-league', pays: 'Angleterre', couleur: 'purple' },
  { nom: 'LaLiga', slug: 'laliga', pays: 'Espagne', couleur: 'red' },
  { nom: 'Serie A', slug: 'serie-a', pays: 'Italie', couleur: 'green' },
  { nom: 'Bundesliga', slug: 'bundesliga', pays: 'Allemagne', couleur: 'gray' },
]

for (const c of championnats) {
  const doc = {
    _type: 'championnat',
    nom: c.nom,
    slug: { _type: 'slug', current: c.slug },
    pays: c.pays,
    couleur: c.couleur,
  }
  const result = await client.create(doc)
  console.log(`✓ ${c.nom} créé (${result._id})`)
}
