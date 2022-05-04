// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

const webpack = require('webpack')
module.exports = {
  configureWebpack: {
    // transpileDependencies: true,
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  },
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack:
    config => {
      config.optimization.delete('splitChunks')
    }
}
