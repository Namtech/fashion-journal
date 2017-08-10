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
    zip = require('gulp-zip'),
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
        src: {
            root: './webpackage/wp-content',
            extra: [
                //'src/foo/**/*',
                //'src/bar/**/*'
            ]
        },
        build: {
            root: './wp-content',
            extra: [
                //'AWS-BitBucket/foo/',
                //'AWS-BitBucket/bar/'
            ]
        }
    }
}








gulp.task('migrate', () => {
    return gulp.src(Config.paths.src.root + '/**/*')
        .pipe(gulp.dest(Config.paths.build.root));
});

gulp.task('migrateAfterBuild', () => {
    return gulp.src('./**/*')
        .pipe(gulp.dest('./build'));
});

gulp.task('buildSCSS', ['migrate'], () => {
    return gulp.src(Config.paths.build.root + '/**/*/main.scss')
        .pipe(sass({
            errLogToConsole: true,
        }))
        .pipe(gulp.dest(Config.paths.build.root));
});


gulp.task('cleanCSS', ['buildSCSS'], () => {
    return gulp.src(Config.paths.build.root + '/**/*.css')
        .pipe(cleanCss({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(Config.paths.build.root));
});


gulp.task('uglifyJS', ['cleanCSS'], () => {
    return gulp.src(Config.paths.build.root + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(Config.paths.build.root));
});

gulp.task('replacePHP_dev', () => {
    // const htmlFilter = filter('**/*.html');
    const phpFilter = filter('**/*.php');
    return gulp.src(Config.paths.build.root + '/**/*')
        // .pipe(htmlFilter)
        // .pipe(replace('customized-filed-here', 'http://fj-sg.nativesdev.com.au'))
        // .pipe(concat('bundle.js'))
        // .pipe(htmlFilter.restore)
        .pipe(phpFilter)
        // .pipe(replace('http://fj-dev.nativesdev.com.au', 'http://localhost'))
        .pipe(replace('http://localhost', 'http://fj-dev.nativesdev.com.au'))
        // .pipe(phpFilter.restore)
        .pipe(gulp.dest(Config.paths.build.root));
});

gulp.task('replaceSQL_dev', () => {
    // const htmlFilter = filter('**/*.html');
    const sqlFilter = filter('**/*.sql');
    return gulp.src('./wp-db/fashionJournalDb.sql')
        // .pipe(htmlFilter)
        // .pipe(replace('customized-filed-here', 'http://fj-sg.nativesdev.com.au'))
        // .pipe(concat('bundle.js'))
        // .pipe(htmlFilter.restore)
        // .pipe(sqlFilter)
        // .pipe(replace('http://fj-dev.nativesdev.com.au', 'http://localhost'))
        .pipe(replace('http://localhost', 'http://fj-dev.nativesdev.com.au'))
        // .pipe(phpFilter.restore)
        .pipe(gulp.dest('./wp-db'));
});

gulp.task('exportSQL', () => {
    return runCmd('cd wp-db & mysqldump -u root wordpress > fashionJournalDb.sql').exec();
});

gulp.task('initSQL', () => {
    return runCmd('cd wp-db & mysql -u root wordpress < fashionJournalDb.sql').exec();
});

// MOTHER LEVEL

gulp.task('clear', () => {
    del([Config.paths.build.root + '/**/*'], { force: true }).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });;
});

gulp.task('compile', ['uglifyJS']);

gulp.task('export', ['exportSQL']);

gulp.task('init', ['initSQL']);

gulp.task('replace-dev', ['replacePHP_dev', 'replaceSQL_dev']);




// AWS SERVER TASKS


gulp.task('deploy', ['replaceLocalhost']);

gulp.task('zip', () => {
    gulp.src('./*')
        .pipe(zip('my-app.zip'))
        .pipe(gulp.dest('./build'));
});


// // Images
// gulp.task('images:clean', function(next) {
//     del(Config.paths.build.images + '/**', next);
// });
// gulp.task('images', ['images:clean'], function() {
//     return gulp.src(Config.paths.src.images + '/**/*')
//         .pipe(gulpifelse(
//             Config.cache,
//             function() {
//                 return cache(imagemin(Config.imagemin)) // if
//             },
//             function() {
//                 return imagemin(Config.imagemin) // else
//             }
//         ))
//         .pipe(gulp.dest(Config.paths.build.images + '/'));
// });

// // Templates
// gulp.task('templates', function() {
//     // return gulp.src(Config.paths.src.tmpl + '/**/*')
//     //   .pipe(handlebars())
//     //   .pipe(defineModule('plain'))
//     //   .pipe(declare({
//     //     namespace: 'tmpl'
//     //   }))
//     //   .pipe(concat('templates.js'))
//     //   .pipe(gulp.dest(Config.paths.src.js + '/'));
// });

// // HTML, JavaScript, CSS
// gulp.task('html:clean', function(next) {
//     del([Config.paths.build.root + '/**/*.html', Config.paths.build.root + '/**/*.css', Config.paths.build.root + '/**/*.js'], next);
// });
gulp.task('html', ['html:clean'], function() {
    var jsFilter = filter('**/*.js'),
        cssFilter = filter('**/*.css'),
        htmlFilter = filter('**/*.html');

    var assets = useref.assets();

    return gulp.src([Config.paths.src.root + '/**/*.html', '!' + Config.paths.src.lib + '/**/*'])
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
// gulp.task('server', function() {
//     var server = express()
//         .use(express.static(path.resolve(Config.paths.src.root)))
//         .listen(Config.port);
//     gutil.log('Server listening on port ' + Config.port);
// });

// LiveReload
gulp.task('livereload', function() {
    livereload.listen(Config.livereload_port, function(err) {
        if (err) gutil.log('Livereload error:', err);
    })
});

// Watches
gulp.task('watch', function() {
    watch(Config.paths.src.scss + '/**/*.scss', function() {
        gulp.start('styles');
    });
    // watch(Config.paths.src.tmpl + '/**/*.hbs', function() {
    //     gulp.start('templates');
    // });
    gulp.watch([
        Config.paths.src.images + '/**/*.png',
        Config.paths.src.images + '/**/*.jpg',
        Config.paths.src.images + '/**/*.jpeg',
        Config.paths.src.images + '/**/*.gif',
        Config.paths.src.css + '/**/*.css',
        Config.paths.src.js + '/**/*.js',
        Config.paths.src.root + '/**/*.html'
    ], function(evt) {
        livereload.changed(evt.path);
    });
});

// gulp.task('clear', function(done) {
//     return cache.clearAll(done);
// });


// gulp.task('clean', ['fonts:clean', 'images:clean', 'html:clean', 'extra:clean']);

// gulp.task('default', ['server', 'livereload', 'templates', 'styles', 'watch'], function() {
//     if (argv.o) opn('http://localhost:' + Config.port);
// });