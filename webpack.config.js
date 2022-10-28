const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
	mode: "production",
	plugins: [
		new Dotenv(),
		new CopyPlugin({
			patterns: [{ from: "static/", to: "static/" }, { from: "public" }],
		}),
	],
	entry: {
		main: "./src/index.js",
	},
};
