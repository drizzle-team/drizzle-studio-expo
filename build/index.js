export let useDrizzleStudio;
// @ts-ignore process.env.NODE_ENV is defined by metro transform plugins
if (process.env.NODE_ENV !== 'production') {
    useDrizzleStudio = require('./useDrizzleStudio').useDrizzleStudio;
}
else {
    useDrizzleStudio = () => { };
}
//# sourceMappingURL=index.js.map