# Methods of Instance

### register(datasources)

Register datasources in databaxe,
notice, data is shared with other instances of databaxe.

`datasources` is an array.
It is ok if you pass only one datasource here.

**datasource**

_object_

```js
const datasource = {
  // string, identifation of this datasource, can be only called by current instance
  id: 'xxx',

  // string, url to request data,
  // you can use interpolations in it, i.e. 'https://xxx/{user_name}/{id}',
  // and when you should call `.get('xxx', { fillers: { user_name, id } })`
  // if you pass relative url, it will be connected with options.baseURL
  url: '/api/users',

  // function, transform your data after getting data from store,
  // you should pass a bound function or an arrow function if you use `this` in it.
  // transform function should be pure functions!!! don't modify the original data in it.
  transformer: (data) => {},

  // function, validate the http status, return true to pass
  validateStatus: status => true,

  // function, validate data, return true to pass
  validateData: data => true,

  // number, cover settings.expire
  expire: 10*1000,

  // number, cover settings.debounce
  debounce: 10,

  // axios options, cover settings.options
  options: {},
}
```

When you `.get` or `.save` data, this datasource info will be used as basic information.

### subscribe(id, callback, priority = 10)

Add a callback function in to callback list.
Notice, when data changed (new data requested from server side), all callback functions from components will be called.

**id**

Datasource id.

**callback(data, options)**

Callback function when request successfully from backend data api, and new data is put into store.

- data: new data from api
- options: axios options, options.method should not be 'put', 'delete', 'patch'

```js
dbx.subscribe('myid', (data) => {
  console.log(data)
})
```

With `options`:

```js
dbx.subscribe('myid', (data, options) => {
  let fillers = options.feilds || {}
  if (fillers.userId === 112) {
    console.log(data)
  }
})

dbx.get('myid', { feilds: { userId: 112 } })
```

**priority**

The order of callback functions to run, the bigger ones come first. Default is 10.

### unsubscribe(id, callback)

Remove callback, so do not use anonymous functions as possible.

If callback is 'undefined', all callbacks of this datasource will be removed.

You must to do this before you destroy your component, or you will face memory problem.

### request(id, params)

Request data from backend with a Promise. When the data comes back, the stored data in depository will be replaced (which will be used by `get`).

Don't be worry about several calls. If in a page has several components request a url at the same time, only one request will be sent, and all of them will get the same Promise instance and will be notified by subscribed callback functions.
When the data is back from server side, all component will be notified.

**params**

Part of `params` will be used to interpolate url. For example:

```js
// datasource.url = '/api/v2/users/{user}
depo.get('user_by_id', {
  user: '123',
  age: '10',
}).then((data) => {
  // ...
})
```

Here `user` field in `params` will be used to replace `{user}` in datasource's `url`.

The other part of `params` will be used to generate query string if `get` method or post data if `post` method. For example:

```js
// datasource.url = '/api/v2/users/{sex}
// datasource.method = 'get'
depo.get('user_by_id', {
  sex: 'm',
  age: '10',
}).then((data) => {
  // ...
})
```

This will send an ajax get `/api/v2/users/m?age=10`. Notice that, the params which have been used to interpolate will not exist in query string or post data.

### get(id, params)

Get data from store and return value directly.
If data is not exists, it will request data from server side in an async task.

If `expire` is set, data in store will be used if not expired, if the data is expired, it will request again which cost time (which will trigger callback).
If not set, data in local store will always be used if exist, so it is recommended to set a `expire` time.

If there is data in store, and expired, and request fail, local store data will be used again.

When `async` option is set to be true, `get` will return a Promise. Because async storage can not be read syncly.

```js
const value = depo.get('user', { id: 10 })
```

### save(id, params)

To save data to server side, I provide a save method. You can use it like put/post operation:

```js
depo.save('myId', { name: 'lily', age: 10 })
```

Notice: save method will not update the local store data. If you want to update data in store, use `request` after save finish.

**data**

post data.

**@return**

This method will return a promise which resolve response, so you can use `then` or `catch` to do something when request is done.

`.save` method has some rules:

1. options.data will not work
2. when options.method=delete no data will be post
3. several save requests will be merged during debouncing
4. if options.method is not set, `POST` will be used, `GET` is not alllowed

If more than one saving request happens in debounce time, post data will be merged, and the final request send merged data to server side.
So if one property of post data is same as another saving request's, the behind data property will be used, you should be careful about this.
If you know react's `setState`, you may know more about this transaction.

### destroy()

You should destroy the instance before you unmount your component.
