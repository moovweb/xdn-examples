import Link from 'next/Link'

export default function StaticPage({ id }) {
  return (
    <div>
      <h1>Static {id}</h1>
      <ul>
        {[1, 2, 3].map((id) => (
          <li key={id}>
            <Link href={`/static/${id}`}>
              <a>Static {id}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }, { params: { id: '3' } }],
    fallback: true,
  }
}

export function getStaticProps({ params }) {
  return { props: { id: params.id }, revalidate: params.id === '1' ? 60 * 60 : false }
}
