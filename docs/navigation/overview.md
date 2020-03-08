# Navigation

For a frontend js framework, we provide a independent router system inside Nautil. We do not follow react-router or any other react router components, we build a Navigation system instead.

- Navigation: to create a controller with state
- Navigator: a view component to create a canvas based on navigation
- Route: a view component to determine which part to render based on navigation
- Navigate: a component to go to target view based on navigation

In your application, you should import them first:

```js
import { Navigation } from 'nautil'
import { Navigator, Route, Navigate } from 'nautil/components'
```
