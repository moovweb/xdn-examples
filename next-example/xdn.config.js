import { createNextBackend } from '@xdn/next'
import routes from './routes'

// This file was automatically added by xdn deploy.
// You should commit this file to source control.
export default {
  routes,
  backends: {
    next: createNextBackend()
  }
}
