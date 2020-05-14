import { Router } from '@xdn/core/router'

export default new Router()
  .destination(
    'legacy_experience', // displayed in the destination dropdown in the traffic splitting section of your environment configuration in the XDN Developer Console
    new Router()
      // additional routing rules for the legacy experience go here
      .fallback(({ proxy }) => proxy('legacy'))
  )
  .destination(
    'new_experience', // displayed in the destination dropdown in the traffic splitting section of your environment configuration in the XDN Developer Console
    new Router()
      // additional routing rules for the new experience go here
      .fallback(({ proxy }) => proxy('new'))
  )
