export default function Page({ id }) {
  return <div>id: {id}</div>
}

Page.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  }
}
