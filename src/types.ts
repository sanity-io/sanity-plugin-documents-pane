import {SanityDocument} from '@sanity/client'

export interface DocumentVersionsCollection {
  displayed: SanityDocument
  published: SanityDocument
  draft: SanityDocument
  historical: SanityDocument
}

// eslint-disable-next-line prettier/prettier
export type DocumentsPaneQueryParams = (params: {document: DocumentVersionsCollection}) => ({[key: string]: string} | null) | {[key: string]: string}

export type DocumentsPaneOptions = {
  query: string
  params: DocumentsPaneQueryParams
  debug: boolean
  useDraft: boolean
}

export type DocumentsPaneProps = {
  document: DocumentVersionsCollection
  options: DocumentsPaneOptions
}
