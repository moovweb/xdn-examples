export default function NotFound({ message }) {
  return <p>{message}</p>
}

export function getStaticProps() {
  return {
    props: {
      message: 'We are sorry. The page could not be found.',
    },
  }
}
