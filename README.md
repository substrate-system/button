# button
![tests](https://github.com/substrate-system/button/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/button?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/button?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/button)
[![GZip size](https://img.badgesize.io/https%3A%2F%2Fesm.sh%2F%40substrate-system%2Fbutton%2Fes2022%2Fbutton.mjs?compression=gzip&style=flat-square)](https://esm.sh/@substrate-system/button/es2022/button.mjs)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Polyform_Small_Business-249fbc?style=flat-square)](LICENSE)


A button web component, with a visual "loading" state.

[See a live demo](https://substrate-system.github.io/button/)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [Dependencies](#dependencies)
- [API](#api)
  * [ESM](#esm)
  * [Common JS](#common-js)
- [CSS](#css)
  * [Import CSS](#import-css)
  * [Customize CSS via some variables](#customize-css-via-some-variables)
- [Use](#use)
  * [HTML](#html)
  * [pre-built](#pre-built)

<!-- tocstop -->

</details>


## Install

```sh
npm i -S @substrate-system/button
```

## Dependencies

Depends on these CSS variables, which are exposed in the
[@substrate-system/css](https://github.com/substrate-system/css) package.

```css
:root {
  --substrate-medium: #999da0;
  --substrate-button-text: #36393d;
  --substrate-primary: #36393d;
  --substrate-font: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  --substrate-button-background: #f5f5f5;
  --substrate-button-shadow: #00000054;
  --substrate-button-background-focus: #ededed;
  --substrate-button-background-hover: #e6e6e6;
}
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import { SubstrateButton } from '@substrate-system/button'
```

### Common JS
```js
const { SubstrateButton } = require('@substrate-system/button')
```

## CSS

### Bundler

Import CSS with a bundler, like [esbuild](https://esbuild.github.io/content-types/#css).

```js
import '@substrate-system/button/css'
```

Or minified:
```js
import '@substrate-system/button/css/min'
```

### CSS import

Or use CSS imports:

```css
@import url("../node_modules/@substrate-system/button/dist/index.min.css");
```

## Use

You will need to set a name for this custom element with the static method
`define`. To use the default name, `substrate-button`, just import and
call `.define()`.

> [!CAUTION]  
> If you change the name of the web component, it will break the CSS.


To use the default, call
`.define()`:

```js
import { SubstrateButton } from '@substrate-system/button'

// create a web component named `substrate-button`
SubstrateButton.define()
```

Or override the `tag` property to change the tag name:
```js
import { SubstrateButton } from '@substrate-system/button'

// set a custom name
SubstrateButton.tag = 'cool-button'

SubstrateButton.define()
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
