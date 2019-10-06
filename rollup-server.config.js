import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

module.exports = {
  input: 'build/server.js',
  output: {
    file: 'dist/server.js',
    name: "client",
    format: 'cjs'
  },
	/*
  plugins: [
    resolve(),
    commonjs({
      include: /node_modules\/@sabaki\/sgf/
    })
  ]*/
};
