<template>
  <div id="app">
    <div class="box1">
      <div class="one">*</div>
      <div class="two">*</div>
      <!-- <div class="three">*</div> -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
.box1 {
  height: 200px;
  width: 200px;
  background-color: aquamarine;
  margin: auto;
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
  /* align-items: center */
}
.one,.two,.three {
  display: inline-block;
  font-size: 50px
}
.two {
  align-self: center;
}
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
