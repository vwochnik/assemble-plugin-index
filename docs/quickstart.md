In the command line, run:

```bash
npm install --save-dev {%= name %}
```

Next, in your `assemblefile.js`, insert the following line immediately after you have `require()`d `assemble`:

```js
var index = require('assemble-plugin-index')(assemble);
```

Upon initialization, the module creates a new renderable `index` collection within `assemble`. Before using the plugin, you have to specify a location where `index` collections can be found:

```js
assemble.indices('templates/indices/*.hbs');
```

You can now use the plugin within a task like so:

```js
assemble.task('posts', function() {
  assemble.src('templates/posts/*.hbs')
    .pipe(index('posts', {limit: 10}))
    .pipe(assemble.dest('dist/'));
});
```

You can also specify options for the module to be used with successive calls:

```js
assemble.option('index', {limit: 10});
```

Visit the [plugin docs](http://assemble.io/plugins/) for more info or for help getting started.
