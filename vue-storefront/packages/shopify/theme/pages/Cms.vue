<template>
  <div id="cms">
    <h1>CMS Page</h1>
    <div
      v-for="page in pages"
      :key="page.cursor"
      class="cms-page"
    >
      <h4>
        <nuxt-link :to="'/pages/' + page.node.handle">
          {{ page.node.title }}
        </nuxt-link>
      </h4>
      <p v-html="page.node.body"></p>
    </div>
  </div>
</template>
<script>

import { useContent } from '@vue-storefront/shopify';

export default {
  name: 'Cms',
  async asyncData ({ params }) {
    const { pages } = useContent();
    let result = await pages();
    return { pages: result.pages.edges }
  },
  head () {
    return {
      title: 'Cms Pages'
    }
  }
};

</script>

<style lang="scss">
  #cms {
    .cms-page {
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
  }
</style>
