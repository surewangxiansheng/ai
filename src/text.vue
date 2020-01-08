<template>
  <div id="qq">
    {{ee}}
  </div>
</template>

<script>

export default {
  name: 'qq',
  data() {
    return {
      ee:this.$store.state.text
    }
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
