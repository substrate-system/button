# package name here
![tests](https://github.com/substrate/button/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/button?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://packagephobia.com/badge?p=@substrate-system/button)](https://packagephobia.com/result?p=@substrate-system/button)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/button)](https://packagephobia.com/result?p=@substrate-system/button)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

`<package description goes here>`

[See a live demo](https://substrate.github.io/button/)

<!-- toc -->

## install

Installation instructions

```sh
npm i -S @substrate-system/button
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import '@substrate-system/button'
```

### Common JS
```js
require('@substrate-system/button')
```

## CSS

### Import CSS

```js
import '@substrate-system/button/css'
```

Or minified:
```js
import '@substrate-system/button/css/min'
```

### Customize CSS via some variables

```css
substrate-button {
    --example: pink;
}
```

## use
This calls the global function `customElements.define`. Just import, then use
the tag in your HTML.

### JS
```js
import '@substrate-system/button'
```

### HTML
```html
<div>
    <substrate-button></substrate-button>
</div>
```

### pre-built
This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/button/dist/index.min.js ./public/substrate-button.min.js
cp ./node_modules/@substrate-system/button/dist/style.min.css ./public/substrate-button.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./substrate-button.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./substrate-button.min.js"></script>
</body>
```
