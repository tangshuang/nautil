# Navigation.is

Ths `is` method is to determine current navigation match the given pattern.

```js
if (navigation.is('home', true)) {
  //...
}
```

Match pattern:

- *: is found
- !: is not found
- name: is matching route name
- name && !exact: is matching sub route of route name
- url: is matching url
- url && !exact: is matching url begining with this url
- path: is matching path
- path && !exact: is matching sub route begining with this path
- regexp: is matching current url
- function: get state and return true
