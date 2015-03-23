/**
 * Build up the given src file(s), to be passed to Gulp.
 *
 * @param {string|array} src
 * @param {string}       baseDir
 * @param {string}       search
 */
var buildGulpSrc = function(src, baseDir, search) {
    if (src) {
        return prefixDirToFiles(baseDir, src);
    }

    return baseDir + '/' + search;
};


/**
 * Prefix a directory path to an array of files.
 *
 * @param {string}       dir
 * @param {string|array} files
 */
var prefixDirToFiles = function(dir, files) {
    if ( ! Array.isArray(files)) files = [files];

    return files.map(function(file) {
        var output_dir = dir;

        if (file.charAt( 0 ) == '!') {
            output_dir = '!' + dir;
            file = file.substring(1);
        }

        return output_dir + '/' + file.replace(dir, '');
    });
};


module.exports = {
    buildGulpSrc: buildGulpSrc,
    prefixDirToFiles: prefixDirToFiles,
};
