var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var envT = require('habitrpg/src/middleware').enTranslations;

var paths = {
  sass:   ['./styles/**/*.scss'],
  stylus:   ['./styles/**/*.styl'],
  views:  ['./views/**/*.jade'],
  scripts: [ // TODO a **/* with excludes
    'www/bower_components/ionic/js/ionic.bundle.js',
    'www/bower_components/habitrpg-shared/dist/habitrpg-shared.js',
    'www/bower_components/angular-sanitize/angular-sanitize.js',
    'www/bower_components/js-emoji/emoji.js',
    'www/bower_components/marked/lib/marked.js',

    'scripts/app.js',
    'www/bower_components/habitrpg-shared/script/userServices.js',
    'www/bower_components/habitrpg-shared/script/directives.js',
    'scripts/services/authServices.js',
    'scripts/services/notificationServices.js',
    'scripts/controllers/userAvatarCtrl.js',
    'scripts/controllers/rootCtrl.js',
    'scripts/controllers/settingsCtrl.js',
    'scripts/filters/filters.js',
    'scripts/controllers/authCtrl.js',
    'scripts/controllers/tasksCtrl.js'
  ]
};
var dist = './www';

gulp.task('sass', function() {
  gulp.src('./styles/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest(dist+'/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(dist+'/css/'))
    .pipe(connect.reload())
});

gulp.task('stylus', function () {
  gulp.src('./styles/app.styl')
    .pipe(stylus({errors: true}))
    .pipe(gulp.dest(dist+'/css/'))
    .pipe(connect.reload())
});

gulp.task('views', function(){
  gulp.src('./views/index.jade')
    //.pipe(jade())
    // TODO: use actual env.t() function with translations
    .pipe(jade({locals:{env:{t:envT}}}))
    .pipe(gulp.dest(dist))
    .pipe(rename({extname: '.html'}))
    .pipe(connect.reload())
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    //.pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('www/js'));
    connect.reload()
});

gulp.task('connect', function() {
  connect.server({
    root: dist,
    livereload: true,
    port: 9000
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.stylus, ['stylus']);
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['sass','stylus','views','scripts','connect','watch']);