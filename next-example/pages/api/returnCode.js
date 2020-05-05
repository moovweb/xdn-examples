export default function returnCode(req, res) {
  const code = parseInt(req.query.code || '200', 10)
  res.status(code).end()
}
