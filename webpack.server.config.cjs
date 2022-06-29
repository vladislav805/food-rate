const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'node',
    entry: path.resolve('src', 'index.ts'),
    output: {
        path: path.resolve('dist'),
        filename: `server.cjs`,
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
                        loader: 'ignore-loader',
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
            cardinal: false,
        }
    },
    stats: 'minimal',
};
