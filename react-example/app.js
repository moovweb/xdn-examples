/* eslint-disable */
import React from 'react'
import ReactDOMServer from 'react-dom/server'

const App = () => {
  return (
    <html>
      <body>
        <div>Hello World!</div>
      </body>
    </html>
  )
}

export default {
  render(req, res) {
    return `<!doctype html>${ReactDOMServer.renderToString(<App />)}`
  },
}
