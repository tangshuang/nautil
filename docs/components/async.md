# Async

```js
<Async
  await={() => new Promise(...)}
  then={data => <Text>{data.text}</Text>}
  catch={e => <Text>{e.message}</Text>}
  pending={<Loading />}
/>
```
