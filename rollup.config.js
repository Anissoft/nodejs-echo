import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default {
  input: `src/node/index.ts`,
  acorn: {
    //Let the hashbang be
    allowHashBang: true
  },
  output: [
    { file: `${pkg.main}`, name: 'index.umd.js', format: 'umd', sourcemap: true },
    { file: `${pkg.module}`, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['http', 'crypto', 'bufferutil', 'http-server', 'utf-8-validate', 'util'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    replace({
      delimiters: ['', ''],
      '#! /usr/bin/env node': '',
      '#!/usr/bin/env node': '',
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
