import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityConfig } from './config'

export const client = createClient(sanityConfig)

const builder = createImageUrlBuilder(sanityConfig)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source)
