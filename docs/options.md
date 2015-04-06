## limit
Type: `Number`
Default: `10`

Maximum collection items per index page.

## pattern
Type: `String`, 'Function'
Default: Template name with attached page number

File naming pattern with attached page number and without file extension.
By default, files are named by the index template's name plus an additional page number for successive pages.

The string `:num:` is replaced with the page number or removed for
the first page.

When a function is given, it is called for every page generated and must return a string without file extension. The function is called with the page number, `index`, and an array of `items` that are going to be added to the page.

## filter
Type: `String`, `Array`, `Function`
Default: `undefined`

The default filter takes only the `data` object of each template in the pipeline excluding `src` and `dest` properties. If these properties are needed, they need to be explicitly specified.

When a string is given, only one property named by the specified string within the `data` object will be filtered.

When an array is given, all properties specified in the array within the `data` object will be filtered.

When a function is given, the function will be called with a `file` argument representing the currently processing `vinyl` file. The function must immediately return the filtered result as an `Object` containing filtered properties.

## postprocess
Type: `Function`
Default: `undefined`

A function allowing the manipulation of collected data. The function takes two arguments, the `collection` and a `callback` function. When the postprocessing is finished, the function is expected to call the `callback` function with a collection which can either be the original or a completely new one. In case an error occurs, the function is expected to call the `callback` with `null` as the first argument and the error as the second argument.
