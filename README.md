ai2react-loader
===============

A simple and _very_ platform-specific Webpack loader that uses
[`ai2react`][ai2react] to load Adobe Illustrator files as React components.

Note: This only works on Mac because of the Illustrator automation. Sorry.

## Installing

Install `ai2react-loader` from NPM using whichever package manager you like.
For instance, yarn:

```
yarn add ai2react-loader
```

or npm:

```
npm install ai2react-loader
```

## Usage

In your JS file, you import an Adobe Illustrator file just like it's a normal
JS module:

**file.js**

```js
import Graphic from './graphic.ai'
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ai$/,
        loader: 'ai2react-loader',
      },
    ],
  },
}
```

And run `webpack` via your preferred method. This will use `ai2react` to
convert the Illustrator file to a React component and will produce a JS module
that requires and exports the created React component. So if you import the
Illustrator as `Graphic` then you can render it in JSX, meaning `file.js` might
look something like this:

```jsx
import React from 'react'
import Graphic from './graphic.ai'

export default function() {
  return (
    <div>
      <h1>A cool graphic made in Adobe Illustrator</h1>
      <Graphic />
    </div>
  )
}
```

### Using props in the generated component

The Adobe Illustrator file is converted to JS using `ai2react`, which strips
out all the text and converts it to HTML overlaid on an image. When the
generated component is rendered, that text is evaluated using string
interpolation where the props of the component are available, so if, in your
Illustrator file, you include an annotation:

> Hello ${props.name}

and you render the resulting component as:

```jsx
<Graphic name='Andrew' />
```

then the rendered HTML will include the annotation:

> Hello Andrew

## Options

### `ai2react`

The loader requires `ai2react` as a peer dependency because the code it
produces depends on the package, and by default it will include the
`ai2react.js` script included with the `ai2react` package. If you would like to
use a custom Illustrator script you can provide the absolute path to it as an
option.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ai$/,
        loader: 'ai2react-loader',
        options: {
          ai2react: '/path/to/custom/ai2react.js',
        },
      },
    ],
  },
}
```

[ai2react]: https://github.com/andmilligan/ai2react
