const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias['../Utilities/Platform'] = 'react-native-web/dist/exports/Platform';
  config.resolve.alias['react-native'] = 'react-native-web';
  return config;
}