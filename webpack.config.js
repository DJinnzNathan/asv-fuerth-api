const path = require('path');

module.exports = {
    entry: './bin/www',
    resolve: {
        fallback: {
            url: false,
            path: false,
            "async-hooks": false,
        }
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};