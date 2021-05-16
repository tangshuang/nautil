# useUniqueKeys

```
const keys: string[] = useUniqueKeys(items: any[], shouldDeepEqual: boolean)
```

To get unique keys for all items in a list, so that you do not need to worry about react loop warning.

```js
function MyComponent(props) {
  const { items } = props

  const keys = useUniqueKeys(items)

  return items.map((item, i) => <Item key={keys[i]} data={item} />)
}
```

Even though a item is moved (still in the list), the key for it will not change, i.e.

```js
const a = { a: 1 }
const b = { b: 1 }
const c = { c: 1 }

const items = useUniqueKeys([a, b, c])
// => ['axxx', 'bxxx', 'cxxx']

const items2 = useUniqueKeys([b, c, a])
// => ['bxxx', 'cxxx', 'axxx'] -> a was moved to the end
```

When you set `shouldDeepEqual` to be true, it will diff the deep nodes of item objects, not use `===` to compare.
