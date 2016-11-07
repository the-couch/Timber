/*
  gulpfile.js
  ===========
*/


var gulp          = require('gulp'),
    uglify        = require('gulp-uglify'),
    react         = require('gulp-react'),
    source        = require('vinyl-source-stream'),
    browserify    = require('browserify'),
    watchify      = require('watchify'),
    reactify      = require('reactify'),
    streamify     = require('gulp-streamify'),
    gulpUtil      = require('gulp-util'),
    livereload    = require('gulp-livereload'),
    concat        = require('gulp-concat'),
    sass          = require('gulp-sass'),
    ignore        = require('gulp-ignore'),
    del           = require('del'),
    watch         = require('gulp-watch'),
    runSequence   = require('run-sequence'),
    webpack       = require('webpack'),
    strip         = require('gulp-strip-comments'),
    gulpWebpack   = require('webpack-stream'),
    gulpShopify   = require('gulp-shopify-upload'),
    source        = require('vinyl-source-stream'),
    sourcemaps    = require('gulp-sourcemaps'),
    htmlreplace   = require('gulp-html-replace'),
    autoprefixer  = require('gulp-autoprefixer'),
    neat          = require('node-neat').includePaths,
    config        = require('./config').sass,
    settings      = require('./settings').shopify;

var path = {
  ALL: ['lib/scss/*.{sass,scss}', 'lib/scss/**/*.{sass,scss}'],
  JS: ['lib/js/app.js', 'lib/js/**/*.js', 'lib/js/**/**/*.js'],
  SASS: ['lib/scss/*.{sass,scss}', 'lib/scss/**/*.{sass,scss}'],
  MINIFIED_OUT: 'build.min.js',
  DEST_lib: 'dist/lib',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'shopify-theme/assets',
  DEST: 'dist',
  OUT: 'build.js',
  ENTRY_POINT: './lib/js/app.js'
};

function handleError( task ) {
    return function ( err ) {
        this.emit( 'end' );
        gulpUtil.log( 'Error handler for', task, err.toString() );
    };
}

gulp.task('shopifywatch', function()
{
  var options = {
    "basePath": "./"
  };

  return watch('./+(assets|layout|config|snippets|templates|locales)/**')
    .pipe(gulpShopify(settings.api, settings.password, settings.url, null, options));
});

gulp.task('livereload', function() {
  livereload.listen();
});

gulp.task('transform', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('sass', function (){
  gulp.src(config.src)
    .pipe(sass(
        config.settings
    ))
    .on('error', sass.logError)
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest(config.dest))
    .pipe(livereload())
});

gulp.task('watch', function(){
  gulp.watch(path.ALL, ['sass']);

  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  gulp.watch(path.JS, ['build']);

  return watcher.on('update', function() {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC))
      .pipe(livereload())
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC))
    .pipe(livereload());

});

gulp.task( 'webpack:build', function () {
    return gulp.src( './lib/js/app.js' )
        .pipe( gulpWebpack( require( './webpack.prod.js' ), webpack ).on('error', gulpUtil.log) )
        .pipe( gulp.dest( 'assets' ) );
} );


gulp.task('build', function(callback) {
	runSequence('clean', 'webpack:build', callback);
});

gulp.task('clean', function(cb) {
  del(['./assets/js/app.compiled.js','./assets/js/vendor.js'], cb)
});

gulp.task('deploy', ['build'], function() {
  var options = {
    "basePath": "./"
  };
  return gulp.src('./+(assets|layout|config|snippets|templates|locales)/**')
    .pipe(gulpShopify(settings.api, settings.password, settings.url, null, options));
});


gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('default', ['watch', 'livereload', 'shopifywatch']);

gulp.task('production', [ 'build', 'deploy']);
