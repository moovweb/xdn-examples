const { withServiceWorker } = require("@xdn/next/sw");
const withXDN = require("@xdn/next/withXDN");

module.exports = withXDN(
  withServiceWorker({
    rewrites: () => [
      {
        source: "/products/:id",
        destination: "/p/:id",
      },
    ],
    redirects: () => [
      {
        source: "/sale/:id",
        destination: "/p/:id",
        permanent: false,
      },
    ],
  })
);
