# Navigation Events

To listen events, you should use `on` method too.

```js
navigation.on('$onEnter', callback)
```

Events:

- $onEnter
- $onLeave
- $onForword: before $onLeave
- $onBack: before $onLeave
- $onBackEmpty: when back to the history top
- $onNotFound
