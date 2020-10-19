export default function LargeResponse({ size }) {
  const elements = []

  for (let i = 0; i < size; i++) {
    elements.push(<div key={i}>Element {i}</div>)
  }

  return <div>{elements}</div>
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      size: query.size,
    },
  }
}
