import path from 'path';
import util from 'util';
import fs from 'fs';
import HtmlPlugin from 'html-webpack-plugin';
import HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin';

const { resolve } = path;
const { promisify } = util;
const { readFile: readFileCb } = fs;

const readFile = promisify(readFileCb);
const logValue = v => (console.dir(v, { depth: 15 }), v);

export default async function() {
  const babelConfig = JSON.parse(await readFile('./.babelrc'));
  return {
    entry: {
      blog: ['./src/main.js']
    },
    mode: 'development',
    devtool: 'sourcemap',
    output: {
      path: resolve('./dist')
    },
    resolveLoader: {
      modules: [resolve('./webpack'), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                ...babelConfig
              }
            }
          ]
        },
        {
          test: /\.md/,
          use: ['marked-front-matter-loader']
        }
      ]
    },
    plugins: [
      new HtmlPlugin(),
      new HtmlWebpackIncludeAssetsPlugin({
        assets: ['./dist/elm.js'],
        append: true
      })
    ]
  };
}
