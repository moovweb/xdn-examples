<template>
  <div>
    <button @click="$fetch">
      Refresh
    </button>
    <p v-if="$fetchState.pending">Fetching post...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <h1>{{ post.title }}</h1>
      <pre>{{ post.body }}</pre>
    </div>
    <p>
      <n-link to="/">
        Home
      </n-link>
    </p>
  </div>
</template>

<script>
export default {
  async fetch() {
    const { params } = this.$route
    this.post = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`).then(res => res.json());
  },
  data() {
    return {
      post: null
    };
  },
  head() {
    return { title: this.post ? this.post.title : 'Loading...' };
  }
};
</script>
