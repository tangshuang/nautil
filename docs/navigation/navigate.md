# Navigate

Navigate compoent is to jump/switch navigation from one route to another.

```js
import { Navigate } from 'nautil/components'
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

```js
<Navigate to={-1}>back</Navigate>
<Navigate to="some" params={{ title: 'Some' }} replace>some</Navigate>
<Navigate to="app:some/page1" open>app</Naviagate>
```

In some cases, you may contain serveral elements inside.

```js
<Navigate to="some">
  <Section><Text>Title</Text></Section>
  <Section><Text>content</Text></Section>
</Navigate>
```

**use component**

In this case, Nautil will use a `Section` component to wrap the inner elements. If you want to use other component, use `component` prop.

- component: use which component to wrap inner elements
- props: the props passed into component

```js
<Navigate to="some" component={MyWrapper}>
  <Section><Text>Title</Text></Section>
  <Section><Text>content</Text></Section>
</Navigate>
```

```js
<Navigate to="some" component={Button} props={{ type: 'primary' }}>some</Navigate>
```
