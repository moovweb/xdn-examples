import React, { useEffect } from "react";
import { Prefetch } from "@xdn/react";
import Link from "next/link";

export default function Product({ product }) {
  return (
    <div>
      {product && (
        <>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h2>Related Products</h2>
        </>
      )}
      <ul>
        {products.map((product, i) => (
          <li key={i}>
            <Link as={`/p/${i}`} href="/p/[productId]" passHref>
              <Prefetch>
                <a>{product.name}</a>
              </Prefetch>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getServerSideProps({ query }) {
  console.log("fetching category", query.productId);
  const product = products[parseInt(query.productId)] || products[0];
  return { props: { product } };
}

const products = [
  {
    name: "Red Shirt",
    description: "The nicest red shirt you've ever seen",
  },
  {
    name: "Blue Pants",
    description: "Always blue! Always blue!",
  },
  {
    name: "Green Shoes",
    description:
      "These shoes may be green, but they won't cost you a lot of green.",
  },
];
