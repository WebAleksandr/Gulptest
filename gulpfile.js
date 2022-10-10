const { src, dest, task, series, watch } = require('gulp');
const del = require("del");
const sass = require('gulp-sass')(require('sass'));
const less = require("gulp-less");
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const reload = browserSync.reload;



// ===================================Удаление папки Public=========================
task('clean', () => {
   return del(['public'])
});
// ===================================Задачи со Разметкой=========================

task('html', () => {
   return src(['src/*.html', '!' + 'src/_*.html'])
      // .pipe(fileinclude())
      // .pipe(cleanhtml())
      .pipe(dest('public'))
      .pipe(reload({ stream: true }));
});
// ===================================Задачи со Стилям=========================
const styles = [
   "!" + 'src/styles/main.less',
   'src/styles/main.scss',
   "!" + 'src/styles/main.styl',
   "!" + 'node_modules/normalize.css/normalize.css'
];
task('style', () => {
   return src(styles)
      .pipe(sourcemaps.init())
      .pipe(concat('main.less'))
      .pipe(sass.sync().on('error', sass.logError))
      // .pipe(less())
      // .pipe(stylus())
      .pipe(autoprefixer({
         cascade: false
      }))
      // .pipe(gcmq())
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(sourcemaps.write())
      .pipe(dest('public'))
      .pipe(reload({ stream: true }));
});
// ===================================Задачи со Скриптами=========================

const scripts = [
   'src/scripts/*.js',
   "!" + 'src/scripts/*.ts',
];
task('scripts', () => {
   return src(scripts)
      .pipe(sourcemaps.init())
      // .pipe(ts({
      //    noImplicitAny: true,
      //    outFile: 'main.min.js'
      // }))
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(sourcemaps.write())
      .pipe(dest('public'))
      .pipe(reload({ stream: true }));
});
// ===================================Задачи с Картинками=========================
task('images', () => {
   return src('src/images/**/*.{jpg,png,svg,gif,ico,webp}')
      .pipe(dest('public/images'));

});

// ===================================Задачи со Шрифтами=========================
task('fonts', () => {
   return src('src/fonts/**/*.{css,woff,woff2,ttf}')
      .pipe(dest('public/fonts'));
});
// ===================================Задачи для дополнительных файлов=========================
task('resources', () => {
   return src(('src/resources/**'))
      .pipe(dest('public/resources'))
});
// ===================================Сервер=========================
task('server', () => {
   browserSync.init({
      server: {
         baseDir: "./public"
      }
   });
});
// ===================================Слежка за задачами=========================
watch('./src/*.html', series('html'));
watch('./src/scripts/*.js', series('scripts'));
watch('./src/styles/**/*.scss', series('style'));
task("default", series('clean', 'html', 'style', 'scripts', 'images', 'fonts', 'resources', 'server'));