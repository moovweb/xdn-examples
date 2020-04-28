export default function returnCode(req, res) {
  const code = parseInt(req.query.code)
  res.status(code).end()
}
