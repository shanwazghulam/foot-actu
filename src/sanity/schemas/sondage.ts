import { defineField, defineType } from 'sanity'

export const sondage = defineType({
  name: 'sondage',
  title: 'Sondage',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'question' }, validation: (r) => r.required() }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
    defineField({ name: 'actif', title: 'Actif', type: 'boolean', initialValue: true }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      validation: (r) => r.min(2).max(6).required(),
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'texte', title: 'Texte', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'votes', title: 'Votes', type: 'number', initialValue: 0 }),
        ],
        preview: { select: { title: 'texte', subtitle: 'votes' } },
      }],
    }),
  ],
  preview: {
    select: { title: 'question' },
  },
})
