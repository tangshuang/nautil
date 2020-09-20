const { src, dest } = require('gulp')
const path = require('path')
const babel = require('gulp-babel')
const babelConfig = require('./babel.config.js')
const rename = require('gulp-rename')

function buildJs() {
  return src(path.resolve(__dirname, '../src/**/*.js'))
    .pipe(babel(babelConfig))
    .pipe(dest(path.resolve(__dirname, '..')))
}

function buildJsx() {
  return src(path.resolve(__dirname, '../src/**/*.jsx'))
    .pipe(babel(babelConfig))
    .pipe(rename({ extname: '.jsx' }))
    .pipe(dest(path.resolve(__dirname, '..')))
}

function main() {
  buildJs()
  buildJsx()
}

main()
