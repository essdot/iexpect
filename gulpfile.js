var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
	gulp.src('./min', { read: false })
		.pipe(clean());
});

gulp.task('prepare-spec', function() {
	gulp.src('test/iexpect-spec.js')
		.pipe(browserify())
		.pipe(rename('iexpect-spec.browserified.js'))
		.pipe(gulp.dest('./min'));
});

gulp.task('prepare-iexpect', function() {
	gulp.src('app/iexpect.js')
		.pipe(browserify())
		.pipe(uglify())
		.pipe(rename('iexpect.min.js'))
		.pipe(gulp.dest('./min'));
});

gulp.task('build', [ 'clean', 'prepare-iexpect', 'prepare-spec' ]);