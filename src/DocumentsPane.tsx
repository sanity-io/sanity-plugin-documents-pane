import React from 'react'
import delve from 'dlv'
import {QueryClient, QueryClientProvider} from 'react-query'

import Documents from './Documents'

const queryClient = new QueryClient()

export default function DocumentsPane({document: sanityDocument, options}) {
  const {query, params, useDraft, debug} = options

  const doc = useDraft ? sanityDocument.displayed : sanityDocument.published
  const {_id, _rev} = doc ?? {}

  const paramValues = Object.keys(params).reduce(
    (acc, key) => ({...acc, [key]: delve(doc, params[key])}),
    {}
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Documents _rev={_rev} query={query} params={paramValues} debug={debug} />
    </QueryClientProvider>
  )
}
