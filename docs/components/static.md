# Static

```js
<Static shouldUpdate={Boolean} render={() =>
  <Text>{Date.now()}</Text>
} />
```

When `shouldUpdate` is `false`, the render result will not change. If change to `true`, the render will change.
