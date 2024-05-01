import React from 'react'
import {ListenQueryOptions} from 'sanity'
import {UserViewComponent} from 'sanity/structure'

export type DocumentVersionsCollection = React.ComponentProps<UserViewComponent>['document']

// eslint-disable-next-line prettier/prettier
export type DocumentsPaneQueryParams = (params: {
  document: DocumentVersionsCollection
}) => {[key: string]: string} | {[key: string]: string}

export interface DocumentsPaneInitialValueTemplate {
  schemaType: string
  template?: string
  parameters?: {[key: string]: any}
  title: string
}

// eslint-disable-next-line prettier/prettier
export type DocumentsPaneInitialValueTemplateResolver = (params: {
  document: DocumentVersionsCollection
}) => DocumentsPaneInitialValueTemplate[]

export type DocumentsPaneOptions = {
  query: string
  params?: DocumentsPaneQueryParams
  debug?: boolean
  useDraft?: boolean
  initialValueTemplates?: DocumentsPaneInitialValueTemplateResolver
  options?: ListenQueryOptions
  duplicate?: boolean
}

export type DocumentsPaneProps = React.ComponentProps<UserViewComponent<DocumentsPaneOptions>>
