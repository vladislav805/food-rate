const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';
const isPublicMode = process.env.PUBLIC === '1';

module.exports = {
    mode,
    entry: {
        main: path.resolve('src', 'frontend', 'main@client.tsx'),
    },
    output: {
        path: path.resolve('dist', 'static'),
        publicPath: '/static',
        filename: `index.js`,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    // {
                    //     loader: 'babel-loader',
                    // },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],

        plugins: [
            // Pulls the paths from tsconfig.json to resolve.alias
            new TsconfigPathsPlugin(),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
    stats: 'minimal',
    devtool: 'eval',
    devServer: {
        host: '0.0.0.0',
        port: isPublicMode ? 6789 : 1111,
        allowedHosts: 'all',
        hot: true,
        liveReload: true,
        proxy: {
            '/': {
                target: 'http://localhost:1112/',
                router: () => 'http://localhost:1112',
                logLevel: 'debug' /*optional*/
            }
        },
        client: isPublicMode ? {
            webSocketURL: 'ws://desktop.mirror.velu.ga/ws',
        } : undefined,
    },
};
