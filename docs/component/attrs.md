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
|      onSee    |       x      |
|               |              |
|   +---------------------+    |
|   |                     |    |
|   |         one         |    |
|   |                     |    |
|   +---------------------+    |
|               |              |
|     $two    ---->    two     |
|               |              |
+---------------+--------------+
```

In the `Some` component, we can read `this.attrs.one` and `this.attrs.two`, `onSee` and `$two` are invisible. `this.attrs.two` is the real value of `this.props.$two[0]`.
