# Install

I know you have learn about many third party js library or framework. And it is easy to link them into your project.
However, nautil provide a CLI tool to maitain your nautil projects. Nautil has no cdn package or single npm built package. Because we are going to build cross-platform applications, we have to use some hard power.

**global install**

It is recommended to install nauitl-cli as a global command.

```
npm i -g nautil-cli ## maybe you need to use `sudo` to finish installing
```

So that you can use `nautil-cli` tool quickly. And then, you can use the following command to setup a nautil application.

```
mkdir my-app && cd my-app
nautil-cli init
```

**use npx**

On the other hand, you can use `npx` to setup a nautil application for only once without installing global package.

```
mkdir my-app && cd my-app
npx nautil-cli init
```

`npx` will download nautil-cli first and then run the command. If your network is not fast enough, global install is strongly recommended. Because npx will download the pacakge each time even though you have download once.

After you run `nautil-cli init`, all dependencies will be installed automaticly.

To check whether the install is ok, run `npm run dev` after installing, and open browser with the http address in the CLI tool to visit the localhost page. If you see the hello word, you are getting right thing.
