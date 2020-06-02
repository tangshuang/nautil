# Lifecircle

A little different from react, Nautil has its own lifecircle:

- onInit
- onDigested
- onMounted
- onRendered
- =============
- shouldUpdate
- onNotUpdate
- onUpdate
- onDigested
- onUpdated
- onRendered
- =============
- onUnmount
- =============
- onCatch

![](../assets/nautil-lifecircle.jpg)

Nautil lifecircle functions should not use together with react component life circle functions (except getDerivedStateFromProps and getSnapshotBeforeUpdate).

For Nautil components, they will run a `digest` task to generate derived properties such as `attrs` `style` `className` and so on. After this task, before `render`, a `onDigested` lifecircle function will be called. And, subscribe to event streams should must behind `digest`, so you can only subscribe to event streams in `onDigested`.
