const webpack  = require("webpack");
const path = require('path')

module.exports = {
    mode: 'development',
    entry:{
        adminHomePage: './src/adminHomePage.js',
        // userHomePage: './src/userHomePage.js'
    }, 
    output: {
        filename:'[name].js',
        path:__dirname + '/public/javascripts'
    },
    devtool: "source-map",
}