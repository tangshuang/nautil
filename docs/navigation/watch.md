# Navigation Watching

In fact, navigation is a observable object too. You can use `on` method to watch route changes.

**on(route, callback, exact)**

You can use `on` to watch which route is entering.

```js
navigation.on('home', state => console.log(state))
```

The first parameter `route` is one of:

- *: any route change
- !: not found route
- name: route name
- name && exact: exact route name, entrying sub route will not notify this callback
- url: equal or begin with this url string
- url && exact: only equal this url string
- path: route path, or path begin with this path string
- path && exact: only equal this path
- regexp: match with current url
- function: state => Boolean, return true means match

Examples:

```js
navigation.on(/book\/[0-9]+/, callback)
navigation.on('parent.child', callback, true)
navigation.on('/book/:id', callback)
```

Notice that, callback will be invoked after enter the route (after `$onEnter` event).

**off(route, callback)**

Use `off` to disable watching callback.
