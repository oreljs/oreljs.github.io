'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var pug = require('gulp-pug');
var notify = require("gulp-notify");
var rimraf = require('rimraf');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var webp = require("gulp-webp");
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var liveServer = require('live-server');

var path = {
		build: {
				html: 'dev/',
				css: 'dev/styles/',
				img: 'dev/img/'
		},
		prod:  {
				html: '.',
				css: 'styles/',
				img: 'img/'
		},
		src: {
				pug: 'src/pug/*.pug',
				sass: 'src/sass/*.sass',
				img: 'src/img/**/*.*'
		},
		webp: {
				inc: 'src/img/**/*.{jpg,jpeg,png}',
				exl: '!src/img/unused/*'
		},
		watch: {
				pug: 'src/pug/**/*.pug',
				styles: 'src/sass/**/*.*ss',
				img: 'src/img/**/*.*'
		}
};
var serverParams = {
	port: 4000,
	host: "0.0.0.0",
	root: "./dev/",
	watch: "src/"
};

gulp.task('sass:prod', function () {
		gulp.src(path.src.sass)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ browsers: ['last 2 versions'] }))
		.pipe(csso())
		.pipe(gulp.dest(path.prod.css))
});
gulp.task('pug:prod', function () {
		gulp.src(path.src.pug)
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(pug())
				.pipe(gulp.dest(path.prod.html))
});
gulp.task('image:prod', function () {
		gulp.src(path.src.img)
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(changed(path.prod.img))
				.pipe(imagemin({
						progressive: true,
						svgoPlugins: [{removeViewBox: false}],
						interlaced: true
				}))
				.pipe(gulp.dest(path.prod.img))
});
gulp.task('webp:prod', function () {
		gulp.src([path.webp.inc, path.webp.exl])
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(changed(path.prod.img))
				.pipe(webp({quality: 65}))
				.pipe(gulp.dest(path.prod.img))
});

gulp.task('sass:build', function () {
		gulp.src(path.src.sass)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ browsers: ['last 2 versions'] }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
});
gulp.task('pug:build', function () {
		gulp.src(path.src.pug)
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(pug({pretty: true}))
				.pipe(gulp.dest(path.build.html))
});
gulp.task('image:build', function () {
		gulp.src(path.src.img)
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(changed(path.build.img))
				.pipe(imagemin({
						progressive: true,
						svgoPlugins: [{removeViewBox: false}],
						interlaced: true
				}))
				.pipe(gulp.dest(path.build.img))
});
gulp.task('webp:build', function () {
		gulp.src([path.webp.inc, path.webp.exl])
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(changed(path.src.img))
				.pipe(webp({quality: 65}))
				.pipe(gulp.dest(path.build.img))
});

gulp.task('build', [
		'pug:build',
		'sass:build',
		'image:build',
		'webp:build'
]);
gulp.task('prod', [
		'pug:prod',
		'sass:prod',
		'image:prod',
		'webp:prod'
]);
gulp.task('watch', function(){
		liveServer.start(serverParams);
		watch([path.watch.pug], function(event, cb) {
				gulp.start('pug:build');
		});
		watch([path.watch.styles], function(event, cb) {
				gulp.start('sass:build');
		 });
		watch([path.watch.img], function(event, cb) {
				gulp.start('image:build');
		});
		watch([path.watch.img], function(event, cb) {
				gulp.start('webp:build');
		});
});

gulp.task('default', ['build', 'watch']);
