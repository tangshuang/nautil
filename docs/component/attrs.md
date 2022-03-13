# Attrs

There is a `attrs` property on the component instance.

```js
class SomeComponent extends Component {
  render() {
    const { some } = this.attrs
  }
}
```

It is a sub-set of `props`. It is from `props` but not the same. It contains:

```
<Some one={one} $two={two} onSee={onSee} />

+---------------+--------------+
|     props     |     attrs    |
+---------------+--------------+
|               |              |
|      one    ---->    one     |
|               |              |
|     $two    ---->    two     |
|               |              |
|      onSee    |       x      |
|               |              |
+---------------+--------------+
```

In the `Some` component, we can read `this.attrs.one` and `this.attrs.two`, `onSee` and `$two` are invisible. `this.attrs.two` is the real value of `this.props.$two[0]`.

And a `this.$attrs` is availiable, it can be changed to trigger two way binding updator.

```js
class SomeComponent extends Component {
  render() {
    return <button onClick={() => this.$attrs.two ++}>change</button>
  }
}
```

```js
const $two = useState(0)
<SomeComponent $two={$two} />
```

`$attrs` is a Proxy, you can read value from it, however objects are not equal to origin data.
