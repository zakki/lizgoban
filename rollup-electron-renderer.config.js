import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

module.exports = {
  input: 'build/renderer.js',
  output: {
    file: 'dist/renderer.js',
    name: "client",
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs({
      include: /node_modules\/@sabaki\/sgf/
    })
  ]
};
