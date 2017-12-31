# Coffee brewing calculator for [Generic Hipster Coffee](ghc.viktor.coreskill.tech)

## First time installation

### Install latest [node.js](https://nodejs.org/)

### Install all packages from `package.json` locally

```shell
npm install
```

## Development

To develop with automatic compilation and browser refreshing run

```shell
npm run watch
```

And see the result on http://localhost:3000/

<!--
## Build

To build everything once (in `/dist/` folder) 

```shell
gulp build
```

## CSS (Sass preprocessor)

`index.css` is compiled from `src/scss/index.scss` by [Sass](http://sass-lang.com/).


## HTML (Twig templates)

HTML is generated from [Twig.js](https://github.com/twigjs/twig.js/) templates (JavaScript impementation of Twig templating language) in `src/templates`.

Start templates that are not pages with `_`. Typically these are templates used for _include_ or _extend_.

Documentation for [Twig](https://twig.symfony.com/doc/2.x/templates.html).

_Warning: [Twig.js doesn't implement 100% of Twig](https://github.com/twigjs/twig.js/wiki/Implementation-Notes)._

There are some data about our coffees to be available in all templates, use `templates/data.json` for that.


## Static files (JavaScript, images, …)

Folders and files from `/src/static/` are just copied directly to `/dist/` folder.
-->

### Libraries

This website is made with [Bootstrap 4 beta](https://getbootstrap.com/).

<!--
Not necessary components are commented out to reduce final 'index.css' file size. 
If you need some other components, go to  `/src/index.scss` or `/src/_custom-bootstrap-variables.scss` and uncomment it.

See `gulpfile.js` for supported browsers.


### Deployment

Upload everything in `/dist/` folder to the server.
If you want to to deploy a new version, please contact me at danko.vktr at gmail.com.

#### Surge.sh

You can use [surge.sh](https://surge.sh) free service for that.

1. Install surge client `npm install --global surge`.
2. Run `surge` manually once in `/dist`: you will create an account with surge.sh.
3. Set your own domain in `gulpfile.js` (replace `https://my-first-website.surge.sh`).
4. From now on run `gulp deploy` whenever you want to publish a new version.
-->
