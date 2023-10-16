import React, {useCallback} from 'react'
import {Box, Button, Stack, Flex, Spinner, Card} from '@sanity/ui'
import {fromString as pathFromString} from '@sanity/util/paths'
import {Preview, useSchema, DefaultPreview, SanityDocument} from 'sanity'
import {usePaneRouter} from 'sanity/desk'
import {WarningOutlineIcon} from '@sanity/icons'
import {Feedback, useListeningQuery} from 'sanity-plugin-utils'

import Debug from './Debug'
import {DocumentsPaneInitialValueTemplate} from './types'
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
  const schema = useSchema()

  const {loading, error, data} = useListeningQuery<SanityDocument[]>(query, {
    params,
    initialValue: [],
  })

  const handleClick = useCallback(
    (id: string, type: string) => {
      const childParams = routerPanesState[groupIndex + 1]?.[0].params || {}
      const {parentRefPath} = childParams

      handleEditReference({
        id,
        type,
        // Uncertain that this works as intended
        parentRefPath: parentRefPath ? pathFromString(parentRefPath) : [``],
        template: {id},
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
      <>
        <NewDocument initialValueTemplates={initialValueTemplates} />
        <Stack padding={4} space={5}>
          <Feedback>No Documents found</Feedback>
          {debug && <Debug query={query} params={params} />}
        </Stack>
      </>
    )
  }

  return (
    <>
      <NewDocument initialValueTemplates={initialValueTemplates} />
      <Stack padding={2} space={1}>
        {data.map((doc) => {
          const schemaType = schema.get(doc._type)

          return schemaType ? (
            <Button
              key={doc._id}
              onClick={() => handleClick(doc._id, doc._type)}
              padding={2}
              mode="bleed"
            >
              <Preview value={doc} schemaType={schemaType} />
            </Button>
          ) : (
            <Card radius={2} tone="caution" data-ui="Alert" padding={2} key={doc._id}>
              <DefaultPreview
                media={<WarningOutlineIcon />}
                title="Unknown schema type found"
                subtitle={`Encountered type "${doc._type}" that is not defined in the schema.`}
              />
            </Card>
          )
        })}
      </Stack>
    </>
  )
}
