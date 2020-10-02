export default function Fallback({ reqURL }) {
  return <p>Fallback, URL: {reqURL}</p>
}

Fallback.getInitialProps = ({ req, pathname }) => {
  return { reqURL: req.url }
}
