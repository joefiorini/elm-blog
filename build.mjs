#!/usr/bin/env node --experimental-modules

import webpack from 'webpack';
import serve from 'webpack-serve';
import makeConfig from './webpack.config.mjs';
import util from 'util';

async function run() {
  if (process.argv[2] === 'build') {
    const config = await makeConfig();
    const stats = await build(config);
    console.log(stats.toString({ colors: true }));
  } else if (process.argv[2] === 'serve') {
    const config = await makeConfig({ useBundleAnalyzer: true });

    serve({
      config,
      options: {
        http2: true,
        hot: {
          reload: true
        }
      }
    });
  }
}

function build(config) {
  const compiler = webpack(config);

  return util.promisify(compiler.run.bind(compiler))();
}

run().catch(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
