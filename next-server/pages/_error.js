import React from 'react';

function Error({ err }) {
  return (
    <p>
      {err && err.stack}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  return { err };
};

export default Error;