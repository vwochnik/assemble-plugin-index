The templating context contains the following variables which can be used for the generation of the index page.

## items
Type: `Array`

An array containing all items available for this particular index page. The contents of each element are extracted from the page's `data` object.

## pagination
Type: `Object`

An object describing the state of the index pagination as the following code excerpt shows:

```js
{
  first: { /*...*/ },
  prev: { /*...*/ },
  next: { /*...*/ },
  last: { /*...*/ },
  pages: { /*...*/ },
  isFirst: true,
  isLast: false
}
```

### first
Type: `String`

Relative path of the first index page in a collection of index pages.

### prev
Type: `String`

Relative path of the previous index page in a collection of index pages.

### next
Type: `String`

Relative path of the next index page in a collection of index pages.

### last
Type: `String`

Relative path of the last index page in a collection of index pages.

### pages
Type: `Array`

An array of strings of relative paths of all index pages.

### isFirst
Type: `Boolean`

Whether the current index page is the first index page of a collection of index pages.

### isLast
Type: `Boolean`

Whether the current index page is the last index page of a collection of index pages.
