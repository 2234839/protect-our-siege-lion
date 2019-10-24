<template>
  <div id="app">
    <img @click.right="hide" class="bg" src="./assets/bg.jpg" alt />
  </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.bg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
}
</style>
