import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default function replaceModule () {
  return {
    name: 'liz-replace',
    resolveId(source) {
      if (source === './client-electron') {
        return {id: './build/client-browser.js'};
      }
      return null;
    }
  };
}

module.exports = {
  input: 'build/renderer.js',
  output: {
    file: 'public/renderer.js',
    name: "client",
    format: 'iife'
  },
  plugins: [
    replaceModule(),
    resolve(),
    commonjs({
      include: /node_modules\/@sabaki\/sgf/
    })
  ]
};
