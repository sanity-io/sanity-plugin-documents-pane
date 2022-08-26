# sanity-plugin-documents-pane

Displays the results of a GROQ query in a View Pane. With the ability to use field values in the current document as query parameters.

![Incoming References](https://user-images.githubusercontent.com/9684022/121202594-52bc6180-c86d-11eb-897d-f418047b3d22.png)

## Installation

```
sanity install documents-pane
```

This plugin is designed to be used as a [Component inside of a View](https://www.sanity.io/docs/structure-builder-reference#c0c8284844b7).

The example below illustrates using the current Document being used to query for all Documents that reference it.

```js
// ./src/deskStructure.js
import DocumentsPane from 'sanity-plugin-documents-pane'

// ...all other list items

S.view
  .component(DocumentsPane)
  .options({
    query: `*[!(_id in path("drafts.**")) && references($id)]`,
    params: {id: `_id`},
    useDraft: false,
    debug: true,
  })
  .title('Incoming References')
```

The `.options()` configuration works as follows:

- `query` (string, required)
- `params` (object or function, optional) 
  - Object: a [dot-notated string](https://www.npmjs.com/package/dlv) from the document object to a field, to use as variables in the query.
  - Function: a function that receives the various displayed, draft, and published versions of the document, and returns an object of query parameters. Return null if the parameters cannot be resolved.
- `useDraft` (bool, optional, default: `false`) When populating the `params` values, it will use the `published` version of the document by default. Not permitted if using a function for `params` as the function will determine which version of the document to use.
- `debug` (bool, optional, default: `false`) In case of an error or the query returning no documents, setting to `true` will display the query and params that were used.


## Resolving query parameters with a function
This allows us to modify values from the current document, for example to list references to a draft document.
```js
const options = {
  query: `*[!(_id in path("drafts.**")) && references($id)]`,
  params: ({document}) => {
    // references will never point to a draft ID, so extract the regular ID
    const id = document.displayed._id?.replace('drafts.', '')
    // if there's no ID yet, return null as we cannot resolve the parameters and the query will fail
    if (!id) return null
    return {id}
  },
}
```

## Thanks!

This plugin is based on [Incoming References](https://github.com/sanity-io/sanity/tree/victoria/incoming-refs-preview/packages/test-studio/src/previews/incoming-refs) originally written by Victoria Bergquist.

## License

MIT © Simeon Griggs
See LICENSE
