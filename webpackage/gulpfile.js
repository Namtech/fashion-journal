'use strict';
var argv = require('minimist')(process.argv.slice(2)),
    pump = require('pump'),
    gulp = require('gulp'),
    cache = require('gulp-cache'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    gulpifelse = require('gulp-if-else'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    prefix = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    cleanCss = require('gulp-clean-css'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    minifyHtml = require('gulp-minify-html'),
    runCmd = require('gulp-run'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    defineModule = require('gulp-define-module'),
    declare = require('gulp-declare'),
    handlebars = require('gulp-handlebars'),
    del = require('del'),
    express = require('express'),
    path = require('path'),
    opn = require('opn'),
    info = require('./package.json');

// Configuration

var Config = {
    port: 8080,
    livereload_port: 35729,
    cache: (typeof argv.cache !== 'undefined' ? !!argv.cache : false),
    imagemin: {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    },
    paths: {
        wp - content: {
            root: './wp-content',
            js: './wp-content/js',
            scss: './wp-content/scss',
            css: './wp-content/css',
            images: './wp-content/img',
            fonts: './wp-content/fonts',
            lib: './wp-content/lib',
            tmpl: './wp-content/tmpl',
            extra: [
                //'wp-content/foo/**/*',
                //'wp-content/bar/**/*'
            ]
        },
        build: {
            root: '../test/AWS-BitBucket',
            js: '../test/AWS-BitBucket/js',
            css: '../test/AWS-BitBucket/css',
            scss: '../test/AWS-BitBucket/scss',
            images: '../test/AWS-BitBucket/img',
            fonts: '../test/AWS-BitBucket/fonts',
            lib: '../test/AWS-BitBucket/lib',
            extra: [
                //'AWS-BitBucket/foo/',
                //'AWS-BitBucket/bar/'
            ]
        }
    }
}

// Tasks
// =====

// Styles
gulp.task('styles', function() {
    return gulp.src(Config.paths.wp - content.scss + '/index.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(prefix('last 2 version', '> 5%', 'safari 5', 'ie 8', 'ie 7', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(Config.paths.wp - content.css));
});







gulp.task('migrate', () => {
    return gulp.src(Config.paths.wp - content.root + '/**/*')
        .pipe(gulp.dest(Config.paths.build.root));
});


gulp.task('buildStyles', ['migrate'], () => {
    return gulp.src(Config.paths.build.scss + '/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(Config.paths.build.css));
});


gulp.task('cleanCSS', ['buildStyles'], () => {
    return gulp.src(Config.paths.build.css + '/*.css')
        .pipe(cleanCss({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(Config.paths.build.css));
});


gulp.task('uglifyJS', ['cleanCSS'], () => {
    return gulp.src(Config.paths.build.js + '/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(Config.paths.build.js));
});


gulp.task('replaceLocalhost', ['uglifyJS'], () => {

    // const htmlFilter = filter('**/*.html');
    const phpFilter = filter('**/*.php');

    return gulp.src(Config.paths.build.root + '/**/*')
        // .pipe(htmlFilter)
        // .pipe(replace('customized-filed-here', 'http://fj-sg.nativesdev.com.au'))
        // .pipe(concat('bundle.js'))
        // .pipe(htmlFilter.restore)
        .pipe(phpFilter)
        .pipe(replace('http://localhost', 'http://fj-sg.nativesdev.com.au'))
        // .pipe(phpFilter.restore)
        .pipe(gulp.dest(Config.paths.build.root));
});


gulp.task('createDbupdateFolder', () => {
    return runCmd('php function.php --uri=dbupdate/update/dev').exec()
        .pipe(gulp.dest(Config.paths.build.root));
});


gulp.task('build', ['replaceLocalhost']);










// Fonts
gulp.task('fonts:clean', function(next) {
    del(Config.paths.build.fonts + '/**', next);
});
gulp.task('fonts', ['fonts:clean'], function() {
    return gulp.src(Config.paths.wp - content.fonts + '/**/*')
        .pipe(gulp.dest(Config.paths.build.fonts + '/'));
});

// Images
gulp.task('images:clean', function(next) {
    del(Config.paths.build.images + '/**', next);
});
gulp.task('images', ['images:clean'], function() {
    return gulp.src(Config.paths.wp - content.images + '/**/*')
        .pipe(gulpifelse(
            Config.cache,
            function() {
                return cache(imagemin(Config.imagemin)) // if
            },
            function() {
                return imagemin(Config.imagemin) // else
            }
        ))
        .pipe(gulp.dest(Config.paths.build.images + '/'));
});

// Templates
gulp.task('templates', function() {
    // return gulp.src(Config.paths.wp-content.tmpl + '/**/*')
    //   .pipe(handlebars())
    //   .pipe(defineModule('plain'))
    //   .pipe(declare({
    //     namespace: 'tmpl'
    //   }))
    //   .pipe(concat('templates.js'))
    //   .pipe(gulp.dest(Config.paths.wp-content.js + '/'));
});

// HTML, JavaScript, CSS
gulp.task('html:clean', function(next) {
    del([Config.paths.build.root + '/**/*.html', Config.paths.build.root + '/**/*.css', Config.paths.build.root + '/**/*.js'], next);
});
gulp.task('html', ['html:clean'], function() {
    var jsFilter = filter('**/*.js'),
        cssFilter = filter('**/*.css'),
        htmlFilter = filter('**/*.html');

    var assets = useref.assets();

    return gulp.src([Config.paths.wp - content.root + '/**/*.html', '!' + Config.paths.wp - content.lib + '/**/*'])
        .pipe(assets)
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(htmlFilter)
        .pipe(minifyHtml())
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(Config.paths.build.root));
});

// Server
gulp.task('server', function() {
    var server = express()
        .use(express.static(path.resolve(Config.paths.wp - content.root)))
        .listen(Config.port);
    gutil.log('Server listening on port ' + Config.port);
});

// LiveReload
gulp.task('livereload', function() {
    livereload.listen(Config.livereload_port, function(err) {
        if (err) gutil.log('Livereload error:', err);
    })
});

// Watches
gulp.task('watch', function() {
    watch(Config.paths.wp - content.scss + '/**/*.scss', function() {
        gulp.start('styles');
    });
    // watch(Config.paths.wp-content.tmpl + '/**/*.hbs', function() {
    //     gulp.start('templates');
    // });
    gulp.watch([
        Config.paths.wp - content.images + '/**/*.png',
        Config.paths.wp - content.images + '/**/*.jpg',
        Config.paths.wp - content.images + '/**/*.jpeg',
        Config.paths.wp - content.images + '/**/*.gif',
        Config.paths.wp - content.css + '/**/*.css',
        Config.paths.wp - content.js + '/**/*.js',
        Config.paths.wp - content.root + '/**/*.html'
    ], function(evt) {
        livereload.changed(evt.path);
    });
});

gulp.task('clear', function(done) {
    return cache.clearAll(done);
});


gulp.task('clean', ['fonts:clean', 'images:clean', 'html:clean', 'extra:clean']);

gulp.task('default', ['server', 'livereload', 'templates', 'styles', 'watch'], function() {
    if (argv.o) opn('http://localhost:' + Config.port);
});