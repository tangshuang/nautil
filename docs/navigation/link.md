# Link

```js
<Link
  navigation={navigation}
  to="article"
  params={{
    id: 123,
  }}
  replace={true}
  open={false}
>click to go</Link>
```

**props**

- navigation: which navigation to navigate
- to: target, it can be one of:
  - name: route name
  - -1: go back one history stack
  - url: external url
- params: parameters to pass to next navigation state
- open: Boolean, when `to` is a url, whether to open with `target="_blank"`
- replace: whether to replace history when swtich route
