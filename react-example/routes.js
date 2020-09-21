const { Router } = require('@xdn/core/router')
const { BACKENDS } = require('@xdn/core/constants')

module.exports = new Router()
  .match('/', ({ proxy }) => {
    proxy(BACKENDS.js)
  })
  .fallback(({ compute, redirect, setUpstreamResponseHeader }) => {
    compute(() => {
      setUpstreamResponseHeader('cache-control', 'max-age=0')
      redirect('/', 301)
    })
  })
