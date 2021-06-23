# Env Vars

You can use `process.env.VAR_NAME` in your code and it will be replaced with given env vars.

There are 3 way to give env vars:

**.env**

Create a `.env` file into your project root dir.

It should follow [dotenv](https://www.npmjs.com/package/dotenv) rules.

**export**

Give export in CLI directly:

```
NODE_ENV=development nautil build dom
```

**define**

Provide `define` filed in [cli-config.json](./config.md)
