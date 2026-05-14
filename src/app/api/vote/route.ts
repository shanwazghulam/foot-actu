import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  const { sondageId, optionIndex } = await req.json()
  if (!sondageId || optionIndex === undefined) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const doc = await sanity.fetch(`*[_type == "sondage" && _id == $id][0]{ _id, options }`, { id: sondageId })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const options = doc.options ?? []
  if (optionIndex < 0 || optionIndex >= options.length) return NextResponse.json({ error: 'Invalid index' }, { status: 400 })

  const key = options[optionIndex]._key
  await sanity.patch(doc._id).inc({ [`options[_key=="${key}"].votes`]: 1 }).commit()

  const updated = await sanity.fetch(`*[_type == "sondage" && _id == $id][0]{ options }`, { id: sondageId })
  return NextResponse.json({ options: updated.options })
}
