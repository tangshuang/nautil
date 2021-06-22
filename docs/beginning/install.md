# Install

```
npm i nautil
```

However, it will not install peer dependencies such as `react-dom` `react-native` and so on.

```
"peerDependencies": {
  "@react-native-async-storage/async-storage": "^1.14.1",
  "i18next-browser-languagedetector": "^4.0.1",
  "i18next-react-native-language-detector": "^1.0.2",
  "react-dom": "^17.0.2",
  "react-native": "^0.64.0",
  "react-native-locale-detector": "^1.0.1",
  "react-reconciler": "^0.26.2",
  "scheduler": "^0.20.2"
},
```

You can install peer dependencies or use `nautil-cli` to initialize your project, and it will install dependencies based on what you need.

```
npx nautil-cli init
```
