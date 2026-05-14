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

const sondages = await sanity.fetch(`*[_type == "sondage"]{ _id, question, options }`)
console.log(`${sondages.length} sondages trouvés`)

for (const s of sondages) {
  const needsFix = s.options?.some(o => !o._key)
  if (!needsFix) { console.log(`  ✓ OK: ${s.question}`); continue }

  const fixed = s.options.map(o => ({ ...o, _key: o._key || key() }))
  await sanity.patch(s._id).set({ options: fixed }).commit()
  console.log(`  ✓ Corrigé: ${s.question}`)
}

console.log('\nDone !')
