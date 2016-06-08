'use strict';

import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';
import {Instrumenter} from 'isparta';

var plugins = gulpLoadPlugins();
var config;

const paths = {
  server: {
    bin: [
      `bin/**/*.js`
    ],
    scripts: [
      `**/!(*.spec|*.integration).js`,
      `!config/local.env.sample.js`
    ],
    json: `**/*.json`,
    test: {
      integration: [`**/*.integration.js`, 'mocha.global.js'],
      unit: [`**/*.spec.js`, 'mocha.global.js']
    }
  },
  dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
}

function checkAppReady(cb) {
  var options = {
    host: 'localhost',
    port: config.port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

function sortModulesFirst(a, b) {
  var module = /\.module\.js$/;
  var aMod = module.test(a.path);
  var bMod = module.test(b.path);
  // inject *.module.js first
  if (aMod === bMod) {
    // either both modules or both non-modules, so just sort normally
    if (a.path < b.path) {
      return -1;
    }
    if (a.path > b.path) {
      return 1;
    }
    return 0;
  } else {
    return (aMod ? -1 : 1);
  }
}

/********************
 * Reusable pipelines
 ********************/

let lintServerScripts = lazypipe()
  .pipe(plugins.jshint, `.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
  .pipe(plugins.jshint, `.jshintrc-spec`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
      'transform-class-properties',
      'transform-runtime'
    ]
  })
  .pipe(plugins.sourcemaps.write, '.');

let mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: [
      './mocha.conf'
    ]
  });

let istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory: ''
  });

/********************
 * Tasks
 ********************/

gulp.task('transpile:server', () => {
  return gulp.src(_.union(paths.server.scripts, paths.server.bin))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}`));
});

gulp.task('transpile:scripts', () => {
  return gulp.src(_.union(paths.server.bin))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/bin`));
});

gulp.task('lint:scripts', () => {
  return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
    .pipe(lintServerScripts());
});

gulp.task('lint:scripts:test', () => {
  return gulp.src(paths.server.test)
    .pipe(lintServerTestScripts());
});

gulp.task('jscs', () => {
  return gulp.src(paths.server.scripts)
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/config/environment`);
  nodemon(`-w ${paths.dist}/ ${paths.dist}/`)
    .on('log', onServerLog);
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./config/environment`);
  nodemon(`-w`)
    .on('log', onServerLog);
});

gulp.task('watch', () => {
  var testFiles = _.union(paths.server.test.unit, paths.server.test.integration);

  plugins.livereload.listen();

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())
    .pipe(plugins.livereload());
});

gulp.task('serve', cb => {
  runSequence('clean:tmp',
    //'lint:scripts',
    'start:server',
    'watch',
    cb);
});

gulp.task('serve:dist', cb => {
  runSequence(
    'build',
    ['start:server:prod', 'start:client'],
    cb);
});

gulp.task('test', cb => {
  return runSequence('test:api', cb);
});

gulp.task('migrate:test', () => {
  require('dotenv').config({silent: true});
  var connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
    charset: 'utf8'
  };
  var knex = require('knex')({
    client: 'pg',
    connection: connection,
    debug: process.env.DATABASE_DEBUG === 'true'
  });

  return knex
    .migrate.latest({database: connection.database, directory: './data-model/migrations'})
    .then(function() {
      return knex.seed.run({directory: './data-model/seeds'});
    })
    .then(() => knex.destroy());
});

gulp.task('test:api', cb => {
  var env = process.env.NODE_ENV;

  console.log(env);
  if (env !== 'development' && env !== 'test') {
    console.log("Skipping tests in production, we don't want to wipe out the prod db do we?");
    return cb();
  }

  runSequence(
    'migrate:test',
    'mocha:unit',
    //'mocha:integration',
    cb);
});

gulp.task('mocha:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha());
});

gulp.task('mocha:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha());
});

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    [
      'copy:server',
      'transpile:server',
      'transpile:scripts'
    ],
    cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));

gulp.task('copy:server', () => {
  return gulp.src([
      'package.json',
      paths.server.json
    ], {cwdbase: true})
    .pipe(gulp.dest(paths.dist));
});

gulp.task('coverage:pre', () => {
  return gulp.src(paths.server.scripts)
    // Covering files
    .pipe(plugins.istanbul({
      instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('coverage:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul())
  // Creating the reports after tests ran
});

gulp.task('coverage:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul())
  // Creating the reports after tests ran
});

gulp.task('mocha:coverage', cb => {
  runSequence('coverage:pre',
    'coverage:unit',
    'coverage:integration',
    cb);
});
