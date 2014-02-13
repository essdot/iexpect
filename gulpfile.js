var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var paths = {
	outputDir: 'min',
	specs: [ 'test/iexpect-spec.js' ],
	iexpectModule: 'app/iexpect.js',
};

gulp.task('clean', function() {
	gulp.src(paths.outputDir, { read: false })
		.pipe(clean());
});

gulp.task('prepare-spec', function() {
	gulp.src(paths.specs)
		.pipe(browserify())
		.pipe(rename('iexpect-spec.browserified.js'))
		.pipe(gulp.dest(paths.outputDir));
});

gulp.task('prepare-iexpect-standalone', function() {
	gulp.src(paths.iexpectModule)
		.pipe(browserify({ standalone: 'iexpect' }))
		.pipe(uglify())
		.pipe(rename('iexpect.min.js'))
		.pipe(gulp.dest(paths.outputDir));
});

gulp.task('build', [ 'clean', 'prepare-iexpect-standalone', 'prepare-spec' ]);