In your `assemblefile.js`, insert the following line immediately after you have `require()`d `assemble`:

```js
var index = require('assemble-plugin-index')(assemble);
```

It is important that you pass the `assemble` instance variable to the module for initialization.
Upon initialization, the module creates a new renderable `index` collection within `assemble`. Before using the plugin in the task pipeline, you have to specify a location where `index` collections can be found:

```js
assemble.indices('templates/indices/*.hbs');
```

Now, the plugin can be used within the task pipeline. The following example demonstrates the use of the `index` plugin used within a task pipeline:

```js
assemble.task('posts', function() {
  assemble.src('templates/posts/*.hbs')
    .pipe(index('posts', {pattern: 'index:num:', limit: 10}))
    .pipe(assemble.dest('dist/'));
});
```

This will create `dist/index.hbs`, `dist/index1.hbs`, `dist/index2.hbs` and so forth.

You can also specify options globally using the `assemble` API:

```js
assemble.option('index', {limit: 10});
```

Visit the [plugin docs](http://assemble.io/plugins/) for more info or for help getting started.
