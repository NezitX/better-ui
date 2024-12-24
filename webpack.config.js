const { exec } = require("child_process");
const path = require("path");

module.exports = (env, options) => {
  const { mode = "development" } = options;
  const rules = [
    {
      test: /\.m?js$/,
      use: [
        "html-tag-js/jsx/tag-loader.js",
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      ]
    },
    {
      test: /\.scss$/,
      use: ["css-loader", "sass-loader"]
    }
  ];

  const main = {
    mode,
    entry: {
      main: "./src/main.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      chunkFilename: "[name].js"
    },
    module: {
      rules
    },
    plugins: [
      {
        apply: compiler =>
          compiler.hooks.afterDone.tap("pack-zip", () => {
            exec("node .devServer/pack-zip.js", (err, stdout, stderr) => {
              if (err) return console.error(err);
              console.log(stdout);
            });
          })
      }
    ]
  };

  return [main];
};
