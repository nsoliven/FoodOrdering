const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver to handle Platform module issues
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
	...config.resolver?.extraNodeModules,
	'react-native': require.resolve('react-native'),
  },
};

module.exports = config;
