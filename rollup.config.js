import path from 'path';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import stringHash from 'string-hash';

// Move our babel config into the root but use it to compile all of our packages
const getBabelOptions = ({
  // This path has to be relative to our packages
  babelConfigFile = '../../../babel.config.js',
  useESModules,
}) => ({
  exclude: '**/node_modules/**',
  babelHelpers: 'runtime',
  configFile: babelConfigFile,
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

// Also making this a function since we may need to move some of the PostCSS config to the package root to be used in Cosmos or Doc tooling.
const getPostCSSOptions = () => ({
  // extract: 'styles.css',
  sourceMap: true,
  minimize: true,
  modules: {
    generateScopedName: function (name, filename, css) {
      const path = require('path');
      const file = path.basename(filename, '.css').replace('.module', '');
      const hash = stringHash(css).toString(36).substr(0, 5);

      return file + '_' + name + '__' + hash;
    },
    // generateScopedName: '[name]__[local]___[hash:5]'
  },
  use: ['sass'],
});

const external = (id) => !id.startsWith('.') && !id.startsWith('/');

// Pragmatically create a Rollup config for each package
export const getRollupConfig = ({ pwd, babelConfigFile }) => {
  const SOURCE_DIR = path.resolve(pwd);
  // Get the package.json file
  const pkgConfig = require(`${SOURCE_DIR}/package.json`);
  // Relative input location for Rollup to bundle from
  const input = `${SOURCE_DIR}/src/index.js`;

  // Common JS configuration
  const cjsConfig = {
    input,
    output: {
      file: `${SOURCE_DIR}/${pkgConfig.main}`,
      format: 'cjs',
    },
    external,
    plugins: [
      babel(
        getBabelOptions({
          babelConfigFile,
          useESModules: false,
        })
      ),
      postcss(getPostCSSOptions()),
    ],
  };

  // Modules configuration
  const esConfig = {
    input,
    output: {
      file: `${SOURCE_DIR}/${pkgConfig.module}`,
      format: 'es',
    },
    external,
    plugins: [
      babel(
        getBabelOptions({
          babelConfigFile,
          useESModules: true,
        })
      ),
      postcss(getPostCSSOptions()),
    ],
  };

  if (process.env.WATCH_MODE) {
    return [esConfig, cjsConfig];
  }

  return [esConfig, cjsConfig];
};