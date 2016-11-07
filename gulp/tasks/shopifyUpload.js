var gulp        = require('gulp');
var watch       = require('gulp-watch');
var gulpShopify = require('gulp-shopify-upload');

gulp.task('shopifywatch', function()
{
  return watch('../shopify-theme/+(assets|layout|config|snippets|templates|locales)/**')
    .pipe(gulpShopify('API KEY', 'PASSWORD', 'MYSITE.myshopify.com', 'THEME ID'));
});