# sanity-plugin-documents-pane

Display a GROQ-queried list of Documents in a View Pane.

![Incoming References](https://user-images.githubusercontent.com/209129/108927411-21aa7f00-7638-11eb-9cf7-334598ac4103.png)


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
    params: { id: `_id` },
    useDraft: false
  })
  .title('Incoming References')
```

The `.options()` configuration works as follows:

- `query` (string, required) 
- `params` (object, optional) A [dot-notated string](https://www.npmjs.com/package/dlv) from the document object to a field, to use as variables in the query. 
- `useDraft` (bool, optional, default: `false`) When populating the `params` values, it will use the `published` version of the document by default. 

## License

MIT © Simeon Griggs
See LICENSE