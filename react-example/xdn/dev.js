import router from '../routes'
import ssr from './ssr'
import { createDevServer } from '@xdn/core'

createDevServer(ssr)
