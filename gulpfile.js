const gulp = require('gulp')
// const babel = require('gulp-babel')
// const rename = require('gulp-rename')
const ts = require('gulp-typescript')
const del = require('del')

const tsconfig = require('./tsconfig.json')


function clean() {
  return del('./lib/**')
}

function buildES() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
  })

  return gulp
    .src(['src/**/*.{ts,tsx}'])
    .pipe(tsProject)
    .pipe(gulp.dest('lib/es/'))
}


// series:   串行执行
// parallel：并行执行
exports.default = gulp.series(
  clean,
  buildES,
)
