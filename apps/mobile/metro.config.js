const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

/**
 * The app and the website read one copy of the game configuration from
 * `packages/shared-types`. Metro does not know about tsconfig `paths`, so the two aliases
 * are mapped here by hand, and the package folder is added to the watch list so editing a
 * word in the shared file reloads the app instead of silently doing nothing.
 */
const sharedGame = path.resolve(__dirname, '../../packages/shared-types/src');

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@shared/game': sharedGame,
};
config.watchFolders = [path.resolve(__dirname, '../../packages'), ...(config.watchFolders ?? [])];

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
