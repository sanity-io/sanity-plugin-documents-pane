import {Button, Card, Flex} from '@sanity/ui'
import React from 'react'
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
  const {ReferenceChildLink} = usePaneRouter()

  if (!initialValueTemplates.length) return null

  return (
    <Card borderBottom={true} padding={2}>
      <Flex justify="flex-end" gap={1}>
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
              <Button icon={<ComposeIcon />} text={template.title} mode="bleed" as="span" />
            </ReferenceChildLink>
          )
        })}
      </Flex>
    </Card>
  )
}
