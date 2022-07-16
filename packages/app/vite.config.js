/*
 * Copyright © 2022 Durudex
 *
 * This file is part of Durudex: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Durudex is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Durudex. If not, see <https://www.gnu.org/licenses/>.
 */

import {startApi} from '@durudex-web/test-api'
import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import checker from 'vite-plugin-checker'
import compression from 'vite-plugin-compression'

if (process.argv[2] !== 'build') {
  startApi(3001)
}

const relative = dir => resolve(process.cwd(), dir)

const preview = Boolean(process.env.BUILD_PREVIEW)

export default defineConfig({
  plugins: [
    solid(),
    checker({typescript: true}),
    compression({algorithm: 'brotliCompress'}),
  ],
  build: {
    minify: preview ? false : 'esbuild',
  },
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://localhost:3001',
      },
      '/*': {
        target: '/',
      },
    },
  },
  resolve: {alias: {$: relative('src/')}},
})
