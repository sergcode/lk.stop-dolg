const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browsersync = require('browser-sync');
const minify = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const jsminify = require("gulp-minify");
const replace = require('gulp-replace');
const babel = require("gulp-babel");

const dist = "./dist";

try {

	gulp.task("less", () => {
		return gulp.src("./src/less/style.less")
				.pipe(plumber())
				.pipe(sourcemaps.init())
				.pipe(less())
				.pipe(postcss([autoprefixer()]))
				.pipe(sourcemaps.write("../css"))
				.pipe(gulp.dest(dist + "/assets/css"))
				.pipe(browsersync.stream());
	});

	gulp.task("less:minify", () => {
		return gulp.src("./src/less/style.less")
				.pipe(plumber())
				.pipe(sourcemaps.init())
				.pipe(less())
				.pipe(postcss([autoprefixer()]))
				.pipe(gulp.dest(dist + "/assets/css"))
				.pipe(minify())
				.pipe(rename("style.min.css"))
				.pipe(sourcemaps.write("../css"))
				.pipe(gulp.dest(dist + "/assets/css"))
				.pipe(browsersync.stream());
	});

	gulp.task("serve", () => {
		browsersync.init({
			server: "./dist/",
			injectChanges: true,
			open: true,
			notify: true
		});

		gulp.watch("./src/less/**/*.less", gulp.series("less"));
		gulp.watch("./src/*.html", gulp.series("copy:html", "include"));
		gulp.watch("./src/sections/*.html", gulp.series("copy:html", "include"));
		gulp.watch("./src/images/**/*.{png,jpg,svg,gif}", gulp.series("images"));
		gulp.watch("./src/projects/**/*", gulp.series("copy:projects"));
		gulp.watch("./src/*.html").on("change", browsersync.reload);
		gulp.watch("./src/js/**/*.js", gulp.series("babel")).on("change", browsersync.reload);
	});

	gulp.task("images", () => {
		return gulp.src("./src/images/**/*.{png,jpg,svg,gif}")
				.pipe(
						imagemin([
							imagemin.optipng({
								optimizationLevel: 3
							}),
							imagemin.jpegtran({
								progressive: true
							}),
							imagemin.svgo({
								plugins: [{
									convertShapeToPath: false
								},
									{
										cleanupIDs: true
									},
									{
										removeStyleElement: false
									}
								]
							})
						])
				)
				.pipe(gulp.dest(dist + "/assets/images"));
	});

	gulp.task("include", () => {
		return gulp.src("./src/*.html")
				.pipe(posthtml([include()]))
				.pipe(gulp.dest(dist));
	});

	gulp.task("babel", () => {
		return gulp.src("./src/js/**/*.js")
				.pipe(babel())
				.pipe(gulp.dest(dist + "/assets/js"));
	});

	gulp.task('jsminify', () => {
		return gulp.src('./src/js/**/*.js')
				.pipe(jsminify({
					ext: {
						min: '.min.js'
					},
					exclude: ['tasks'],
					ignoreFiles: ['*.min.js', 'chartdata.js']
				}))
				.pipe(gulp.dest(dist + '/assets/js'));
	});

	gulp.task("deploy-html", function() {
		return gulp.src(dist + "/*.html")
				.pipe(replace('.css', '.min.css'))
				.pipe(replace('.min.min.css', '.min.css'))
				.pipe(replace('.js', '.min.js'))
				.pipe(replace('.min.min.js', '.min.js'))
				.pipe(gulp.dest(dist));
	});

	gulp.task("copy", () => {
		return gulp.src(
				[
					"./src/fonts/**/*.{woff,woff2}",
					"./src/docs/**/*.{pdf,docx,doc}",
					"./src/images/**/*.{json,xml}",
					"./src/css/**/*.css",
					"./src/projects/**/*",
				],
				{
					base: "./src"
				}
		)
				.pipe(gulp.dest(dist + '/assets/'));
	});

	gulp.task("php", () => {
		return gulp.src (
				"./src/*.php",
			{
				base: "./src"
			}
		)
		.pipe(gulp.dest(dist));

	});

	gulp.task("copy:html", () => {
		return gulp.src("./src/*.html", {
			base: "./src"
		})
				.pipe(gulp.dest(dist));
	});

	gulp.task("copy:images", () => {
		return gulp.src("./src/images/**/*.{png,jpg,svg,gif}", {
			base: "./src"
		})
				.pipe(gulp.dest(dist + "/assets/"));
	});

	gulp.task("copy:projects", () => {
		return gulp.src("./src/projects/**/*", {
			base: "./src"
		})
				.pipe(gulp.dest(dist + "/assets/"));
	});

	gulp.task("copy:favicon", () => {
		return gulp.src("./src/images/**/*.ico", {
			base: "./src"
		})
				.pipe(rename({dirname: ''}))
				.pipe(gulp.dest(dist));
	});

	gulp.task("clean", () => {
		return del(dist, {
			force: true
		});
	});

	gulp.task(
			"build",
			gulp.series(
					"clean",
					"copy",
					"copy:favicon",
					"php",
					"less",
					"less:minify",
					"images",
					"jsminify",
					"include",
					"deploy-html",
					"babel"
			)
	);

	gulp.task("build-js", gulp.series("clean", "jsminify", "babel"));

	gulp.task("build-less", gulp.series("clean", "less", "less:minify"));

	gulp.task(
			"default",
			gulp.series(
					"clean",
					"copy",
					"copy:favicon",
					"php",
					"less",
					"images",
					"include",
					"babel",
					"serve"
			)
	);
} catch (error) {
	console.log(error);
}
