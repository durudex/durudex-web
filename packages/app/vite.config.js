/**
 * Copyright (C) 2022 Durudex
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the COPYING file in the root directory of this source tree.
 */

import {startApi} from '@durudex-web/test-api'
import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import checker from 'vite-plugin-checker'
import solid from 'vite-plugin-solid'

if (process.argv[2] !== 'build') {
  startApi(3001)
}

const relative = dir => resolve(process.cwd(), dir)

export default defineConfig({
  plugins: [solid(), checker({typescript: true})],
  build: {},
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://localhost:3001',
      },
    },
  },
  resolve: {alias: {$: relative('src/')}},
})
