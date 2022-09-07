import {
  DocumentsPaneInitialValueTemplate,
  DocumentsPaneInitialValueTemplateResolver,
  DocumentVersionsCollection,
} from './types'

interface ResolveInitialValueTemplatesOptions {
  resolver: DocumentsPaneInitialValueTemplateResolver | undefined
  document: DocumentVersionsCollection
}

export default function resolveInitialValueTemplates(
  options: ResolveInitialValueTemplatesOptions
): DocumentsPaneInitialValueTemplate[] {
  const {resolver, document} = options || {}

  if (!resolver) return []

  return resolver({document})
}
