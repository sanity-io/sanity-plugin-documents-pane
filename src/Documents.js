import React from 'react'
import PropTypes from 'prop-types'
import {IntentLink} from 'part:@sanity/base/router'
import schema from 'part:@sanity/base/schema'
import {useQuery} from 'react-query'
import sanityClient from 'part:@sanity/base/client'
import {Text, Box, Stack, Flex, Spinner} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview'

import Debug from './Debug'
import styles from './Documents.module.css'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export default function Documents(props) {
  const {query, params, debug} = props

  const {isLoading, error, data} = useQuery(['useDocuments', { props }], () =>
    client.fetch(query, params)
  )

  if (isLoading) {
    return (
      <Box padding={4}>
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Stack padding={4} space={5}>
        <Box>
          <Text>There was en error performing this query</Text>
        </Box>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  if (!data?.length) {
    return (
      <Stack padding={4} space={5}>
        <Box>
          <Text>No Documents found</Text>
        </Box>
        {debug && <Debug query={query} params={params} />}
      </Stack>
    )
  }

  return (
    <Stack className={styles.root}>
      {data.map((doc) => (
        <IntentLink key={doc._id} intent="edit" params={{id: doc._id, type: doc._type}} className={styles.item}>
          <Preview value={doc} type={schema.get(doc._type)} />
        </IntentLink>
      ))}
    </Stack>
  )
}

Documents.propTypes = {
  _rev: PropTypes.string,
  params: PropTypes.object,
  query: PropTypes.string,
}

Documents.defaultProps = {
  _rev: ``,
  params: {},
  query: ``,
}
