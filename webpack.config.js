var path = require("path");

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "build"),
    hot: true
  }
};
