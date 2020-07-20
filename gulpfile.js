"use strict";

// Load plugins

const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const del = require("del");

// const cleanCSS = require("gulp-clean-css");
// const autoprefixer = require("gulp-autoprefixer");
// const header = require("gulp-header");
// const merge = require("merge-stream");
// const plumber = require("gulp-plumber");
// const rename = require("gulp-rename");
// const sass = require("gulp-sass");
// const uglify = require("gulp-uglify");

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Meatze - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' */\n',
  '\n'
].join('');

// // Bring third party dependencies from node_modules into vendor directory
// function modules() {
//   // Bootstrap JS
//   var bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/*')
//     .pipe(gulp.dest('./vendor/bootstrap/js'));
//   // Bootstrap SCSS
//   var bootstrapSCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
//     .pipe(gulp.dest('./vendor/bootstrap/scss'));
//   // ChartJS
//   var chartJS = gulp.src('./node_modules/chart.js/dist/*.js')
//     .pipe(gulp.dest('./vendor/chart.js'));
//   // dataTables
//   var dataTables = gulp.src([
//       './node_modules/datatables.net/js/*.js',
//       './node_modules/datatables.net-bs4/js/*.js',
//       './node_modules/datatables.net-bs4/css/*.css'
//     ])
//     .pipe(gulp.dest('./vendor/datatables'));
//   // Font Awesome
//   var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
//     .pipe(gulp.dest('./vendor'));
//   // jQuery Easing
//   var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
//     .pipe(gulp.dest('./vendor/jquery-easing'));
//   // jQuery
//   var jquery = gulp.src([
//       './node_modules/jquery/dist/*',
//       '!./node_modules/jquery/dist/core.js'
//     ])
//     .pipe(gulp.dest('./vendor/jquery'));
//   return merge(bootstrapJS, bootstrapSCSS, chartJS, dataTables, fontAwesome, jquery, jqueryEasing);
// }

// // CSS task
// function css() {
//   return gulp
//     .src("./scss/**/*.scss")
//     .pipe(plumber())
//     .pipe(sass({
//       outputStyle: "expanded",
//       includePaths: "./node_modules",
//     }))
//     .on("error", sass.logError)
//     .pipe(autoprefixer({
//       cascade: false
//     }))
//     .pipe(header(banner, {
//       pkg: pkg
//     }))
//     .pipe(gulp.dest("./css"))
//     .pipe(rename({
//       suffix: ".min"
//     }))
//     .pipe(cleanCSS())
//     .pipe(gulp.dest("./css"))
//     .pipe(browsersync.stream());
// }

// // JS task
// function js() {
//   return gulp
//     .src([
//       './js/*.js',
//       '!./js/*.min.js',
//     ])
//     .pipe(uglify())
//     .pipe(header(banner, {
//       pkg: pkg
//     }))
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest('./js'))
//     .pipe(browsersync.stream());
// }

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 8080
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Watch files
function watchFiles() {
  // gulp.watch("./scss/**/*", css);
  // gulp.watch(["./js/**/*", "!./js/**/*.min.js"], js);
  gulp.watch(["./**/*.html", "./**/*.js", "./**/*.css"], browserSyncReload);
}

// Define complex tasks
//const vendor = gulp.series(clean, modules);
//const build = gulp.series(vendor, gulp.parallel(css, js));
const build = clean;
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));



// Extension (CSS, )
// exports.css = css;
// exports.js = js;
// exports.vendor = vendor;

// Export tasks
// ------------
exports.build = build;
exports.clean = clean;
exports.watch = watch;
exports.default = build;
