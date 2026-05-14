import { createClient } from 'next-sanity'
import { randomBytes } from 'crypto'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const key = () => randomBytes(6).toString('hex')

const articles = await sanity.fetch(`*[_type == "article"]{ _id, titre, championnat, equipe, championnats, equipes }`)
console.log(`${articles.length} articles trouvés\n`)

for (const a of articles) {
  const sets = {}
  const unsets = []

  if (a.championnat) {
    unsets.push('championnat')
    if (!a.championnats || a.championnats.length === 0) {
      sets.championnats = [{ ...a.championnat, _key: key() }]
    }
    console.log(`  Nettoyé championnat → ${a.titre}`)
  }

  if (a.equipe) {
    unsets.push('equipe')
    if (!a.equipes || a.equipes.length === 0) {
      sets.equipes = [{ ...a.equipe, _key: key() }]
    }
    console.log(`  Nettoyé equipe → ${a.titre}`)
  }

  if (unsets.length > 0) {
    let patch = sanity.patch(a._id)
    if (Object.keys(sets).length > 0) patch = patch.set(sets)
    patch = patch.unset(unsets)
    await patch.commit()
  } else {
    console.log(`  ✓ Propre : ${a.titre}`)
  }
}

console.log('\nFini !')
