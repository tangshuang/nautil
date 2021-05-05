# Stylesheet

In nautil.js, we praise css module, which is easy to implement cross-platform.

```js
import { Section, Text, Component } from 'nautil'
import Styles from './my-component.css'

export default class MyComponent extends Component {
  render() {
    return (
      <Section stylesheet={Styles.container}>
        <Text stylesheet={[Styles.text, 'mui-text', this.className]}>xxx</Text>
        <Text stylesheet={[Styles.text, { textAlign: 'right' }, this.style]}>xxx</Text>
      </Section>
    )
  }
  static defaultStylesheet = [
    'some-classname',
    { color: 'red' },
  ]
}
```

Read the previous code, you can understand it very easily. You will notice points:

- import .css as CSS Module
- use a `stylesheet` prop
- mixing style object and className in an array
- this.className
- this.style
- this.css
- static defaultStylesheet
- static css

**CSS Modules**

In nautil, we praise CSS Module, and recommend to use CSS Module at the first.
It is not recommended to use style object in react. So use styles in css file.

**stylesheet**

A Nautil Class Component can receive a stylesheet prop. The value will be parse automaticly, it can receive all kinds of style expression in web.

- string: as className
- object:
  - boolean: as className
  - normal: as style rules
- array: mixing

When you pass an object, it dependents on the value of each property. When the value is a boolean, it means you want to toggle this className.

```js
<A stylesheet={{ 'some-classname': !!show, color: '#999000' }} />
```

**this.className**

Get current component's `styesheet` parsed classNames to be a string.

**this.style**

Get current component's `stylesheet` parsed style object.

**static defaultStylesheet**

Prefix stylesheet for current component before render.

**static css & this.css**

A component has this.css inside which is generated based on `static css`.

```js
class MyComponent extends Component {
  static css = {
    a: '__a',
    b: '__b',
    c: { width: 100, height: 90 },
  }

  render() {
    return (
      <Section stylesheet={[this.css.a, this.css.b, this.css.c]}>
        ...
      </Section>
    )
  }
}
```

To generate this.css dynamicly, you can pass `css` as a function:

```js
class MyComponent extends Component {
  static css = ({ attrs, style, className }) => ({
    a: attrs.a ? '__a' : undefined,
    b: '__b',
    c: { width: 100, height: 90 },
  })
}
```

`css` is always used with CSS Modules together:

```js
import SomeCss from 'some.css'

class MyComponent extends Component {
  static css = SomeCss
}
```

This help us to generate cross-platform styles by only one css file.
