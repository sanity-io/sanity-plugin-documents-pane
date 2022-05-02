import React, {useCallback} from 'react'
import {useQuery} from 'react-query'
import {Box, Button, Stack, Flex, Spinner} from '@sanity/ui'
import {usePaneRouter} from '@sanity/desk-tool'
import {fromString as pathFromString} from '@sanity/util/paths'
// import {RouterContext} from '@sanity/state-router/lib/RouterContext'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import sanityClient from 'part:@sanity/base/client'

import Debug from './Debug'
import Feedback from './Feedback'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export default function Documents(props) {
  const {query, params, debug} = props

  const {isLoading, error, data} = useQuery(['useDocuments', {props}], () =>
    client.fetch(query, params)
  )

  const {routerPanesState, groupIndex, handleEditReference} = usePaneRouter()
  const childParams = routerPanesState[groupIndex + 1]?.[0].params || {}
  const {parentRefPath} = childParams

  const handleClick = useCallback((id, type) => {
    handleEditReference({
      id,
      type,
      // Uncertain that this works as intended
      parentRefPath: parentRefPath ? pathFromString(parentRefPath) : [``],
      // Added this to satisfy TS
      template: type,
    })
  }, [routerPanesState])

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
    <Stack padding={2} space={1}>
      {data.map((doc) => (
        <Button onClick={() => handleClick(doc._id, doc._type)} padding={2} mode="bleed">
          <Preview value={doc} type={schema.get(doc._type)} />
        </Button>
      ))}
    </Stack>
  )
}
