var utilities = require('./commands/Utilities');
var plugins = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var parsePath = require('parse-filepath');
var browserify = require('browserify');
var elixir = require('union-elixir');
var babelify = require('babelify');
var literalify = require('literalify');
var gulp = require('gulp');


/**
 * Calculate the correct destination.
 *
 * @param {string} output
 */
var getDestination = function(output) {
    output = parsePath(output);

    var saveDir = output.extname
        ? output.dirname
        : (output.dirname + '/' + output.basename);

    var saveFile = output.extname ? output.basename : 'bundle.js';

    return {
        saveFile: saveFile,
        saveDir: saveDir
    }
};

/**
 * Build the Gulp task.
 *
 * @param {array}  src
 * @param {string} output
 * @param {object} options
 */
var buildTask = function(src, output, options) {
    var destination = getDestination(output);

    gulp.task('browserify', function() {
        return browserify(src, options)
            .transform(babelify.configure(options.babelify), { stage: 0 })
            .transform(literalify.configure(options.literalify))
            .bundle()
            .pipe(source(destination.saveFile))
            .pipe(buffer())
            .pipe(gulp.dest(destination.saveDir))
            .pipe(plugins.filter(['*', '!*.map']))
            .pipe(plugins.rename(function (currentPath) {
                if (currentPath.basename.indexOf('.min') === -1) {
                    currentPath.basename += '.min';
                }
            }))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(destination.saveDir));
    });
};


/*
 |----------------------------------------------------------------
 | Browserify Task
 |----------------------------------------------------------------
 |
 | This task will manage your entire Browserify workflow, from
 | scratch! Also, it will channel all files through Babelify
 | so that you may use all the ES6 goodness you can stand.
 |
 */

elixir.extend('browserify', function(src, output, baseDir, options) {
    var search = '/**/*.+(js|jsx|babel)';

    baseDir = baseDir || 'resources/assets/js';
    src = utilities.buildGulpSrc(src, './' + baseDir, search);
    output = output || this.jsOutput;
    options = options || {};

    utilities.logTask('Running Browserify', src);

    buildTask(src, output, options);

    return this.registerWatcher('browserify', baseDir + search)
               .queueTask('browserify');
});
