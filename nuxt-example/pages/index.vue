<template>
  <div>
    <h1>Blog posts</h1>
    <p v-if="$fetchState.pending">Fetching post...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <ul v-else>
      <li v-for="post of posts" :key="post.id">
        <Prefetch :url="`/api/posts/${post.id}`" immediately>
          <n-link :to="`/posts/${post.id}`">
            {{ post.title }}
          </n-link>
        </Prefetch>
      </li>
    </ul>
  </div>
</template>

<script>
import { Prefetch } from "@xdn/vue";

export default {
  components: {
    Prefetch
  },
  async fetch() {
    this.posts = await fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(posts => posts.slice(0, 5));
  },
  data() {
    return {
      posts: null
    };
  }
};
</script>
