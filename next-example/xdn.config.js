<<<<<<< Updated upstream
// This file was automatically added by xdn deploy.
// You should commit this file to source control.
module.exports = {}
=======
import { createNextBackend } from '@xdn/next'
import { xdn } from '@xdn/core'
import router from './routes'

// This file was automatically added by xdn deploy.
// You should commit this file to source control.
export default xdn({
  router,
  backends: {
    next: createNextBackend()
  }
})
>>>>>>> Stashed changes
