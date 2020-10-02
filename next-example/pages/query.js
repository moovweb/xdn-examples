export default function Query({ query }) {
  return <p id="result">{JSON.stringify(query)}</p>
}

Query.getInitialProps = ({ query }) => {
  return { query }
}
