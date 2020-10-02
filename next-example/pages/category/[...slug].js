export default function Category({ slug }) {
  return <p>Category slug: {JSON.stringify(slug)}</p>
}

Category.getInitialProps = ({ query }) => {
  return { slug: query.slug }
}
