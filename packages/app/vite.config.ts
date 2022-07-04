import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import checker from 'vite-plugin-checker'
import {resolve} from 'node:path'

const relative = (dir: string) => resolve(process.cwd(), dir)

export default defineConfig({
  plugins: [solid(), checker({typescript: true})],
  build: {},
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://localhost:3001'
      }
    }
  },
  resolve: {alias: {$: relative('src/')}}
})
