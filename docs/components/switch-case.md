# Switch/Case

Render by given condition.

## Switch

```js
<Switch of={Any}>
  <Case is={Any} render={Function} />
</Switch>
```

When the value of `Case.is` equals `Switch.of`, use the `render` function to render.

## Case

```js
<Case is={Any} default break render={Function} />
```

- is: when equals `Switch.of`, render it
- default: if all previous not match, use this render
- break: if match, render this, and stop going down

```js
<Switch of={index%2}>
  <Case is={1} break={index%3 === 1} render={Function} />
  <Case is={1} render={Function} />
</Switch>
```

Let's look this to learn about `break`. When `index%3 === 1`, it will **only** render first branch, or it will render the **both** branch
