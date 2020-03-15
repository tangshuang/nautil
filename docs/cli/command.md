# Nautil-CLI Command

We use [Nautil-CLI](https://github.com/tangshuang/nautil-cli) in command line to start, run and build our application in development. In fact, we always begin a new Nautil application with `npx nautil-cli init`.

## init

To generate a new empty nautil application, you should use `init` command.

```
mkdir some-app && cd some-app
nautil-cli init
```

`nauitl-cli init` can only run in an empty dir.

```
nautil-cli init [app-name] [--react-native]
```

- app-name: optional, name of current app, which will be written into package.json, if not passed, the dirname will be used
- react-native: optional, whether to initialize react-native app

After init, the project files will be generated in the directory.

## init-react-native

If you did not pass `--react-native` when `nautil-cli init`, there was no react-native files generated. However, you can generate later by `nautil-cli init-react-native`.
To generate react-native app.

```
nautil-cli init-react-native [name]
```

- name: optional, the name of ProjectName for react-native

By default, we will use `.nautil/react-native.js` to build the native app. For this, you should not pass `name`. If you pass the `name` parameter, you should change the `output.path` of webpack config for right path.

## dev

To run a dev server in local to watch the change of files to refresh the UI.

```
nautil-cli dev <target> [--env=development] [--runtime=react-native] [--platform=ios] [--clean]
```

- target: the configuration file basename in `.nautil` dir, read more in [scripts](scripts.md)
- env: development|production
- runtime: dom|web-component|wechat-mp|ssr|ssr-client|react-native
- platform: dom|ios|android
- clean: remove the output dir before build

Dont be worry about the effects, it will work as what you want.

## build

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
