# Computed Property

It supports computed property like vuejs does. When you want to define a computed property, you can pass the property as a native js computed property:

```js
const store = new Store({
  name: 'tomy',
  birth: 2009,

  // age is a absolute computed property with getter and setter
  get age() {
    return new Date().getFullYear() - this.birth
  },
  set age(age) {
    this.birth = new Date().getFullYear() - age
  },

  // height is a defective computed property which has only getter, set its value will not work
  get height() {
    return this.age * 5
  },

  // fatherAge is a defective computed property which has only setter, it will always return `undefined` when read it
  set fatherAge(fage) {
    this.age = fage - 28
  },
})
```

Another way to change some computed properties is to use `define` method on `store`.

```js
store.define('color', {
  get() {
    return this.age % 2
  },
  set(v) {
    this.age = v * 3 / 2
  },
})
```
