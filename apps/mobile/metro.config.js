const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Deliberately minimal. There are no path aliases in this app: every import is relative, so Metro
 * needs no tsconfig `paths`, no `extraNodeModules` and no custom `resolveRequest`. A release build
 * that fails on "Unable to resolve module @/..." cannot happen here, because that prefix does not
 * exist anywhere in the source.
 */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
