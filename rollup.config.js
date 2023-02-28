import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [commonjs()],
  dynamicRequireTargets: [
    // include using a glob pattern (either a string or an array of strings)
    "node_modules/logform/*.js",

    // exclude files that are known to not be required dynamically, this allows for better optimizations
    "!node_modules/logform/index.js",
    "!node_modules/logform/format.js",
    "!node_modules/logform/levels.js",
    "!node_modules/logform/browser.js",
  ],
};
