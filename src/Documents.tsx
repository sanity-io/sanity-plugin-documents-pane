import React from 'react'
import {useQuery} from 'react-query'
import {Button, Box, Stack, Flex, Spinner} from '@sanity/ui'
import {usePaneRouter} from '@sanity/desk-tool'
import {RouterContext} from '@sanity/state-router/lib/RouterContext'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import sanityClient from 'part:@sanity/base/client'

import Debug from './Debug'
import Feedback from './Feedback'

  const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export default function Documents(props) {
  const {query, params, debug, _rev} = props

  const {isLoading, error, data} = useQuery(['useDocuments', {props}], () =>
    client.fetch(query, params)
  )

  const routerContext = React.useContext(RouterContext)
  const {routerPanesState, groupIndex} = usePaneRouter()

  const openDocumentInSidePane = React.useCallback(
    (id: string, type: string) => {
      const newPane = [
        {
          id: id,
          params: {type},
        },
      ]
      let panes = [routerPanesState[0], routerPanesState[1], newPane]

      const href = routerContext.resolvePathFromState({panes})
      routerContext.navigateUrl(href)
    },
    [routerContext, routerPanesState, groupIndex]
  )

  if (!_rev) {
    return (
      <Stack padding={4} space={5}>
        <Feedback>Document must be Published</Feedback>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  if (isLoading) {
    return (
      <Box padding={4}>
        <Flex justify="center" align="center">
          <Spinner muted />
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Stack padding={4} space={5}>
        <Feedback>There was en error performing this query</Feedback>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  if (!data?.length) {
    return (
      <Stack padding={4} space={5}>
        <Feedback>No Documents found</Feedback>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  return (
    <Stack padding={2} space={2}>
      {data.map((doc) => (
        <Button
          key={doc._id}
          onClick={() => openDocumentInSidePane(doc._id, doc._type)}
          mode="bleed"
          radius={2}
          padding={2}
        >
          <Preview value={doc} type={schema.get(doc._type)} />
        </Button>
      ))}
    </Stack>
  )
}
