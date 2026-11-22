import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.ts',
  external: ["rmmz"],
  output: {
    file: 'dist/TrueWay.js',
    format: 'iife',
    name: 'TrueWay',
    globals: { rmmz: "window" }
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript()
  ]
};