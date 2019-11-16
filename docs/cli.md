# CLI

We use [Nautil-CLI](https://github.com/tangshuang/nautil-cli) in command line to start, run and build our application in development. In fact, we always begin a new Nautil application with `npx nautil-cli init`.

## Init

To generate a new empty nautil application, you should use `init` command.

```
mkdir some-app && cd some-app
npx nautil-cli init SomeApp
```

`nauitl-cli init` can only run in an empty dir.

To use nautil-cli globally, use install it as global command:

```
npm i -g nautil-cli
```

```
nautil-cli init [app-name] [--react-native]
```

- app-name: optional, the project name of current apps
- react-native: optional, whether to initialize react-native app

After init, the project files will be generated in the directory.

## Init-react-native

To generate react-native app.

```
nautil-cli init-react-native [name]
```

- name: optional, the name of ProjectName for react-native

If you did not pass `--react-native` when `nautil-cli init`, there was no react-native files generated. However, you can generate later by `nautil-cli init-react-native`.

By default, we will use `.nautil/react-native.js` to build the native app. For this, you should not pass `name`. If you pass the `name` parameter, you should change the `output.path` for right path.

## Build

To generate built files.

```
nautil-cli build <target> [--env=development] [--runtime=react-native] [--platform=ios] [--clean]
```

- target: the configuration file basename, such as `dom` `react-native` and `wechat-mp`.
- env: development|production
- runtime: dom|web-component|wechat-mp|ssr|ssr-client|react-native
- platform: dom|ios|android
- clean: to remove output dir before build

When `runtime` is `ssr`, nautil-cli will look for $target-client.js in `.nautil` dir, and run `nautil-cli build ssr-client` after the task.

## Dev

To run a dev server in local to watch the change of files to refresh the UI.

```
nautil-cli dev <target> [--env=development] [--runtime=react-native] [--platform=ios] [--clean]
```

- target: the configuration file basename, such as `dom` `react-native` and `wechat-mp`.
- env: development|production
- runtime: dom|web-component|wechat-mp|ssr|ssr-client|react-native
- platform: dom|ios|android

Dont be worry about the effects, it will work as what you want.

## Configs

In the project root directory, there is a directory called `.nauitl`.
You can write your own webpack config files here.
Then you can use the file's name for nautil-cli task.

For example, you create a `demo.js` in `.nautil`, and give right configuration of webpack, then you can run:

```
npx nautil-cli build demo --env=production
```

You can put 3 types of files in the `.nautil` dir.

- webpack config file which will be use as target file, i.e. demo.js
- config files which have `.config.js` extension, currently `.postcss.config.js` and `wechat-mp.config.js` are supported
- hook files which have `.hook.js` extension, currently `before.hook.js` and `after.hook.js` are supported

Hook files should export a function which return webpack configuration.

```js
// before.hook.js
module.exports = function() {
  return {
    devServer: {
      before(app) {
        // ...
      },
    },
  }
}
```

The returned object from `before.hook.js` will be used as basic configuration of webpack.
And the returned object from `after.hook.js` will be used as finally configuration of webpack, the function in it will receive the passed configuration.

## .env

You can put a `.env` file in your project root dir to control build.

```
## whether to disable hot-reload module,
## only works when NODE_ENV=development && RUNTIME_ENV=dom
# NO_HOT_RELOAD=true

## whether to disable use css module
## nautil-cli default use css module
# NO_CSS_MODULE=true

## if you want to build a wechat miniprogram (wechat-mp), you should set this
# WECHAT_MINIPROGRAM_APP_ID=xxx
```

## process.env

You can use `process.env.ENV_VAR` in your client side code to hold the place, and to replace when build. The available vars:

- NODE_ENV: production|development
- RUNTIME_ENV: web|web-component|wechat-mp|react-native|ssr|ssr-client
- PLATFORM_ENV: dom|ios|android
- APP_NAME: name of react-native app

And the VARS from `.env` will be appended into this list, and can be used in webpack config files.

## tools

To create your own build config file, you can use the tools provided by nautil-cli.

**nautil/configs**

Files in nautil/configs dir can be used as a basic configuration, you can extends the exported configuration to create your own build configuration.

**nautil/configs/rules**

Modify the rules file to change default parsing.

**ModuleReplacePlugin**

Replace the module patch string by using this webpack plugin.

```js
const { ModuleReplacePlugin } = require('nautil-cli/plugins')

module.exports = {
  ...
  plugins: [
    new ModuleReplacePlugin({
      find,
      replace,
    })
  ]
}
```

- find: 1. string, the module file path to equal; 2: regexp, the moulde file patch to match; 3: function, receive module file path, return true or false
- replace: string, the new file path to replace old module file path

**ModuleModifyPlugin**

Modify module file content.

```js
const { ModuleModifyPlugin } = require('nautil-cli/plugins')

module.exports = {
  ...
  plugins: [
    new ModuleModifyPlugin({
      find,
      replace,
    })
  ]
}
```

- find: the same as ModuleReplacePlugin
- replace: function, receive current content, return new content.

Use it only with text files.

**FilesFilterPlugin**

Filter files of output, useful to output only wanted files.

```js
const { FilesFilterPlugin } = require('nautil-cli/plugins')

module.exports = {
  ...
  plugins: [
    new FilesFilterPlugin(filter)
  ]
}
```

- filter: function, receive output chunk file path, return true to keep, return false to remove
