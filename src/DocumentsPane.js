import React from 'react'
import PropTypes from 'prop-types'
import delve from 'dlv'
import {IntentLink} from 'part:@sanity/base/router'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'

import {useDocuments} from './lib/hooks'
import styles from './DocumentsPane.module.css'

const DocumentsPane = ({document: sanityDocument, options}) => {
  const {query, params, useDraft} = options
  const doc = useDraft ? sanityDocument.displayed : sanityDocument.published

  const paramValues = Object.keys(params).reduce(
    (acc, key) => ({...acc, [key]: delve(doc, params[key])}),
    {}
  )

  const documents = useDocuments(query, paramValues)

  return (
    <div className={styles.root}>
      {documents.length > 0 ? (
        documents.map((doc) => (
          <IntentLink
            key={doc._id}
            className={styles.item}
            intent="edit"
            params={{id: doc._id, type: doc._type}}
          >
            <Preview value={doc} type={schema.get(doc._type)} />
          </IntentLink>
        ))
      ) : (
        <div className={styles.noDocs}>
          No Documents match this query: <code>{query}</code>
        </div>
      )}
    </div>
  )
}

DocumentsPane.propTypes = {
  options: PropTypes.shape({
    params: PropTypes.string,
    query: PropTypes.object,
    useDraft: PropTypes.bool,
  }),
}

DocumentsPane.defaultProps = {
  options: {
    params: {},
    query: ``,
    useDraft: false,
  },
}

export default DocumentsPane
