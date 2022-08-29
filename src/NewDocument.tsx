import {Button, Flex} from '@sanity/ui'
import React, {forwardRef, useCallback} from 'react'
import {DocumentsPaneInitialValueTemplate} from './types'
import {ComposeIcon} from '@sanity/icons'
import {usePaneRouter} from '@sanity/desk-tool'

interface NewDocumentProps {
  initialValueTemplates: DocumentsPaneInitialValueTemplate[]
}

function newId() {
  return Math.random().toString().replace('.', '')
}

export default function NewDocument(props: NewDocumentProps) {
  const {initialValueTemplates = []} = props
  const {ChildLink, ReferenceChildLink, handleEditReference} = usePaneRouter()

  const handleNewDocument = useCallback(
    (template: DocumentsPaneInitialValueTemplate) => {
      handleEditReference({
        parentRefPath: [],
        id: newId(),
        type: template.type,
        template: {
          id: template.template || template.type,
          params: template.params,
        },
      })
    },
    [handleEditReference]
  )

  return (
    <Flex justify="flex-end">
      {initialValueTemplates.map((template) => {
        return (
          <ReferenceChildLink
            documentId={newId()}
            documentType={template.type}
            template={{id: template.template, params: template.params}}
            parentRefPath={[]}
            key={`${template.type}-${template.template}`}
            style={{textDecoration: 'none'}}
          >
            <Button icon={<ComposeIcon />} text={template.title} mode="ghost" as="span" />
          </ReferenceChildLink>
        )
      })}
    </Flex>
  )
}
