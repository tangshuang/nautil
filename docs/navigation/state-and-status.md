# Navigation State and Status

Navigation is a statable controller, when state change, it means the view should be changed too.

## State

The `state` property of an instance of Navigation contains the current navigation information.
Always, it contains the current route, current url, current route name and params.

## Status

However, when we navigate to a undefined route, navigation will emit a `$onNotFound` event.

So, how to know current state is work? Use `status` property.
When `status` property is `0`, it means current state is on notFound route. If it is `1`, current state is on normal route.

So, in some cases, you should must use both `state` and `status` to determine what to doing:

```js
const { status, state } = navigation
if (status && state.name === 'xxx') {
  // ...
}
```
