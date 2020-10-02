<template>
  <div class="single-article">
    <div class="image">
      <img :src="blog.articleByHandle.image.originalSrc" />
    </div>
    <div class="header">
      <h4>{{ blog.articleByHandle.title }}</h4>
      <small>{{ blog.articleByHandle.publishedAt }} Posted by {{ blog.articleByHandle.authorV2.name }}</small>
    </div>
    <div class="description" v-html="blog.articleByHandle.contentHtml" />
  </div>
</template>
<script>

import { useArticle } from '@vue-storefront/shopify';

export default {
  async asyncData ({ params }) {
    const { loadArticle } = useArticle();
    const { blogs } = await loadArticle(params.slug);
    return { blog: blogs[0], title: blogs[0].articleByHandle.title }
  },
  head () {
    return {
      title: this.title
    }
  }
};

</script>

<style lang="scss">
.single-article {
  margin-bottom: 25px;
  .header {
    padding: 25px 0 0 0;
    margin-bottom: 0;
    h4 {
      font-size: 28px;
      font-weight: normal;
    }
  }
  .description {
    padding: 25px 0 0 0;
    line-height: 26px;
    color: #595c65;
  }
  .image {
    max-height: 500px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
</style>
