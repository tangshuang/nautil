# Lifecircle

A little different from react, Nautil has its own lifecircle:

- ===== mount: =======
- init
- onDigested
- onInit
- detectAffect
- onAffect
- onMounted
- onAffected
- ====== update: =======
- shouldUpdate
- onNotUpdate
- onUpdate
- onDigested
- detectAffect
- onAffect
- onUpdated
- onAffected
- ====== unmount: =======
- onUnmount
- ====== error: =======
- onCatch

Details:

- init: when `constructor` run, use `init` so that you do not need to call `super` in `constructor`
- onDigested: after this.attrs, this.className, this.style... generated
- onInit: after this.$state generated
- detectAffect: detect whether to affect, should must return an array
- onAffect: will be invoked before onMounted/onUpdated
- onAffected: be invoked after onAffect and onMounted/onUpdated

![](../assets/nautil-lifecircle.jpg)

Nautil lifecircle functions should not use together with react component life circle functions (except getDerivedStateFromProps and getSnapshotBeforeUpdate).

For Nautil components, they will run a `digest` task to generate derived properties such as `attrs` `style` `className` and so on. After this task, before `render`, a `onDigested` lifecircle function will be called.
