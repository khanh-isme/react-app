const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = {
  webpack: override(
    addWebpackAlias({
      ["~"]: path.resolve(__dirname, "src"),
    })
  ),


  jest: (config) => {

    config.testEnvironment = "jsdom";
    
    // Cho phép Jest xử lý react-router-dom ESM
    config.transformIgnorePatterns = [
      "node_modules/(?!(react-router|react-router-dom)/)"
    ];

    // Map CSS & style
    config.moduleNameMapper = {
      "\\.(css|less|scss)$": "identity-obj-proxy",
      "^react-router-dom$": require.resolve("react-router-dom")
    };

    return config;
  }
};
