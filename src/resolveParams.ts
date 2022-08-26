import {DocumentsPaneQueryParams, DocumentVersionsCollection} from './types'
import delve from 'dlv'

interface ResolveParamsOptions {
  params?: DocumentsPaneQueryParams
  document: DocumentVersionsCollection
  useDraft: boolean
}

type ResolveParamsReturn = null | {[key: string]: string}

export default function resolveParams(options: ResolveParamsOptions): ResolveParamsReturn {
  const {params, document, useDraft} = options

  if (typeof params == 'function') {
    return params({document})
  }

  // legacy useDraft behaviour
  const doc = useDraft ? document.displayed : document.published
  const {_rev} = doc ?? {}

  // return null so that we can show the warning when the document hasn't been published yet
  // NB - not sure this works as intended, since drafts will have a _rev after the first mutation
  if (!_rev) return null

  // params is optional
  if (!params) return {}

  return Object.keys(params).reduce((acc, key) => ({...acc, [key]: delve(doc, params[key])}), {})
}
