import React from 'react'
import {Code, Box, Label, Stack} from '@sanity/ui'

export default function Debug({query, params}) {
  return (
    <>
      <Stack space={4}>
        <Box><Label>Query</Label></Box>
        <Box>
          <Code>{query}</Code>
        </Box>
      </Stack>
      <Stack space={4}>
        <Box><Label>Params</Label></Box>
        <Box>
          <Code>{JSON.stringify(params)}</Code>
        </Box>
      </Stack>
    </>
  )
}
