import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json([])

  const results = await sanity.fetch(
    `*[_type == "joueur" && nom match $q] | order(nom asc) [0...20] {
      _id, nom, position, nationalite, dateNaissance, fdoId,
      equipe->{ nom, slug, logo, championnat->{ nom, slug, couleur } }
    }`,
    { q: `${q}*` }
  )

  return NextResponse.json(results)
}
