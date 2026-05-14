import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import { groq } from 'next-sanity'
import SondageVote from './SondageVote'

export const revalidate = 0

const sondageBySlugQuery = groq`
  *[_type == "sondage" && slug.current == $slug][0] {
    _id, question, emoji, actif,
    options[] { _key, texte, votes }
  }
`

export default async function SondagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sondage = await client.fetch(sondageBySlugQuery, { slug })
  if (!sondage) notFound()
  return <SondageVote sondage={sondage} />
}
