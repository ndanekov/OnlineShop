const {
    override,
    fixBabelImports,
    addLessLoader,
} = require('customize-cra');

/*module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
      modifyVars: {
          "@layout-body-background": "#FFFFFF",
          "@layout-header-background": "#FFFFFF",
          "@layout-footer-background": "#FFFFFF"
      },
      javascriptEnabled: true
    })(config, env);
    return config;
};*/

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd", style: true // change importing css to less
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars:  {
            "@layout-body-background": "#FFFFFF",
            "@layout-header-background": "#FFFFFF",
            "@layout-footer-background": "#FFFFFF"
        }
    })
  );