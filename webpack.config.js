//const path = require('path');

module.exports = {
  //entry: './main.js',  //第一天
  //entry: './TicTacToe.js', //第二天 
  entry: './TicTacToe-vdom.js', //第三天
  mode: 'development',
  optimization: {
    minimize: false
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins:[
            ['@babel/plugin-transform-react-jsx',
            {pragma:'ToyReact.createElement'}] //重命名解析函数名，解析jsx语法，生成组件的原命名：react.creatELement
          ]
        }
      }
    }]
  },
   output: {
      // path: path.resolve(__dirname, 'dist'),
     filename: 'TicTacToe-vdom.js'
   }
};