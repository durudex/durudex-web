/**
 * Copyright (C) 2022 Durudex
 *
 * This source code is licensed under the GNU Affero General Public License
 * license found in the LICENSE file in the root directory of this source tree.
 */

import {createServer} from 'node:http'
import cc from 'concolor'

const API_URL = 'https://api.dev.durudex.com/query'

export function startApi(port: number) {
  const {close} = createServer((req, res) => {
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

  process.on('beforeExit', close)

  return close
}
