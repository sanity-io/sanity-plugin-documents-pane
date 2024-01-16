import {DocumentsPaneQueryParams, DocumentVersionsCollection} from './types'
import delve from 'dlv'

interface ResolveParamsOptions {
  params?: DocumentsPaneQueryParams
  document: DocumentVersionsCollection
  useDraft: boolean
}

type ResolveParamsReturn = undefined | {[key: string]: string}

function defaultResolver(options: ResolveParamsOptions): {
  [key: string]: string | undefined
} {
  const {params, document, useDraft} = options

  // params is optional
  if (!params) {
    return {}
  }

  // legacy useDraft behaviour
  const doc = useDraft ? document.displayed : document.published

  if (!doc) {
    return {}
  }

  return Object.keys(params).reduce(
    (acc, key) => ({
      ...acc,
      [key]: delve(doc, params[key as keyof DocumentsPaneQueryParams]),
    }),
    {}
  )
}

export default function resolveParams(options: ResolveParamsOptions): ResolveParamsReturn {
  const {params, document} = options

  const resolvedParams = typeof params == 'function' ? params({document}) : defaultResolver(options)

  // if any of the parameters are undefined, the query will error
  // so return undefined so the UI can show a more appropriate message
  if (Object.values(resolvedParams).includes(undefined)) return undefined

  // Typescript can't tell that we've guarded against any value being undefined,
  // so forcing the type
  return resolvedParams as {[key: string]: string}
}
