const gulp = require('gulp');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

gulp.task('minify_scripts', () => {
  gulp.src('routes/**/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest('minroutes/'))
});

gulp.task('default', ['serve']);

gulp.task('serve', ['minify_scripts','nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:5000/api/google",
        files: ["routes/**/*.js"],
        browser: "google chrome" || "safari",
        port: 7000
  });
});

gulp.task('nodemon', function (cb) {
  var started = false;
  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});
