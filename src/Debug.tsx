import React from 'react'
import {Code, Box, Label, Stack} from '@sanity/ui'

export default function Debug({query, params}: {query: string; params?: {[key: string]: string}}) {
  return (
    <>
      <Stack space={4}>
        <Box>
          <Label>Query</Label>
        </Box>
        <Box>
          <Code>{query}</Code>
        </Box>
      </Stack>
      {params && (
        <Stack space={4}>
          <Box>
            <Label>Params</Label>
          </Box>
          <Box>
            <Code>{JSON.stringify(params)}</Code>
          </Box>
        </Stack>
      )}
    </>
  )
}
