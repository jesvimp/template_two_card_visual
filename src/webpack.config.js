const path = require("path");
const PowerBIVisualsWebpackPlugin = require("powerbi-visuals-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const pkg = require("./pbiviz.json");

module.exports = {
  entry: {
    "visual": "./src/visual.tsx",
    "visual.less": "./style/visual.less"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: { transpileOnly: true }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: "css-loader" },
            {
              loader: "less-loader",
              options: { lessOptions: { javascriptEnabled: true } }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
        generator: { filename: "assets/[name][ext]" }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    new ExtractTextPlugin("visual.css"),
    new PowerBIVisualsWebpackPlugin({
      options: {
        apiVersion: pkg.apiVersion,
        capabilities: "capabilities.json",
        pbiviz: "pbiviz.json",
        packageOutPath: path.join(__dirname, "dist")
      }
    })
  ]
};