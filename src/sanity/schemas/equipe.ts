import { defineField, defineType } from 'sanity'

export const equipe = defineType({
  name: 'equipe',
  title: 'Équipe',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nom' }, validation: (r) => r.required() }),
    defineField({ name: 'pays', title: 'Pays', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo URL', type: 'url' }),
    defineField({
      name: 'championnat',
      title: 'Championnat',
      type: 'reference',
      to: [{ type: 'championnat' }],
    }),
    defineField({ name: 'fdoId', title: 'ID football-data.org', type: 'number' }),
  ],
})
