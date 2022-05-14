# Lifecircle

A little different from react, Nautil has its own lifecircle:

- ===== mount: =======
- init
- onDigested
- onInit
- render
- onRender
- detectAffect
- onAffect
- onMounted
- onAffected
- ====== update: =======
- shouldUpdate
- onNotUpdate
- onUpdate
- onDigested
- render
- onRender
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
- onDigested: after this.attrs, this.className, this.style... generated, during onDigested, `onParseProps` is triggered, you can use it to transform props to generate different this.attrs, this.className and this.style
- onInit: after this.$state generated
- shouldUpdate: determine whether to rerender, should return boolean or an array, if return an array means affect when the array is shallow equal to previous, if not equal, to rerender
- onRender: you have the chance to change the VDOM here, should return new VDOM
- detectAffect: detect whether to affect, should must return an array or `true`, if `true` means going to affect, if return an array means affect when the array is shallow equal to previous
- onAffect: will be invoked before onMounted/onUpdated
- onAffected: be invoked after onAffect and onMounted/onUpdated

![](../assets/nautil-lifecircle.jpg)

Nautil lifecircle functions should not use together with react component life circle functions (except getDerivedStateFromProps and getSnapshotBeforeUpdate).

For Nautil components, they will run a `digest` task to generate derived properties such as `attrs` `style` `className` and so on. After this task, before `render`, a `onDigested` lifecircle function will be called.
