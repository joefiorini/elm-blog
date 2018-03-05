#!/usr/bin/env node --experimental-modules

import webpack from 'webpack';
import serve from 'webpack-serve';
import makeConfig from './webpack.config.mjs';
import util from 'util';

async function run() {
  const config = await makeConfig();

  if (process.argv[2] === 'build') {
    const stats = await build(config);
    console.log(stats.toString({ colors: true }));
  } else if (process.argv[2] === 'serve') {
    console.dir(config);
    serve({
      config,
      options: {
        http2: true,
        hot: true
      }
    });
  }
}

function build(config) {
  const compiler = webpack(config());

  return util.promisify(compiler.run.bind(compiler))();
}

run().catch(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
