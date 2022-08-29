import React from 'react'
import {Stack} from '@sanity/ui'

import Documents from './Documents'
import Feedback from './Feedback'
import Debug from './Debug'
import {DocumentsPaneProps} from './types'
import resolveParams from './resolveParams'
import resolveInitialValueTemplates from './resolveInitialValueTemplates'

export default function DocumentsPane(props: DocumentsPaneProps) {
  const {document, options} = props
  const {
    query,
    params,
    useDraft = false,
    debug = false,
    initialValueTemplates: initialValueTemplatesResolver,
  } = options

  if (useDraft && typeof params === 'function') {
    return (
      <Stack padding={4} space={5}>
        <Feedback>
          <code>useDraft</code> should not be <code>true</code> when supplying a function for
          <code>params</code>
        </Feedback>
        {debug && <Debug query={query} />}
      </Stack>
    )
  }

  const paramValues = resolveParams({document, params, useDraft})

  const initialValueTemplates = resolveInitialValueTemplates({
    resolver: initialValueTemplatesResolver,
    document,
  })

  if (!paramValues) {
    return (
      <Stack padding={4} space={5}>
        <Feedback>
          Parameters for this query could not be resolved. This may mean the document does not yet
          exist or is incomplete.
        </Feedback>
        {debug && <Debug query={query} />}
      </Stack>
    )
  }

  return (
    <Documents
      query={query}
      params={paramValues}
      debug={debug}
      initialValueTemplates={initialValueTemplates}
    />
  )
}
