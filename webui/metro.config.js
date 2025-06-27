const { getDefaultConfig } = require("expo/metro-config");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("js");
config.resolver.unstable_enablePackageExports = false; // Workaround for ESM babel/runtime resolving issue
module.exports = config;
