// npm i gulp gulp-clean gulp-concat gulp-rename --save
// npm i gulp-minify-css gulp-uglify imagemin-pngquant gulp-imagemin --save
// npm i gulp-livereload  gulp-notify --save

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    livereload = require('gulp-livereload');

gulp.task('default', ['clean'], function() {
    gulp.start('javascripts', 'stylesheets', 'images');
});

gulp.task('clean', function(){
  gulp.src(['public'], { read: false })
      .pipe(clean());
});

//javascripts
gulp.task('javascripts', function(){
  gulp.src(['assets/javascripts/**/*.js',
           'assets/javascripts/**/*.coffee'])
      .pipe(concat('application.js'))
      .pipe(gulp.dest('public/javascripts'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .on('error', notify.onError('Error: <%= error.message %>'))
      .pipe(gulp.dest('public/javascripts'))
      .pipe(notify({ message: 'Scripts task complete successfully' }));
});

// stylesheets
gulp.task('stylesheets', function(){
  gulp.src(['assets/stylesheets/**/*.css',
            'assets/stylesheets/**/*.scss',
            'assets/stylesheets/**/*.sass'])
      .pipe(concat('application.css'))
      // .pine(sass({ style: 'expanded'})) sass = require('gulp-sass')
      .pipe(gulp.dest('public/stylesheets'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifyCss())
      .on('error', notify.onError('Error: <%= error.message %>'))
      .pipe(gulp.dest('public/stylesheets'))
      .pipe(notify({ message: 'Stylesheets task complete successfully' }));
});

// images
gulp.task('images', function(){
  gulp.src(['assets/images/**/*'])
      .pipe(imagemin({
              progressive: true,
              svgoPlugins: [{ removeViewBox: false }],
              use: [pngquant()]}))
      .on('error', notify.onError('Error: <%= error.message %>'))
      .pipe(gulp.dest('public/images'))
      .pipe(notify({ message: 'Images task complete successfully' }));

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