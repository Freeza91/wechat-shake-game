// npm i gulp gulp-clean gulp-concat gulp-rename --save
// npm i gulp-minify-css gulp-uglify imagemin-pngquant gulp-imagemin --save
// npm i gulp-livereload  gulp-notify gulp-sourcemaps --save

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['clean'], function() {
    gulp.start('javascripts', 'stylesheets', 'images');
});

gulp.task('clean', function(){
  gulp.src(['public'], { read: false })
      .pipe(clean());
});

// must be first place
libs_js_path = [
  'vendor/javascripts/**/*.js',
  'vendor/javascripts/**/*.coffee'
]
my_js_path = [
  'assets/javascripts/**/*.js',
  'assets/javascripts/**/*.coffee'
]
//javascripts
gulp.task('javascripts', function(){
  gulp.src(libs_js_path.concat(my_js_path))
      .pipe(sourcemaps.init())
        .pipe(concat('application.js'))
      .pipe(gulp.dest('public/javascripts'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/javascripts'));
});

// must be first place
libs_css_path = [
  'vendor/stylesheets/**/*.css',
  'vendor/stylesheets/**/*.scss',
  'vendor/stylesheets/**/*.sass'
]
my_css_path = [
  'assets/stylesheets/**/*.css',
  'assets/stylesheets/**/*.scss',
  'assets/stylesheets/**/*.sass'
]
// stylesheets
gulp.task('stylesheets', function(){
  gulp.src(libs_css_path.concat(my_css_path))
      .pipe(sourcemaps.init())
      .pipe(concat('application.css'))
      // .pine(sass({ style: 'expanded'})) sass = require('gulp-sass')
      .pipe(gulp.dest('public/stylesheets'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifyCss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/stylesheets'));
});

// images
gulp.task('images', function(){
  gulp.src(['assets/images/**/*'])
      .pipe(imagemin({
              progressive: true,
              svgoPlugins: [{ removeViewBox: false }],
              use: [pngquant()]}))
      .pipe(gulp.dest('public/images'));

})

// livereload

gulp.task('watch', function() {

  livereload.listen();

  gulp.watch(['assets/javascripts/**/*.js','assets/javascripts/**/*.coffee'],
             ['javascripts']);

  gulp.watch(['assets/stylesheets/**/*.css', 'assets/stylesheets/**/*.scss',
              'assets/stylesheets/**/*.sass'],
             ['stylesheets']);

  gulp.watch('assets/images/**/*', ['images']);

});