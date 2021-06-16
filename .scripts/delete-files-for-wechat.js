const path = require('path')
const fs = require('fs')

;(function() {
  const projDir = path.resolve(__dirname, '../../..')
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

  const nodeModules = path.resolve(projDir, 'node_modules')

  function getDeps(pkgFile) {
    const { dependencies = {}, devDependencies = {}, optionalDependencies = {} } = require(pkgFile)
    const deps = Object.keys(dependencies).concat(Object.keys(devDependencies)).concat(Object.keys(optionalDependencies))
    return deps
  }

  function findDeps(pkgFile) {
    const res = []
    function push(pkgFile) {
      const deps = getDeps(pkgFile)

      deps.forEach((dep) => {
        if (res.includes(dep)) {
          return
        }

        const depFile = path.resolve(nodeModules, dep, 'package.json')
        if (!fs.existsSync(depFile)) {
          return
        }

        res.push(dep)
        push(depFile)
      })
    }
    push(pkgFile)
    return res
  }

  const ntFile = path.resolve(nodeModules, 'nautil/package.json')
  if (!fs.existsSync(ntFile)) {
    return
  }
  const ntDeps = findDeps(ntFile)

  const _deps = getDeps(path.resolve(projDir, 'package.json'))
  const others = _deps.filter(item => item !== 'nautil' && item.indexOf('.') !== 0)
  const excludes = []
  others.forEach((dep) => {
    const pkgFile = path.resolve(nodeModules, dep, 'package.json')
    if (!fs.existsSync(pkgFile)) {
      return
    }
    const pkgDeps = findDeps(pkgFile)
    excludes.push(...pkgDeps)
  })

  const removeItems = []

  function removePkg(pkg) {
    if (!ntDeps.includes(pkg)) {
      return
    }

    if (excludes.includes(pkg)) {
      return
    }

    const dir = path.resolve(projDir, 'node_modules', pkg)
    fs.rmdir(dir, { recursive: true, force: true }, () => {})
    removeItems.push(pkg)
  }

  const dirs = fs.readdirSync(nodeModules)
  dirs.forEach((dir) => {
    if (dir.indexOf('.') === 0) {
      return
    }

    if (dir.indexOf('@') === 0) {
      const subdirs = fs.readdirSync(path.resolve(nodeModules, dir))
      let count = 0
      subdirs.forEach((subdir) => {
        if (subdir.indexOf('.') === 0) {
          return
        }

        removePkg(dir + '/' + subdir)
        count ++
      })
      if (count === subdirs.length) {
        fs.rmdir(path.resolve(nodeModules, dir), { recursive: true, force: true }, () => {})
      }
      return
    }

    removePkg(dir)
  })

  if (removeItems.length) {
    console.log('Nautil: 这些包由于用不到，已被删除', removeItems)
  }
})();
