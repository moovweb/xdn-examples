export default function get(req, res) {
  res.json({
    'x-xdn-geo-country-code': req.headers['x-xdn-geo-country-code'],
    'x-xdn-geo-city': req.headers['x-xdn-geo-city'],
    'x-xdn-geo-postal-code': req.headers['x-xdn-geo-postal-code'],
    'x-xdn-geo-latitude': req.headers['x-xdn-geo-latitude'],
    'x-xdn-geo-longitude': req.headers['x-xdn-geo-longitude'],
  })
}
