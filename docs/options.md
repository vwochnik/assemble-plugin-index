## limit
Type: `Number`
Default: `10`

Maximum collection items per index page.

## pattern
Type: `String`
Default: Template name with attached page number

File naming pattern with attached page number and without file extension.
By default, files are named by the index template's name plus an additional page number for successive pages.

The string `:num:` is replaced with the page number or removed for
the first page.

## filter
Type: `String`, `Array`, `Function`
Default: `undefined`

The default filter takes only the `data` object of each template in the pipeline excluding `src` and `dest` properties. If these properties are needed, they need to be explicitly specified.

When a string is given, only one property named by the specified string within the `data` object will be filtered.

When an array is given, all properties specified in the array within the `data` object will be filtered.

When a function is given, the function will be called with a `file` argument representing the currently processing `vinyl` file. The function must immediately return the filtered result.
