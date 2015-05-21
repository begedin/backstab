/*global require*/

var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(sourceMaps.init())
    .pipe(babel())
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('tmp'));
});