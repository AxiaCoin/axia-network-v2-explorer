const colors = require('colors')
// Inject SCSS variables into Vue components
let scssVars = ''
scssVars += `$VUE_APP_DEFAULT_NETWORKID: ${process.env.VUE_APP_DEFAULT_NETWORKID}; `
for (const e in process.env) {
    if (/VUE_APP_SCSS_/i.test(e)) {
        scssVars += `$${e}: ${process.env[e]}; `
    }
}
scssVars += `@import "@/_main.scss"; `
scssVars += `@import "@/_background.scss"; `

/**
 * This just displays the urls being provided by .env file
 */
console.log(`
${colors.green('.Env configs are:')}
    Ortelius url: ${colors.magenta(process.env.VUE_APP_ORTELIUS_URL)}
    Axia GO url: ${colors.magenta(process.env.VUE_APP_AXIA_GO_URL)}
    Fuji url: ${colors.magenta(process.env.VUE_APP_AXIA_JS_IP)}
    AppChain url: ${colors.magenta(process.env.VUE_APP_APPCHAIN_EXPLORER_URL)}

    HTTP PORT: ${colors.magenta(process.env.VUE_APP_HTTP_PORT)}
`)

module.exports = {
    devServer: {
        https: false,
        port: process.env.VUE_APP_HTTP_PORT,
    },
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                options.compiler = require('vue-template-babel-compiler')
                return options
            })
    },
    transpileDependencies: ['vuetify'],
    css: {
        loaderOptions: {
            scss: {
                prependData: scssVars,
            },
        },
    },
}
