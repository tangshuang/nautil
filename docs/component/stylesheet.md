# Stylesheet

In nautil.js, we praise css module, which is easy to implement cross-platform.

```js
import { Component } from 'nautil'
import { Section, Text } from 'nautil/components'
import styles from './my-component.css'

export default class MyComponent extends Component {
  render() {
    return (
      <Section stylesheet={styles.container}>
        <Text stylesheet={[styles.text, 'mui-text', this.className]}>xxx</Text>
        <Text stylesheet={[styles.text, { textAlign: 'right' }, this.style]}>xxx</Text>
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

- import .css directly (CSS Module)
- use a `stylesheet` prop
- mixing style object and className in an array
- this.className
- this.style
- defaultStylesheet

**CSS Module**

In nautil, we praise CSS Module, and recommend to use CSS Module at the first. However, you can close CSS Module in `.env` file.
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

**defaultStylesheet**

Prefix stylesheet for current component before render.
