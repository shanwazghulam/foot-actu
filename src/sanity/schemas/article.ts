import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titre' }, validation: (r) => r.required() }),
    defineField({
      name: 'championnats',
      title: 'Championnats',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'championnat' }] }],
      validation: (r) => r.min(1).required(),
    }),
    defineField({
      name: 'equipes',
      title: 'Équipes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'equipe' }] }],
    }),
    defineField({ name: 'image', title: 'Image principale', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'resume', title: 'Résumé', type: 'text', rows: 3 }),
    defineField({ name: 'contenu', title: 'Contenu', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'publishedAt', title: 'Date de publication', type: 'datetime' }),
    defineField({ name: 'auteur', title: 'Auteur', type: 'string' }),
  ],
  preview: {
    select: { title: 'titre', subtitle: 'championnat.nom', media: 'image' },
  },
})
