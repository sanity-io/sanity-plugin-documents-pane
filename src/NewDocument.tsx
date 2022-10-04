import {Button, Card, Flex} from '@sanity/ui'
import React from 'react'
import {DocumentsPaneInitialValueTemplate} from './types'
import {ComposeIcon} from '@sanity/icons'
import {usePaneRouter} from 'sanity/desk'
import {uuid} from '@sanity/uuid'

interface NewDocumentProps {
  initialValueTemplates: DocumentsPaneInitialValueTemplate[]
}

export default function NewDocument(props: NewDocumentProps) {
  const {initialValueTemplates = []} = props
  const {ReferenceChildLink} = usePaneRouter()

  if (!initialValueTemplates.length) return null

  return (
    <Card borderBottom={true} padding={2}>
      <Flex justify="flex-end" gap={1}>
        {initialValueTemplates.map((template) => {
          if (!template.template) {
            return null
          }
          return (
            <ReferenceChildLink
              documentId={uuid()}
              documentType={template.schemaType}
              template={{id: template.template, params: template.parameters}}
              parentRefPath={[]}
              key={`${template.schemaType}-${template.template}`}
            >
              <Button icon={<ComposeIcon />} text={template.title} mode="bleed" as="span" />
            </ReferenceChildLink>
          )
        })}
      </Flex>
    </Card>
  )
}
