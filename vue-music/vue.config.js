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

  // 新增 devServer 代理配置，解决跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'https://netease-cloud-music-api.vercel.app', // 目标API地址，换成你的代理地址
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '',  // 去掉请求路径中的 /api 前缀
        },
      },
    },
  },
};
