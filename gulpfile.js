const webpack = require("webpack-stream");
const gulp = require("gulp");
const zip = require("gulp-zip");
const del = require("del");
const exists = require("path-exists").sync;
const merge = require("gulp-merge-json");
const ts = require("gulp-typescript");
const webExt = require("web-ext").default;

const extSourceDir = 'app'; //TODO: move under src or something to be consistent
const jsOutDir = 'build';
const outputDir = 'dist';
const packageName = 'raccoony';

gulp.task("clean", ["clean:source", "clean:dist"]);

gulp.task("clean:dist", () => {
    return del([`${outputDir}/ext/`].concat(['chrome', 'firefox'].map(d => `${outputDir}/ext_${d}`)));
});

gulp.task("clean:source", () => {
    return del([jsOutDir])
})

gulp.task("copy_ext", ["clean"], () => {
    // TODO: figure out how to get the typings to work when including browser-polyfill as a module
    // TODO: upgrade browser-polyfill and web-ext-typings
    return gulp.src(["src/**", "node_modules/webextension-polyfill/dist/browser-polyfill.js"])
        .pipe(gulp.dest(`${outputDir}/ext/`));
});

gulp.task("typescript:compile", ["clean"], () => {
    // TODO: figure out how to get source maps to work
    // https://github.com/ivogabe/gulp-typescript
    var failed = false;
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src([`${extSourceDir}/**/*.ts`, `${extSourceDir}/**/*.tsx`])
        .pipe(tsProject())
        .on("error", function () { failed = true; })
        .on("finish", function () { failed && process.exit(1); });

    return tsResult.js.pipe(gulp.dest(`${jsOutDir}/`));
})

function autopack(filename) {
    return gulp.src([`${jsOutDir}/${filename}`])
        .pipe(webpack({
            "output": { filename }
        }))
        .pipe(gulp.dest(`${outputDir}/ext/`));
}

gulp.task("pack_ext:inject", ["typescript:compile"], () => autopack("page_inject.js"));
gulp.task("pack_ext:background", ["typescript:compile"], () => autopack("background.js"));
gulp.task("pack_ext:options", ["typescript:compile"], () => autopack("options.js"));
gulp.task("pack_ext:context_inject", ["typescript:compile"], () => autopack("contextMenuInject.js"));
gulp.task("pack_ext", ["pack_ext:inject", "pack_ext:background", "pack_ext:options", "pack_ext:context_inject"]);


function createTasksForPlatform(platform) {
    const platformDir = `ext_${platform}`;
    gulp.task(`pack_manifest:${platform}`, ["clean"], () => {
        return gulp.src(["manifest/manifest.json", `manifest/${platform}.json`])
            .pipe(merge({
                "fileName": "manifest.json"
            }))
            .pipe(gulp.dest(`${outputDir}/${platformDir}/`));
    });

    gulp.task(`copy_final:${platform}`, ["copy_ext", "pack_ext"], () => {
        return gulp.src(`${outputDir}/ext/**`)
            .pipe(gulp.dest(`${outputDir}/${platformDir}/`));
    });

    gulp.task(`zip_ext:${platform}`, [`copy_final:${platform}`, `pack_manifest:${platform}`], () => {
        return gulp.src(`${outputDir}/${platformDir}/**`)
            .pipe(zip(`${packageName}_${platform}.zip`))
            .pipe(gulp.dest(outputDir));
    });

    gulp.task(`build:${platform}`, [`zip_ext:${platform}`]);
}

createTasksForPlatform("chrome");
createTasksForPlatform("firefox");
gulp.task("build", ["build:chrome", "build:firefox"]);

gulp.task("sign", ["build"], () => {
    webExt.cmd.sign(
        {
            sourceDir: `${outputDir}/ext_firefox`,
            artifactsDir: `${outputDir}`,
            apiKey: process.env.AMO_USER,
            apiSecret: process.env.AMO_SECRET,
        },
        {
            shouldExitProgram: false
        })
        .then((extensionRunner) => {
            console.log(extensionRunner);
        }).catch((error) => {
            throw error;
        });
});

// Default task

gulp.task("default", ["build"]);

