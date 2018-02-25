const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const del = require('del');
const glob = require('glob');
const path = require('path');
const isparta = require('isparta');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const Instrumenter = isparta.Instrumenter;
const manifest = require('./package.json');

// Load all of our Gulp plugins
const $ = loadPlugins();

// Gather the library data from `package.json`
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = 'dist';
const exportFileName = 'redux-location-state';

function cleanDist(done) {
  del([destinationFolder]).then(() => done());
}

function cleanTmp(done) {
  del(['tmp']).then(() => done());
}

// Lint a set of files
function lint(files) {
  return gulp.src(files)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
}

function lintSrc() {
  return lint('src/**/*.js');
}

function lintTest() {
  return lint('test/**/*.js');
}

function lintGulpfile() {
  return lint('gulpfile.js');
}

function build() {
  return gulp.src(path.join('src', config.entryFileName))
    .pipe(webpackStream({
      output: {
        filename: `${exportFileName}.js`,
        libraryTarget: 'umd'
      },
      // Add your own externals here. For instance,
      // {
      //   jquery: true
      // }
      // would externalize the `jquery` module.
      externals: {},
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      },
      devtool: 'source-map'
    }))
    .pipe(gulp.dest(destinationFolder))
    .pipe($.filter(['**', '!**/*.js.map']))
    .pipe($.rename(`${exportFileName}.min.js`))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(destinationFolder));
}

function copyOtherFiles() {
  return gulp.src(['.babelrc', 'CHANGELOG.md', 'LICENSE', 'package.json', 'yarn.lock', 'README.md'])
    .pipe(gulp.dest(destinationFolder));
}

function _mocha() {
  return gulp.src(['test/bootstrap.js', 'test/**/*.js'], {read: false})
    .pipe($.mocha({
      reporter: 'spec',
      ignoreLeaks: false,
      compilers: [
        'js:babel-core/register',
      ],
    }));
}

function _registerBabel() {
  require('babel-register');
}

function test() {
  _registerBabel();
  return _mocha();
}

function coverage(done) {
  _registerBabel();
  gulp.src(['src/**/*.js'])
    .pipe($.istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire())
    .on('finish', () => {
      return test()
        .pipe($.istanbul.writeReports())
        .on('end', done);
    });
}

const watchFiles = ['src/**/*', 'test/**/*', 'package.json', '**/.eslintrc'];

// Run the headless unit tests as you make changes.
function watch() {
  gulp.watch(watchFiles, ['test']);
}

// Remove the built files
gulp.task('clean', cleanDist);

// Remove our temporary files
gulp.task('clean-tmp', cleanTmp);

// Lint our source code
gulp.task('lint-src', lintSrc);

// Lint our test code
gulp.task('lint-test', lintTest);

// Lint this file
gulp.task('lint-gulpfile', lintGulpfile);

// Lint everything
gulp.task('lint', ['lint-src', 'lint-test', 'lint-gulpfile']);

// Build two versions of the library
gulp.task('buildJs', build);
gulp.task('build', ['lint', 'clean', 'buildJs'], copyOtherFiles);

// Lint and run our tests
gulp.task('test', ['lint'], test);

// Set up coverage and run tests
gulp.task('coverage', ['lint'], coverage);

// Run the headless unit tests as you make changes.
gulp.task('watch', watch);

// An alias of test
gulp.task('default', ['test']);
