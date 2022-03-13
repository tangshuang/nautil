# TypeScript

It is easy to support typescript with Nautil-CLI.

First of all, you should enable typescript supporting in `.nautil/cli-config.json`.

After you enable this config, and run `nautil dev <app>`, it will install typescript dependencies for you automaticly.

Then modify `tsconfig.json` in the project root directory to match your project requirement.

Next create .ts files to export modules in src dir.
Notice that, index.js should Must be .js file, it is entry file, you should write less code (no logic code) in it, and import .ts files in it.
Nauti-CLI support .ts, .tsx files.

Finally run `nautil build <app>` or `nautil dev <app>` to check whether it works.
Build task will emit error and break out when checking fail.
Dev task will only emit error in CLI and not emit error in browser, so you should must read error infomation in your commander when you developing.
