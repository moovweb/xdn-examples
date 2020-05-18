import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher } from '@xdn/prefetch/sw'
import CustomPlugin from './CustomPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [new CustomPlugin()],
}).route()
