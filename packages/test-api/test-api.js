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

import {createServer} from 'node:http'
import cc from 'concolor'

const API_URL = 'https://api.dev.durudex.com/query'

/**
 * Start a http server that logs requests to the console and responds with the data development API returns.
 * @returns Close server function
 */
export function startApi(port) {
  const server = createServer((req, res) => {
    console.log(cc.info`\n[api request]\n`)

    req.on('data', chunk => {
      fetch(API_URL, {
        body: chunk,
        method: 'POST',
        headers: {'content-type': 'application/json'},
      })
        .then(apiResp => apiResp.json())
        .then(content => {
          console.dir(content)
          res.end(JSON.stringify(content))

          if (content?.errors?.length > 0) {
            console.log(cc.fail`\n[has errors]`)
          }
        })
        .catch(err => {
          console.error(cc.fail`[rejected]`)
          console.dir(err)
        })
    })
  }).listen(port)

  const close = server.close.bind(server)

  process.on('beforeExit', close)

  return close
}
