# If/ElseIf/Else

Render by given condition.

## If

Render when `is` prop is true.

```js
<If is={Boolean} render={Function} />
```

or

```js
<If is={Boolean}>
  {Function}
</If>
```

The `render` function, should return a Nautil Element. It is like `render` method of Nautil component.

## ElseIf

It is a sub component of `If` component. You should use it inside `If`.

```js
<If is={condition1} render={render}>
  <ElseIf is={condition2} render={render} />
</If>
```

## Else

The same as `ElseIf` only without `is` prop.

```js
<If is={condition1} render={render}>
  <ElseIf is={condition2} render={render} />
  <Else render={render} />
</If>
```
