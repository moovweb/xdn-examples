import Link from 'next/link'
import { useRouter } from 'next/router'

export default function StaticPage({ id }) {
  const { isFallback, locale } = useRouter()

  if (isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>
        Static {id} ({locale})
      </h1>
      <ul>
        {[1, 2, 3, 4].map((id) => (
          <li key={id}>
            <Link href={`/${locale}/static/${id}`}>
              <a>Static {id}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function getStaticPaths() {
  const paths = []

  for (let id of ['1', '2', '3', '4']) {
    for (let locale of ['en-US', 'fr', 'nl-NL']) {
      paths.push({ params: { id, locale } })
    }
  }

  return { paths, fallback: true }
}

export function getStaticProps({ params }) {
  return { props: { id: params.id }, revalidate: params.id === '1' ? 60 * 60 : false }
}
