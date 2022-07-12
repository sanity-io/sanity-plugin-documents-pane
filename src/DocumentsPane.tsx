import React from 'react'
import delve from 'dlv'
import {QueryClient, QueryClientProvider} from 'react-query'
import {Stack} from '@sanity/ui'
import {usePaneRouter} from '@sanity/desk-tool'
import {SanityDocument} from '@sanity/client'

import Documents from './Documents'
import Feedback from './Feedback'
import Debug from './Debug'

const queryClient = new QueryClient()

type DocumentsPaneOptions = {
  query: string
  params: {[key: string]: string}
  debug: boolean
  useDraft: boolean
}

type DocumentsPaneProps = {
  document: SanityDocument
  options: DocumentsPaneOptions
}

export default function DocumentsPane(props: DocumentsPaneProps) {
  const {document: sanityDocument, options} = props
  const {query, params, useDraft, debug} = options
  const paneRouter = usePaneRouter()

  const doc = useDraft ? sanityDocument.displayed : sanityDocument.published
  const {_rev} = doc ?? {}

  const paramValues = Object.keys(params).reduce(
    (acc, key) => ({...acc, [key]: delve(doc, params[key])}),
    {}
  )

  if (!_rev) {
    return (
      <Stack padding={4} space={5}>
        <Feedback>Document must be Published to have References</Feedback>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Documents query={query} params={paramValues} debug={debug} paneRouter={paneRouter} />
    </QueryClientProvider>
  )
}
