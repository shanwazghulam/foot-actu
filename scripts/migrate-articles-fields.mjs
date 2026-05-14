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
console.log(`${articles.length} articles trouvés`)

for (const a of articles) {
  const patch = sanity.patch(a._id)
  let needsPatch = false

  // Migrer championnat -> championnats
  if (a.championnat && (!a.championnats || a.championnats.length === 0)) {
    patch.set({ championnats: [{ ...a.championnat, _key: key() }] })
    patch.unset(['championnat'])
    needsPatch = true
    console.log(`  → Migré championnat pour : ${a.titre}`)
  } else if (a.championnat) {
    patch.unset(['championnat'])
    needsPatch = true
    console.log(`  → Supprimé ancien championnat pour : ${a.titre}`)
  }

  // Migrer equipe -> equipes
  if (a.equipe && (!a.equipes || a.equipes.length === 0)) {
    patch.set({ equipes: [{ ...a.equipe, _key: key() }] })
    patch.unset(['equipe'])
    needsPatch = true
    console.log(`  → Migré equipe pour : ${a.titre}`)
  } else if (a.equipe) {
    patch.unset(['equipe'])
    needsPatch = true
    console.log(`  → Supprimé ancien equipe pour : ${a.titre}`)
  }

  if (needsPatch) {
    await patch.commit()
  } else {
    console.log(`  ✓ Déjà à jour : ${a.titre}`)
  }
}

console.log('\nMigration terminée !')
