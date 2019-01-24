//Gulp Packages
const gulp = require('gulp');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const typescript = require("gulp-typescript");
const tslint = require("gulp-tslint");
const sourcemaps = require('gulp-sourcemaps');

const tsProject = typescript.createProject('tsconfig.json');


//Global Variables
var production = false;

//Path Definitions
const paths = {
    scripts: {
        src: "src/**/*.ts",
        dest: "dist"
    }
}

//Internal Tasks
function cleanDist() {
    return gulp.src('dist/*')
        .pipe(clean())
}

function scripts () {
	return gulp.src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tsProject())
		.pipe(tslint.report())
		.pipe(sourcemaps.write("../dist"))
		.pipe(gulp.dest(paths.scripts.dest));
}

//External Tasks
gulp.task("default",
	gulp.series(cleanDist, gulp.parallel(scripts))
);

gulp.task('production', gulp.series((done) => { production = true; done(); }, 'default'));

gulp.task("serve", gulp.series('default', () => {
	nodemon({
		script: "dist/app.js",
		ext: "js",
		env: { "NODE_ENV": "development" }
	})
	gulp.watch(paths.scripts.src,  gulp.series(scripts));
}));