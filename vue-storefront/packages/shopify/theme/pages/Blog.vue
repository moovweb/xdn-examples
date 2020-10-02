<template>
  <div id="articles">
    <h3>Blogs</h3>
    <div
      v-for="article in articles"
      :key="article.cursor"
      class="article"
    >
      <div class="image">
        <img :src="article.image.originalSrc" />
      </div>
      <div class="header">
        <h4>
          <nuxt-link :to="'/blog/' + article.handle">
            {{ article.title }}
          </nuxt-link>
        </h4>
        <small>{{ article.publishedAt }} Posted by {{ article.authorV2.name }}</small>
      </div>
      <div class="description" v-html="article.excerptHtml" />
    </div>
    <nav class="sf-pagination">
      <slot name="next">
        <div class="sf-pagination__item sf-pagination__item--next">
          <SfLink
            :class="{
            'sf-button--pure': !hasRouter,
          }"
            aria-label="Go to previous next"
          >
            <SfIcon icon="arrow_right" size="2rem" />
          </SfLink>
        </div>
      </slot>
    </nav>
  </div>
</template>

<script>
import { useArticle } from '@vue-storefront/shopify';
import { SfPagination, SfIcon, SfLink } from '@storefront-ui/vue';

export default {
  name: 'Blog',
  components: {
    SfPagination,
    SfIcon,
    SfLink
  },
  head () {
    return {
      title: 'Blogs'
    }
  },
  async asyncData () {
    const { articles } = useArticle();
    let blogs = await articles();
    return { articles: blogs.articles };
  }
};
</script>

<style lang="scss">
  #articles {
    .article {
      margin-bottom: 25px;
      border: 1px solid #d4d4d4;
      border-radius: 5px;
      .header {
        padding: 25px 25px 0 25px;
        margin-bottom: 0;
        h4 {
          font-size: 24px;
          font-weight: normal;
        }
      }
      .description {
        padding: 25px;
      }
      .image {
        max-height: 250px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
  }
</style>
