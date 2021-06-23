# CLI Config

Nautil-CLI is customized by a config file which lay at `.nautil/cli-config.json`.

```json
{
  "version": "0.13.12",
  "platforms": [
    "dom"
  ],
  "typescript": true,
  "alias": null,
  "dll": false,
  "chunks": false,
  "define": null,
  "clear": false,
  "analyer": false,
  "sourceMap": true,
  "devServer": null,
  "hot": false,
  "live": true,
  "cache": false,
  "env": {},
  "source": {}
}
```

**version**

The version of CLI which is used to initialize the project.

If you upgrade your CLI tool and the coming version does not match this version, CLI will throw out error.

**platforms**

Which platforms did you checked when initialize the project.

When you run `nautil i -f`, CLI will reinstall dependencies based on this field.

**typescript**

Whether to enable typescript supporting.

When you enable this option, CLI will install dependencies automaticly when you run `nautil build` or `nautil dev`.

**alias**

Webpack configure `resolve.alias` option.

For example:

```
"alias": {
  "jquery": "jquery/dist/jquery.min.js"
}
```

**dll**

Whether to enable webpack DLL feature.

DLL configuration is builtin, you have no idea to change it.

**chunks**

Whether to enable webpack chunks spliting.

Chunks Spliting configuration is builtin.

**define**

Apply to `DefinePlugin`, for example:

```
"define": {
  "SOME_ID": "xxxxxx"
  "MY_APP_ID": "process.env.APP_ID" -> read from process.env
}
```

**clear**

Remove files which is not needed before building.

**analyer**

Output analyer report after build. Report files will be put in `.analyer` dir.

When you enable this option, CLI will install dependencies automaticly when you run `nautil build` or `nautil dev`.

**sourceMap**

Whether to output .map files.

**devServer**

Webpack configure `devServer` option.

**hot**

Whether to enable hot reload with HotModule.

**live**

Whether to enable live reload, if hot is true, this option will have no affect.

**cache**

Whether to cache building. Cache will be put into `.cache` dir.

Learn more [here](https://webpack.js.org/configuration/other-options/#cache).

**env**

Override configs with different env. For example:

```
"env": {
  "test": {
    "cache": false <- When process.env.NODE_ENV === test, `cache` will be false
  }
}
```

**source**

If you add a new directory into src and want to build it as a source, you should MUST define it here. For example:

```
"source": {
  "wx": {
    "platform": "dom",
    "extensions": [".esm"],
    "library": "wx",
    "libraryTarget": "umd",
    "globalObject": "typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this"
  }
}
```

You can even use source to override an exisiting source configuration, for example `dom` `native` `wechat`.
