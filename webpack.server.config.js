const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: path.resolve('src', 'index.ts'),
    output: {
        path: path.resolve('dist'),
        filename: `server.js`,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig@server.json',
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: 'null-loader',
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

        fallback: {
            'pg-hstore': false,
        }
    },
    stats: 'minimal',
};
