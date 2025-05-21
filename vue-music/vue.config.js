const { VantResolver } = require('unplugin-vue-components/resolvers');
const { default: ComponentsPlugin } = require('unplugin-vue-components/webpack');

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions:{
          plugins: [
            require('postcss-pxtorem')({
              rootValue: 37.5,
              propList: ['*'],
            }),
          ],
        },
      },
    },
  },

  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },


};
