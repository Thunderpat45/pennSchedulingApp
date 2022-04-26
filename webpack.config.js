const webpack  = require("webpack");
const path = require('path')

module.exports = {
    mode: 'production',
    entry:{
        adminHomePage: './src/adminHomePage.js',
        homePage: './src/homePage.js',
        logInPage: './src/login.js'
    }, 
    output: {
        filename:'[name].js',
        path:__dirname + '/public/javascripts'
    },
    devtool: "source-map",
}