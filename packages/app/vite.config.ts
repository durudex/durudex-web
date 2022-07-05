/**
 * Copyright (C) 2022 Durudex
 *
 * This source code is licensed under the GNU Affero General Public License
 * license found in the LICENSE file in the root directory of this source tree.
 */

import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import checker from 'vite-plugin-checker'
import {resolve} from 'node:path'
import {createServer} from 'node:http'

if (process.argv[2] === 'build') {
  createServer((req, res) => {
    req.on('data', chunk => {
      fetch('https://api.dev.durudex.com/query', {
        body: chunk,
        method: 'POST',
        headers: {'content-type': 'application/json'},
      })
        .then(apiResp => apiResp.json())
        .then(content => {
          console.log('[api request]\n')
          console.dir(content)
          res.end(JSON.stringify(content))
        })
    })
  }).listen(3001)
}

const relative = (dir: string) => resolve(process.cwd(), dir)

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
