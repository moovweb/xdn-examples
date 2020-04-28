import app from '../app'

export default (req, res) => {
  res.setHeader('content-type', 'text/html')

  try {
    const html = app.render(req)
    res.end(html)
  } catch (e) {
    res.writeHead(500)
    res.end(e.stack)
  }
}
