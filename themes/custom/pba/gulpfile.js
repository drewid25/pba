import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import livereload from "gulp-livereload";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
import wait from "gulp-wait";
import stripCssComments from "gulp-strip-css-comments";
import cssmin from "gulp-cssmin";
import rename from "gulp-rename";
const sass = gulpSass(dartSass);
import cleanCSS from "gulp-clean-css";
// Define paths
const paths = {
  styles: {
    src: "./src/sass/**/*.scss",
    dest: "./css/",
  },
  scripts: {
    src: "js/*.js",
    dest: "js_min",
  },
};

// Compile Sass to CSS
export function compileSass() {
  return gulp
    .src(paths.styles.src)
    .pipe(wait(1500))
    .pipe(plumber())

    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError)) // Use Dart Sass compiler
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
      })
    )
    .pipe(stripCssComments({ preserve: false }))
    .pipe(cssmin())
    .pipe(cleanCSS())
    .pipe(rename("styles.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(livereload());
}

// Uglify JS
export function uglifyJS() {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      uglify().on("error", function (e) {
        console.log(e);
      })
    )
    .pipe(gulp.dest(paths.scripts.dest));
}

// Watch task
export function watch() {
  livereload.listen();
  gulp.watch(paths.styles.src, compileSass);
  gulp.watch(paths.scripts.src, uglifyJS);
}

// Default task
export default gulp.series(gulp.parallel(compileSass, uglifyJS), watch);
