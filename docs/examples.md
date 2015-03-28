When used with the configuration shown above, an index template might look as follows:

```html
<h1>Index</h1>
{{#if index.pageIsEmpty}}
  <p>Oops, nothing there yet!</p>
{{else}}
  <ul>
    {{#each items}}
        <li><a href="{{relative ../../page.dest this.dest}}">
          {{ data.title }}
        </a></li>
    {{/each}}
  </ul>
  <ul>
    {{#if index.pageIsFirst}}
      <li><a href="#">Prev</a></li>
    {{else}}
      <li><a href="{{relative ../page.dest index.pagePrev.page.dest}}">Prev</a></li>
    {{/if}}
    {{#each index.pages}}
      <li><a href="{{relative ../page.dest this.page.dest}}">{{indexPage}}</a></li>
    {{/each}}
    {{#if index.pageIsLast}}
      <li><a href="#">Next</a></li>
    {{else}}
      <li><a href="{{relative ../page.dest index.pageNext.page.dest}}">Next</a></li>
    {{/if}}
  </ul>
{{/if}}
```
