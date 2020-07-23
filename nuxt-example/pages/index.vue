<template>
  <div>
    <h1>Blog posts</h1>
    <template v-if="$fetchState.pending">
      <content-placeholders>
        <content-placeholders-text :lines="20" />
      </content-placeholders>
    </template>
    <template v-else-if="$fetchState.error">
      <p>Error while fetching posts: {{ $fetchState.error }}</p>
    </template>
    <template v-else>
      <ul>
        <li v-for="post of posts" :key="post.id">
          <Prefetch :url="`/api/posts/${post.id}`" immediately>
            <n-link :to="`/posts/${post.id}`">
              {{ post.title }}
            </n-link>
          </Prefetch>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { Prefetch } from "@xdn/vue";

export default {
  components: {
    Prefetch
  },
  async fetch() {
    this.posts = await this.$http
      .$get("/api/posts")
      .then(posts => posts.slice(0, 5));
  },
  data() {
    return {
      posts: null
    };
  }
};
</script>
