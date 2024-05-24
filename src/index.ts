export let useDrizzleStudioPlugin: typeof import("./useDrizzleStudioPlugin").useDrizzleStudioPlugin;

// process.env.NODE_ENV is defined by metro transform plugins
// if (process.env.NODE_ENV !== "production") {
  // } else {
  //     useDrizzleStudioPlugin = () => {};
  // }
useDrizzleStudioPlugin = require("./useDrizzleStudioPlugin").useDrizzleStudioPlugin;
