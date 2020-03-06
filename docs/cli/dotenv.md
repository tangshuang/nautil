# Nautil-CLI ENV

Use environment variable to control different situations.

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
