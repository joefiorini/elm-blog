import path from 'path';
import util from 'util';
import fs from 'fs';
import HtmlPlugin from 'html-webpack-plugin';
import HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin';
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer';

const { BundleAnalyzerPlugin } = WebpackBundleAnalyzer;

const { resolve } = path;
const { promisify } = util;
const { readFile: readFileCb } = fs;

const readFile = promisify(readFileCb);
const logValue = v => (console.dir(v, { depth: 15 }), v);

export default async function({
  useBundleAnalyzer,
  isProduction = false
} = {}) {
  const babelConfig = JSON.parse(await readFile('./.babelrc'));
  return {
    entry: {
      blog: ['./src/main.js']
    },
    mode: isProduction ? 'production' : 'development',
    devtool: 'sourcemap',
    output: {
      path: resolve('./dist'),
      globalObject: 'self',
      chunkFilename: '[name]'
    },
    resolveLoader: {
      modules: [resolve('./webpack'), 'node_modules']
    },
    optimization: {
      occurrenceOrder: true,
      splitChunks: {
        chunks: 'all',
        name: true,
        cacheGroups: {
          main: {
            test: /Main\.elm/
          },
          datastore: {
            test: /Calc\.elm/
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          loader: 'elm-webpack-loader',
          options: {
            pathToMake: './node_modules/.bin/elm-make',
            verbose: true,
            warn: true,
            debug: true
          }
        },
        {
          test: /\.js/,
          rules: [
            {
              resourceQuery: /worker/,
              use: ['worker-loader']
            }
          ],
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
      useBundleAnalyzer && new BundleAnalyzerPlugin()
      // new HtmlWebpackIncludeAssetsPlugin({
      //   // assets: ['./dist/elm.js'],
      //   append: true
      // })
    ].filter(a => a),
    externals: {
      'elm-app': 'elm.js'
    }
  };
}
