import {SanityDocument} from '@sanity/client'

export interface DocumentVersionsCollection {
  displayed: SanityDocument
  published: SanityDocument
  draft: SanityDocument
  historical: SanityDocument
}

// eslint-disable-next-line prettier/prettier
export type DocumentsPaneQueryParams = (params: {document: DocumentVersionsCollection}) => ({[key: string]: string} | null) | {[key: string]: string}

export interface DocumentsPaneInitialValueTemplate {
  schemaType: string
  template?: string
  parameters?: {[key: string]: any}
  title: string
}

// eslint-disable-next-line prettier/prettier
export type DocumentsPaneInitialValueTemplateResolver = (params: {document: DocumentVersionsCollection}) => DocumentsPaneInitialValueTemplate[]

export type DocumentsPaneOptions = {
  query: string
  params?: DocumentsPaneQueryParams
  debug?: boolean
  useDraft?: boolean
  initialValueTemplates?: DocumentsPaneInitialValueTemplateResolver
}

export type DocumentsPaneProps = {
  document: DocumentVersionsCollection
  options: DocumentsPaneOptions
}
