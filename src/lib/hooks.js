import {useEffect, useState} from 'react'
import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export const useDocuments = (query = ``, params = {}) => {
  const [documents, setDocuments] = useState([])

  const fetchDocuments = () => {
    client.fetch(query, params).then((res) => setDocuments(res))
  }

  useEffect(() => {
    if (query) {
      fetchDocuments()
    }

    const subscription = client.observable.listen(query, params).subscribe(() => {
      setTimeout(() => {
        fetchDocuments()
      }, 2500)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return documents || []
}
