// TODO: Webpack can't seem to load mjs modules yet, so falling back to CJS here for now
const { loadFront } = require('yaml-front-matter');
const marked = require('marked');
const loaderUtils = require('loader-utils');
const sha256 = require('js-sha256');

module.exports = function markedFrontMatterLoader(rawContent) {
  const options = loaderUtils.getOptions(this);

  const frontMatter = loadFront(rawContent);

  this.cacheable();

  marked.setOptions(options);

  const content = marked(frontMatter.__content);

  return `
    module.exports.metadata = ${JSON.stringify(frontMatter)};
    module.exports.sha = ${JSON.stringify(
      sha256(
        JSON.stringify(frontMatter) + JSON.stringify(frontMatter.__content)
      )
    )}
    module.exports.content = ${JSON.stringify(content)};
  `;
};
