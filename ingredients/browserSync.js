var gulp        = require('gulp');
var elixir      = require('union-elixir');
var browserSync = require('browser-sync');
var _           = require('underscore');
var config      = elixir.config;

elixir.extend('browserSync', function (src, options) {
  var defaultSrc = [
    'app/**/*',
    //'public/**/*',
    'resources/views/**/*'
  ];

  src     = src || defaultSrc;
  options = _.extend({
    notify: false,
    proxy: 'dev.example.com'
  }, options);

  gulp.task('browser-sync', function () {
    if (browserSync.active === true) {
      browserSync.reload();
    } else if (gulp.tasks.watch.done === true) {
      browserSync(options);
    }
  });

  if (config.production === false) {
    this.registerWatcher('browser-sync', src);
  }

  return this.queueTask('browser-sync');
});
