# Show

Different from `If`, the children will be rendered at the first time, and use display:none or display:block to show the section.

```js
<Show is={Boolean} component={NautilComponent}>
  inner content
</Show>
```

As default, it will use `Section` component as container, you can pass `component` to instead.
