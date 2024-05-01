import {Box, Button, Tooltip, Text} from '@sanity/ui'
import React, {useState, useCallback} from 'react'
import {filter, firstValueFrom} from 'rxjs'
import {CopyIcon} from '@sanity/icons'
import {
  useDocumentOperation,
  useDocumentPairPermissions,
  useDocumentStore,
  useTranslation,
} from 'sanity'
import {usePaneRouter} from 'sanity/structure'
import {uuid} from '@sanity/uuid'
import {fromString as pathFromString} from '@sanity/util/paths'

import {structureLocaleNamespace} from 'sanity/structure'

interface NewDocumentProps {
  id: string
  type: string
}

export default function DuplicateDocument(props: NewDocumentProps) {
  const {id, type} = props

  const documentStore = useDocumentStore()
  const {duplicate} = useDocumentOperation(id, type)
  const {routerPanesState, groupIndex, handleEditReference} = usePaneRouter()
  const [isDuplicating, setDuplicating] = useState(false)
  const [permissions, isPermissionsLoading] = useDocumentPairPermissions({
    id,
    type,
    permission: 'duplicate',
  })

  const {t} = useTranslation(structureLocaleNamespace)

  const handle = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      const dupeId = uuid()

      setDuplicating(true)

      // set up the listener before executing
      const duplicateSuccess = firstValueFrom(
        documentStore.pair
          .operationEvents(id, type)
          .pipe(filter((e) => e.op === 'duplicate' && e.type === 'success'))
      )
      duplicate.execute(dupeId)

      // only navigate to the duplicated document when the operation is successful
      await duplicateSuccess
      setDuplicating(false)

      const childParams = routerPanesState[groupIndex + 1]?.[0].params || {}
      const {parentRefPath} = childParams

      handleEditReference({
        id: dupeId,
        type,
        parentRefPath: parentRefPath ? pathFromString(parentRefPath) : [``],
        template: {id: dupeId},
      })
    },
    [documentStore.pair, duplicate, groupIndex, handleEditReference, id, routerPanesState, type]
  )

  if (isPermissionsLoading || !permissions?.granted) {
    return <></>
  }

  return (
    <Tooltip
      content={
        <Box>
          <Text muted size={1}>
            {t('action.duplicate.label')}
          </Text>
        </Box>
      }
      placement="left"
      portal
    >
      <Button
        onClick={handle}
        padding={2}
        fontSize={1}
        as={Box}
        icon={<CopyIcon />}
        mode="ghost"
        tone="default"
        aria-label={t('action.duplicate.label')}
        style={{cursor: 'pointer'}}
        disabled={isDuplicating || Boolean(duplicate.disabled) || isPermissionsLoading}
      />
    </Tooltip>
  )
}
