import ts from 'rollup-plugin-typescript2';
import path from 'path';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: './src/core/index.ts',
        output: [
            {
                file: path.resolve(__dirname, './dist/sdk.esm.js'),
                format: "es"
            },
            {
                file: path.resolve(__dirname, './dist/sdk.cjs.js'),
                format: "cjs"
            },
            {
                file: path.resolve(__dirname, './dist/sdk.js'),
                format: "umd",
                name: 'Tracker'
            },
        ],
        plugins: [
            ts(),
        ]
    },
    {
        input: './src/core/index.ts',
        output:
        {
            file: path.resolve(__dirname, './dist/index.d.ts'),
            format: 'es'
        },
        plugins: [
            dts(),
        ]
    }
]