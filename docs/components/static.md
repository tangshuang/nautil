# Static

```js
<Static shouldUpdate={Boolean} render={() =>
  <Text>{Date.now()}</Text>
} />
```

When `shouldUpdate` is `false`, the render result will not change. If change to `true`, the render will change.

`shouldUpdate` can be:

- boolean: true to update, false to keep static
- array: if the passed array items are equal, to update, or to keep static, like `detectEffect`
- function: function to return true or false, true to update
