# Build and Publish

After all your coding and testing, now you need to create a production bundle.

```
npm run build:dom
```

The target following `build:` are from dom, webc (web component), wemp (wechat miniprogram), rn (react-native), ssr (server side render). Choose one to build.

After building, the bundle files will be put into `dist` directory, find what you want in this directory.

Notice that, if you want to build a react-native app, you should initialize your react-native project first by using:

```
npx nautil-cli init --react-native
```

Or generate later after you have initialize your project by using:

```
npx nautil-cli init-react-native
```

You will learn more about CLI tool.
