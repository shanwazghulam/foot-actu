import { defineField, defineType } from 'sanity'

export const joueur = defineType({
  name: 'joueur',
  title: 'Joueur',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'fdoId', title: 'ID football-data.org', type: 'number' }),
    defineField({ name: 'position', title: 'Poste', type: 'string' }),
    defineField({ name: 'dateNaissance', title: 'Date de naissance', type: 'string' }),
    defineField({ name: 'nationalite', title: 'Nationalité', type: 'string' }),
    defineField({ name: 'equipe', title: 'Équipe', type: 'reference', to: [{ type: 'equipe' }] }),
  ],
})
