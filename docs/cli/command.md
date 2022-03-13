# Nautil-CLI Command

Nautil CLI is a high-level scaffolding tool. If you use nautil-cli, your project will follow the pattern of it. To clearify, you should think about whether to use it (without nautil-cli is ok to use nautil).

You can call `nautil` as alias of `nautil-cli`, so I will use only `nautil` instead of `nautil-cli` in the following.

## init

```
nautil init [--verbose]
```

Initialize a new project or override an exisiting project.

You should run `nautil init` in an empty directory or an exisiting project directory.

## build

```
nautil build <app>
```

Build a app, `app` stands for a dir name in `src/apps` dir. The dest dir is `dist/<app>`.

Notice, `NODE_ENV` makes sense. For example:

```
NODE_ENV=development nautil build dom
```

This will make your code without minified.

## dev

```
nautil dev <app>
```

Setup a devserver / watching task to help you develop and preview.

## install

```
nautil install [pkg@version] [pkg@version] ...
nautil i -g [pkg@version] ...
nautil i -f
```

Install some dependencies:

- pkg: the package you want to install
- -g, --global: install dependencies into nautil-cli inside, for globally installed nautil-cli
- -f, --force: pkg and --global will be ignore, all required dependencies will be reinstalled

## run

```
nautil run <app> <io>
```

`io` can be `android` `ios` `electron`.

```
nautil run my-app ios
```

This will serve up a metro building to preview an ios app.

## pack

```
nautil pack <app> <io>
```
