const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');


// Images
const imagemin = require('gulp-imagemin');
const pictureHTML = require("gulp-picture-html")
const webp = require('gulp-webp');


gulp.task('clean:docs', function (done) {
	if (fs.existsSync('./docs/')) {
		return gulp
			.src('./docs/', { read: false })
			.pipe(clean({ force: true }));
	}
	done();
});

const fileIncludeSetting = {
	prefix: '@@',
	basepath: '@file',
};

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

gulp.task('html:docs', function () {
	return (
		gulp
			.src(['./src/index.html', '!./src/html/blocks/*.html'])
			.pipe(changed('./docs/', { hasChanged: changed.compareContents }))
			.pipe(plumber(plumberNotify('HTML')))
			.pipe(fileInclude(fileIncludeSetting))
			.pipe(pictureHTML(     
				options= // below default
				{
				  extensions : ['.jpg'], // image file extensions for which we create 'picture'
				  source : ['.webp'], // create 'source' with these formats   
				  noPicture : ['no-sourse'],  // if we find this class for the 'img' tag, then we don't create a 'picture' (multiple classes can be set)
				  noPictureDel : false // if 'true' remove classes for 'img' tag given in 'noSource:[]'
				}
			  ))
			.pipe(gulp.dest('./docs/'))
	);
});

gulp.task('sass:docs', function () {
	return gulp
		.src('./src/sass/*.sass')
		.pipe(changed('./docs/css/'))
		.pipe(plumber(plumberNotify('SASS')))
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(groupMedia())
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./docs/css/'))
});

gulp.task('images:docs', function () {
	return gulp
		.src('./src/assets/images/**/*')
		.pipe(changed('./docs/assets/images/'))
		.pipe(webp())
		.pipe(gulp.dest('./docs/assets/images/'))
		.pipe(gulp.src('./src/assets/images/**/*'))
		.pipe(changed('./docs/assets/images/'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./docs/assets/images/'));
});

gulp.task('fonts:docs', function () {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(changed('./docs/fonts/'))
		.pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function () {
	return gulp
		.src('./src/files/**/*')
		.pipe(changed('./docs/files/'))
		.pipe(gulp.dest('./docs/files/'));
});

gulp.task('js:docs', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./docs/js/'))
		.pipe(plumber(plumberNotify('JS')))
		.pipe(babel())
		.pipe(webpack(require('../webpack.config.js')))
		.pipe(gulp.dest('./docs/js/'));
});

const serverOptions = {
	livereload: true,
	open: true,
};

gulp.task('server:docs', function () {
	return gulp.src('./docs/').pipe(server(serverOptions));
});
