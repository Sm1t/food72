'use strict';

const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const pkg = require('../package.json');

let promise = Promise.resolve();

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
promise = promise.then(() => rollup.rollup({
  entry: 'src/index.js',
  external: Object.keys(pkg.dependencies),
  plugins: [babel(Object.assign(pkg.babel, {
    babelrc: false,  // игнорим файл .babelrc
    exclude: 'node_modules/**', // исключаем node_modules
    runtimeHelpers: true,  // используем хелперы, в нашем случае transform-runtime, который не дает дублировать при транспиляции
    presets: pkg.babel.presets.map(x => (x === 'latest' ? ['latest', { es2015: { modules: false } }] : x)),
  }))],
}).then(bundle => bundle.write({  //собираем все в один файл
  dest: 'dist/index.js',  // место назначения конечного файла
  format: 'cjs',  // format CommonJS
  sourceMap: true,  // включаем source map
})));


promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
