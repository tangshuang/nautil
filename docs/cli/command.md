# Nautil-CLI Command

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
