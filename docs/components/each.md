# Each

```js
<Each of={Array|Object} render={(value, key, uniqueKey) =>
  <Text key={uniqueKey}>{key}: {value}</Text>
} />
```

**uniqueKey**

React require a list with key for each item, we build it inside, you can use `uniqueKey` as item's key.
