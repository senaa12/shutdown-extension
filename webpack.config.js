const path = require("path");

const rules = require("./webpack/rules");
const plugins = require("./webpack/plugins");
//const withChromeExtensionDevSetup = require("./webpack/withChromeExtensionDevSetup");

process.traceDeprecation = true;

module.exports =  function(env, argv) {
    var isProduction = argv.mode === 'production';

    let setup = {
        entry: {
            popup: path.resolve(__dirname, 'src/popup/index.tsx'),
            background: path.resolve(__dirname, 'src/background/index.ts'),
            'content-script': path.resolve(__dirname, 'src/content-script/index.ts'),
        },
        output: {
            path: path.resolve(__dirname, './build'),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: [
                path.resolve(__dirname, 'src/background'),
                path.resolve(__dirname, 'src/common'),
                path.resolve(__dirname, 'src/common-native-client'),
                path.resolve(__dirname, 'src/content-script'),
                path.resolve(__dirname, 'src/popup'),
                'node_modules'
            ],
            alias: {
                common: path.resolve(__dirname, 'src/common'),
                'common-native-client': path.resolve(__dirname, 'src/common-native-client')
            }
        },
        module: {
            rules: [
                rules.typescript,
                rules.scssProdLoader,
                rules.babel,
                rules.svgLoader
            ]
        },
        plugins: [
            plugins.copyChromeExtensionAssets,
            plugins.definePlugin(isProduction),
            plugins.providePlugin,
            plugins.htmlWebpackPlugin('popup.html', 'popup'),
            plugins.hashedModulePlugin
        ],
        experiments: {
            topLevelAwait: true
        }
    };

    if (!isProduction) {
        //setup = withChromeExtensionDevSetup(setup);
    }
    else {
        setup = {
            ...setup,
            plugins: [
                ...setup.plugins,
                plugins.terserPlugin
            ]
        }
    }

    return setup;
}