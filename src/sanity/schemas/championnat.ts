import { defineField, defineType } from 'sanity'

export const championnat = defineType({
  name: 'championnat',
  title: 'Championnat',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nom' }, validation: (r) => r.required() }),
    defineField({ name: 'pays', title: 'Pays', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'couleur',
      title: 'Couleur',
      type: 'string',
      options: {
        list: [
          { title: 'Bleu (Ligue 1)', value: 'blue' },
          { title: 'Violet (Premier League)', value: 'purple' },
          { title: 'Rouge (LaLiga)', value: 'red' },
          { title: 'Vert (Serie A)', value: 'green' },
          { title: 'Noir (Bundesliga)', value: 'gray' },
        ],
      },
    }),
  ],
})
