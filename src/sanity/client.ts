import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityConfig } from './config'

export const client = createClient(sanityConfig)

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)
