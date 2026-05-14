import { groq } from 'next-sanity'

export const articlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id, titre, slug, resume, publishedAt, image,
    championnat->{ _id, nom, slug, couleur }
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id, titre, slug, resume, publishedAt, image, contenu, auteur,
    championnat->{ _id, nom, slug, couleur }
  }
`

export const articlesByChampionnatQuery = groq`
  *[_type == "article" && championnat->slug.current == $slug] | order(publishedAt desc) {
    _id, titre, slug, resume, publishedAt, image,
    championnat->{ _id, nom, slug, couleur }
  }
`

export const championnatsQuery = groq`
  *[_type == "championnat"] | order(nom asc) {
    _id, nom, slug, pays, couleur
  }
`

export const equipesByChampionnatQuery = groq`
  *[_type == "equipe" && championnat->slug.current == $slug] | order(nom asc) {
    _id, nom, slug, pays, logo
  }
`

export const equipeBySlugQuery = groq`
  *[_type == "equipe" && slug.current == $slug][0] {
    _id, nom, slug, pays, logo, fdoId,
    championnat->{ _id, nom, slug, couleur }
  }
`

export const toutesEquipesQuery = groq`
  *[_type == "equipe"] | order(nom asc) {
    _id, nom, slug, logo,
    championnat->{ slug }
  }
`

export const articlesByEquipeQuery = groq`
  *[_type == "article" && equipe->slug.current == $slug] | order(publishedAt desc) {
    _id, titre, slug, resume, publishedAt, image,
    championnat->{ _id, nom, slug, couleur }
  }
`
