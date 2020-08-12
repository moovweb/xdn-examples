export default function Page({ id }) {
  return <div>id: {id}</div>;
}

Page.getInitialProps = ({ query }) => {
  console.log("fetching product", query.id);

  return {
    id: query.id,
  };
};
