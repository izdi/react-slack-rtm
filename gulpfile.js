var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify', function() {
    gulp.src('frontend/app.js')
        .pipe(browserify({transform: 'reactify'}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('static/dist/js'));
});

gulp.task('default', ['browserify']);

gulp.task('watch', function () {
    gulp.watch('frontend/**/*.*', ['default']);
});