In the command line, run:

```bash
npm install --save-dev {%= name %}
```

Next, to register the plugin with Assemble in your project's `Gruntfile.js`, you can either specify the direct path to the plugin(s) (e.g. `./path/to/plugins/*.js`), or if installed via NPM, make sure the plugin is in the `devDependencies` of your `package.json`, and simply add the module's name to the `plugins` option:

```js
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    assemble: {
      options: {
        plugins: ['{%= name %}', 'other/plugins/*.js'],
        collections: [{
          name: 'pages',
          index: {
              template: 'index.hbs',
              limit: 5,
              dest: 'dist/',
              prefix: 'index'
          }
        }]
      },
      files: {
        'dist/': ['templates/*.hbs']
      }
    }
  });
  grunt.loadNpmTasks('assemble');
  grunt.registerTask('default', ['assemble']);
};
```
If everything was installed and configured correctly, after running `grunt assemble` you should see a JSON file for each page in the `dest` directory defined in the plugin's options. The basename of each page will be used as the name of each file. Additionally, the plugin creates one or more index pages in the specified directory.

Visit the [plugin docs](http://assemble.io/plugins/) for more info or for help getting started.
