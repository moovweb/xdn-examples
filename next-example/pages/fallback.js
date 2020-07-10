export default function Fallback({ reqURL }) {
  return <p>URL: {reqURL}</p>;
}

Fallback.getInitialProps = ({ req, pathname }) => {
  return { reqURL: req.url };
};
