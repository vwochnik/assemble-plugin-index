### The file extensions of the pagination URLs don't match the actual file extension. How do I fix this?
This can be the case if you have configured a third-party plugin such as `gulp-extname` to change file extensions.

**Solution:** Use the `assemble` builtin `{{replace}}` helper to replace file extensions. The following snippet shows a pagination with `.html` extensions:

```html
{{#with pagination}}
  <ul>
    {{#if isFirst}}
      <li><a>Prev</a></li>
    {{else}}
      <li><a href="{{replace prev '.hbs' '.html'}}">Prev</a></li>
    {{/if}}
    {{#each pages}}
      {{#is this ../current}}
        <li><a>{{@index}}</a></li>
      {{else}}
        <li><a href="{{replace this '.hbs' '.html'}}">{{@index}}</a></li>
      {{/is}}
    {{/each}}
    {{#if isLast}}
      <li><a>Next</a></li>
    {{else}}
      <li><a href="{{replace last '.hbs' '.html'}}">Next</a></li>
    {{/if}}
  </ul>
{{/with}}
```

### How do I sort items in the collection?
This is exactly what the `postprocess` option is made for! Let's assume that you have a collection of blog posts that need to be sorted by their `posted` property. When using a filter, do not forget to include the `posted` property as well!

```js
assemble.task('posts', function() {
  assemble.src('templates/posts/*.hbs')
    .pipe(index('posts', {
      pattern: 'index:num:',
      filter: ['title', 'posted', 'summary']
      limit: 10,
      postprocess: function(items, cb) {
        cb(items.sort(function(item1, item2) {
          return item2.posted - item1.posted;
        }));
      }
    }))
    .pipe(assemble.dest('dist/'));
});
```
