const path = require('path')
const fs = require('fs')

;(function() {
  const projDir = path.resolve(__dirname, '../..')
  const projFile = path.resolve(projDir, 'project.config.json')
  const appFile = path.resolve(projDir, 'app.json')

  if (!fs.existsSync(appFile)) {
    return
  }

  if (!fs.existsSync(projFile)) {
    return
  }

  const appJson = require(appFile)
  if (!('pages' in appJson)) {
    return
  }

  const projJson = require(projFile)
  if (!('appid' in projJson && 'compileType' in projJson)) {
    return
  }

  function findDeps(pkgFile) {
    const items = []
    function push(pkgFile) {
      const { dependencies = {}, devDependencies = {}, optionalDependencies = {} } = require(pkgFile)
      const deps = Object.keys(dependencies).concat(Object.keys(devDependencies)).concat(Object.keys(optionalDependencies))
      deps.forEach((dep) => {
        if (dep === 'nautil') {
          return
        }

        const pkgFile = path.resolve(projDir, 'node_modules', dep, 'package.json')
        if (!fs.existsSync(pkgFile)) {
          return
        }

        items.push(dep)
        push(pkgFile)
      })
    }
    push(pkgFile)
    return items
  }

  const pkgFile = path.resolve(projDir, 'package.json')
  if (!fs.existsSync(pkgFile)) {
    return
  }

  const ntFile = path.resolve(projDir, 'node_modules', 'nautil/package.json')
  if (!fs.existsSync(ntFile)) {
    return
  }

  const deps = findDeps(pkgFile)
  const ntDeps = findDeps(ntFile)

  const removeItems = []
  ntDeps.forEach((dep) => {
    if (deps.includes(dep)) {
      return
    }

    const dir = path.resolve(projDir, 'node_modules', dep)
    fs.rmdir(dir, { recursive: true, force: true })
    removeItems.push(dep)
  })

  console.log('Nautil: 这些包由于用不到，已被删除', removeItems)
})();
