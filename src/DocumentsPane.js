import React from 'react'
import PropTypes from 'prop-types'

const DocumentsPane = ({options}) => {
  const {query, params} = options
  return <div>This is a {props.thing}!</div>
}

DocumentsPane.propTypes = {
  options: PropTypes.shape({
    params: PropTypes.string,
    query: PropTypes.string
  }),
}

DocumentsPane.defaultProps = {
  options: {
    params: {},
    query: ``,
  },
}

export default DocumentsPane