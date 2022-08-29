import React, {useCallback} from 'react'
import {Box, Button, Stack, Flex, Spinner} from '@sanity/ui'
import {fromString as pathFromString} from '@sanity/util/paths'
import {usePaneRouter} from '@sanity/desk-tool'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'

import Debug from './Debug'
import Feedback from './Feedback'
import useListeningQuery from './hooks/useListeningQuery'
import { DocumentsPaneInitialValueTemplate } from './types'
import NewDocument from './NewDocument'

type DocumentsProps = {
  query: string
  params: {[key: string]: string}
  debug: boolean
  initialValueTemplates: DocumentsPaneInitialValueTemplate[]
}

export default function Documents(props: DocumentsProps) {
  const {query, params, debug, initialValueTemplates} = props
  const {routerPanesState, groupIndex, handleEditReference} = usePaneRouter()

  const {loading, error, data} = useListeningQuery(query, params)

  const handleClick = useCallback(
    (id, type) => {
      const childParams = routerPanesState[groupIndex + 1]?.[0].params || {}
      const {parentRefPath} = childParams

      handleEditReference({
        id,
        type,
        // Uncertain that this works as intended
        parentRefPath: parentRefPath ? pathFromString(parentRefPath) : [``],
        // Added this to satisfy TS
        template: type,
      })
    },
    [routerPanesState, groupIndex, handleEditReference]
  )

  if (loading) {
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
        <NewDocument initialValueTemplates={initialValueTemplates} />
        <Feedback>No Documents found</Feedback>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  return (
    <Stack padding={2} space={1}>
      <NewDocument initialValueTemplates={initialValueTemplates} />
      {data.map((doc) => (
        <Button
          key={doc._id}
          onClick={() => handleClick(doc._id, doc._type)}
          padding={2}
          mode="bleed"
        >
          <Preview value={doc} type={schema.get(doc._type)} />
        </Button>
      ))}
    </Stack>
  )
}
