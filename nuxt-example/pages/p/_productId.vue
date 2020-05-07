<template>
  <div id="app">
    <div v-if="product">
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <h2>Related Products</h2>
    </div>
    <ul v-if="products">
      <li v-for="(p, idx) in products">
        <Prefetch v-bind:url="`/api/p/${idx}.json`">
          <nuxt-link v-bind:to="`/p/${idx}`">{{ p.name }}</nuxt-link>
        </Prefetch>
      </li>
    </ul>
  </div>
</template>

<script>
  import Prefetch from '@xdn/vue/Prefetch'
  const products = [
    {
      name: 'Red Shirt',
      description: "The nicest red shirt you've ever seen",
    },
    {
      name: 'Blue Pants',
      description: 'Always blue! Always blue!',
    },
    {
      name: 'Green Shoes',
      description: "These shoes may be green, but they won't cost you a lot of green.",
    },
  ]
  export default {
    name: 'product',
    components: { Prefetch },
    async asyncData({ params }) {
      return {
        products,
        product: products[parseInt(params.productId)] || products[0],
      }
    },
  }
</script>

<style scoped></style>
