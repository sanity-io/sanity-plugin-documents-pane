import React from 'react'
import PropTypes from 'prop-types'
import delve from 'dlv'
import {studioTheme, ThemeProvider} from '@sanity/ui'
import {QueryClient, QueryClientProvider} from 'react-query'

import Documents from './Documents'

const queryClient = new QueryClient()

export default function DocumentsPane({document: sanityDocument, options}) {
  const {query, params, useDraft, debug} = options
  const doc = useDraft ? sanityDocument.displayed : sanityDocument.published
  const {_rev} = doc

  const paramValues = Object.keys(params).reduce(
    (acc, key) => ({...acc, [key]: delve(doc, params[key])}),
    {}
  )

  return (
    <ThemeProvider theme={studioTheme}>
      <QueryClientProvider client={queryClient}>
        <Documents _rev={_rev} query={query} params={paramValues} debug={debug} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

DocumentsPane.propTypes = {
  options: PropTypes.shape({
    params: PropTypes.object,
    query: PropTypes.string,
    useDraft: PropTypes.bool,
    debug: PropTypes.bool,
  }),
}

DocumentsPane.defaultProps = {
  options: {
    params: {},
    query: ``,
    useDraft: false,
    debug: false,
  },
}
