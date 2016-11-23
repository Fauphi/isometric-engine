// build.js:
require("rollup").rollup({
  entry: "./src/main.js",
  plugins: [
    require("rollup-plugin-babel")({
      "presets": [["es2015", { "modules": false }]],
      "plugins": ["external-helpers"]
    })
  ]
}).then(bundle => {
  var result = bundle.generate({
    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
    format: 'iife'
  });

  require("fs").writeFileSync("./bundle.js", result.code);
  // sourceMaps are supported too!
}).then(null, err => console.error(err));