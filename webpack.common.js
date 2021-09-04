const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const TerserPlugin = require('terser-webpack-plugin');

const mapModuleIds = fn => compiler => {
    const context = compiler.options.context;

    compiler.hooks.compilation.tap("ChangeModuleIdsPlugin", compilation => {
        compilation.hooks.beforeModuleIds.tap("ChangeModuleIdsPlugin", modules => {
            const chunkGraph = compilation.chunkGraph
            for (const module of modules)
                if (module.libIdent) {
                    const origId = module.libIdent({context})
                    // if (!origId) continue;
                    chunkGraph.setModuleId(module, fn(origId, module))
                }
        })
    })
}

module.exports = (dir, lib) => {
    const t = 'window';
    const p = require(path.join(dir, "package.json"));
    const externals = Object.keys(p.dependencies).filter(k => k.startsWith('@local'));
    return {
        entry: [path.join(dir, 'dist', 'index.js')],
        output: {
            path: path.join(dir, "dist-module"),
            filename: 'bundle.js',
            library: p.name,
            libraryTarget: t
        },
        resolve: {
            symlinks: false,
            modules: [
                path.join(dir, '..', 'node_modules'),
                path.join(dir, 'node_modules'),
            ]
        },
        ignoreWarnings: [/Failed to parse source map/],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        ecma: 2017
                    }
                })
            ]
        },
        module: {
            rules: [

                {
                    test: /\.js$/,
                    enforce: 'pre',
                    use: ['source-map-loader']
                }
                ,
                ...externals.map(e => {
                    return {
                        test: new RegExp(`/${e}/`),
                        loader: `val-loader`,
                        options: {
                            executableFile: path.join(__dirname, 'val-loader.js'),
                            options: {
                                module: e
                            }
                        }
                    }
                })
            ]
        },
        plugins: [
            mapModuleIds((id, mod) => {
                if (id === './dist/index.js') {
                    return p.name;
                }
                return id;
            }),
            ...(lib ? [new webpack.DllPlugin({
                context: path.join(dir, '..'),
                name: p.name,
                entryOnly: false,
                path: path.join(dir, 'dist-module', "library.json"),
                type: t
            })] : []),
            ...(externals.map(e => {
                let p = path.join(dir, 'node_modules', e, 'dist-module', 'library.json')
                if (fs.existsSync(p)) {
                    return new webpack.DllReferencePlugin({
                        context: path.join(dir, '..'),
                        manifest: p,
                    })
                }

            }).filter(f => !!f))
        ],
        devtool: "eval-cheap-module-source-map",
        mode: "development"
    }
}