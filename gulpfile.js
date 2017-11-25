const gulp=require('gulp');
const stylus=require('gulp-stylus');
const minifyCss=require('gulp-minify-css');
const del=require('del');
const gulpif=require('gulp-if');
const autoprefixer=require('gulp-autoprefixer');
const browser=require('browser-sync');

const babel=require('gulp-babel');
const preEs2015=require('babel-preset-es2015');
const preReact=require('babel-preset-react');
// const webpack=require('gulp-webpack');
const react=require('gulp-react');

const uglify=require('gulp-uglify')

// const browserify=require('browserify');
// const reactify=require('reactify');


const res={
  styles:['./styles/**/*.styl','!./styles/**/mixin.styl'],
  css:['./styles/**/*.css'],
  jsx:['./scripts/steam/src/*.jsx'],
};


// 打包stylus
gulp.task('stylusCss',()=>{
  console.log('转译Sylus中...');
  gulp.src(res.styles)
    // .pipe(del(css))
    .pipe(gulpif('!mixin.styl',stylus()))
    .pipe(autoprefixer('last 5 versions'))
    .pipe(minifyCss())
    .pipe(gulp.dest('styles')) 
    .pipe(browser.reload({
      stream:true
    })) 
  }
)

// 打包jsx
gulp.task('build',()=>{
  console.log('转译JSX...')
  gulp.src(res.jsx)
  .pipe(babel({presets:['es2015','react']}))
    .pipe(react())
    .pipe(uglify())
    .pipe(gulp.dest('./scripts/steam/dist'))
})

gulp.task('autoCss',['stylusCss'],()=>{
  console.log('css3前缀匹配中...');
  gulp.src(css)
    .pipe(autoprefixer('last 5 versions'))
    .pipe(gulp.dest('./styles'))
})

gulp.task('miniCss',['stylusCss','autoCss'],()=>{
  console.log('开始压缩css...')
  gulp.src(css)
  .pipe(minifyCss())
  .pipe(gulp.dest('./styles'))
})

gulp.task('default',()=>{
  console.log('gulp启动成功！')
  gulp.watch(res.styles,['stylusCss']);
  gulp.watch(res.jsx,['build']);
})