The templating context contains the following variables which can be used for the generation of the index page.

## items
Type: `Array`

An array containing all items available for this particular index page.

## index
Type: `Object`

An object describing the state of the index page as the following code excerpt shows:

```js
{
  pageIsEmpty: false,
  pageIsFirst: true,
  pageIsLast: false,
  pageFirst: { /*...*/ },
  pagePrev: { /*...*/ },
  pageNext: { /*...*/ },
  pageLast: { /*...*/ },
  pages: { /*...*/ }
}
```

### pageIsEmpty
Type: `Boolean`

Whether the current index page has no items.

### pageIsFirst
Type: `Boolean`

Whether the current index page is the first index page of a collection of index pages.

### pageIsLast
Type: `Boolean`

Whether the current index page is the last index page of a collection of index pages.

### pageFirst
Type: `Object`

Object of the first index page in a collection of index pages.

### pagePrev
Type: `Object`

Object of the previous index page in a collection of index pages.

### pageNext
Type: `Object`

Object of the next index page in a collection of index pages.

### pageLast
Type: `Object`

Object of the last index page in a collection of index pages.

### pages
Type: `Array`

An array of objects of all index pages.
