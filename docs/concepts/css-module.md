# CSS Module

You'd better use [CSS Module](https://css-tricks.com/css-modules-part-1-need/) in Nautil. According to the [repo](https://github.com/css-modules/css-modules), CSS modules are:

> CSS files in which all class names and animation names are scoped locally by default.

Why should you use CSS Module in Nautil?
It is much easier to find out from which css file the rules come. Another reason is becuase of cross-platform. It is very easy to load css rules as objects by using building tools, if you do not use CSS Module, there is no way to cross platform with one code.

If you use nautil-cli, it is automaticly to import a css file as CSS Module:

```js
import * as Css from './some.css' // -> CSS Module
import './any.css' // -> global css import
```
